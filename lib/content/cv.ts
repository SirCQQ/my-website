import type { Locale } from "@/i18n/routing";
import { en } from "./cv.en";
import { ro } from "./cv.ro";

export type Experience = {
  title: string;
  company: string;
  location: string;
  period: string;
  intro: string;
  highlights: string[];
  stack: string[];
};

export type Education = {
  degree: string;
  institution: string;
  location: string;
  period: string;
};

export type Project = {
  name: string;
  description?: string;
  period?: string;
  url?: string;
  image?: string;
  stack: string[];
};

export type CvContent = {
  summary: string;
  about: { paragraphs: string[] };
  coreSkills: string[];
  experience: Experience[];
  education: Education[];
  projects: Project[];
};

const content: Record<Locale, CvContent> = { en, ro };

const CAREER_START_DATE = new Date("2019-02-01");

export function getYearsOfExperience(now: Date = new Date()): number {
  let years = now.getFullYear() - CAREER_START_DATE.getFullYear();
  const hadAnniversaryThisYear =
    now.getMonth() > CAREER_START_DATE.getMonth() ||
    (now.getMonth() === CAREER_START_DATE.getMonth() &&
      now.getDate() >= CAREER_START_DATE.getDate());
  if (!hadAnniversaryThisYear) years -= 1;
  return years;
}

function withYearsOfExperience(text: string): string {
  return text.replace("{{years}}", String(getYearsOfExperience()));
}

export function getCvContent(locale: Locale): CvContent {
  const source = content[locale];

  return {
    ...source,
    summary: withYearsOfExperience(source.summary),
    about: {
      paragraphs: source.about.paragraphs.map(withYearsOfExperience),
    },
  };
}
