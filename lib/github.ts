import { siteConfig } from "@/lib/site-config";

export type GithubActivityKind =
  | "push"
  | "create"
  | "pullRequestOpened"
  | "pullRequestMerged"
  | "pullRequestClosed"
  | "issueOpened"
  | "issueClosed"
  | "release"
  | "fork"
  | "star";

export type GithubActivityItem = {
  id: string;
  kind: GithubActivityKind;
  repo: string;
  repoUrl: string;
  createdAt: string;
  commitCount?: number;
};

type GithubEvent = {
  id: string;
  type: string;
  created_at: string;
  repo: { name: string };
  payload: Record<string, unknown>;
};

function githubUsername(): string | null {
  try {
    return new URL(siteConfig.links.github).pathname.replace(/^\/|\/$/g, "");
  } catch {
    return null;
  }
}

function mapEvent(event: GithubEvent): GithubActivityItem | null {
  const base = {
    id: event.id,
    repo: event.repo.name,
    repoUrl: `https://github.com/${event.repo.name}`,
    createdAt: event.created_at,
  };

  switch (event.type) {
    case "PushEvent": {
      const commits = event.payload.commits;
      return {
        ...base,
        kind: "push",
        commitCount: Array.isArray(commits) ? commits.length : 1,
      };
    }
    case "CreateEvent":
      return event.payload.ref_type === "repository"
        ? { ...base, kind: "create" }
        : null;
    case "PullRequestEvent": {
      const action = event.payload.action;
      const merged = Boolean(
        (event.payload.pull_request as { merged?: boolean } | undefined)
          ?.merged
      );
      if (action === "opened") return { ...base, kind: "pullRequestOpened" };
      if (action === "closed")
        return { ...base, kind: merged ? "pullRequestMerged" : "pullRequestClosed" };
      return null;
    }
    case "IssuesEvent": {
      const action = event.payload.action;
      if (action === "opened") return { ...base, kind: "issueOpened" };
      if (action === "closed") return { ...base, kind: "issueClosed" };
      return null;
    }
    case "ReleaseEvent":
      return { ...base, kind: "release" };
    case "ForkEvent":
      return { ...base, kind: "fork" };
    case "WatchEvent":
      return { ...base, kind: "star" };
    default:
      return null;
  }
}

/**
 * Recent public activity for the configured GitHub profile, via the
 * unauthenticated Events API. Cached for an hour (Next's fetch cache) so
 * traffic never gets close to GitHub's 60 req/hour unauthenticated limit.
 */
export async function getGithubActivity(
  limit = 5
): Promise<GithubActivityItem[]> {
  const username = githubUsername();
  if (!username) return [];

  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/events/public`,
      {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: 3600 },
      }
    );
    if (!response.ok) return [];

    const events = (await response.json()) as GithubEvent[];
    const activity: GithubActivityItem[] = [];

    for (const event of events) {
      const item = mapEvent(event);
      if (item) activity.push(item);
      if (activity.length >= limit) break;
    }

    return activity;
  } catch {
    return [];
  }
}
