export const siteConfig = {
  name: "Cristian Gatu",
  title: "Cristian Gatu — Full-Stack Developer",
  description:
    "Senior Full-Stack Engineer building scalable, API-driven systems across fintech, supply chain, and publishing. React, Next.js, Node.js, GraphQL, PostgreSQL.",
  url: "https://sircqq.vercel.app",
  location: "Iași, Romania",
  email: "gatucristian@gmail.com",
  links: {
    // TODO: add your GitHub profile URL
    github: "https://github.com/SirCQQ",
    linkedin: "https://www.linkedin.com/in/cristian-gatu-06b0811a1/",
  },
  nav: [
    { key: "home", href: "/" },
    { key: "work", href: "/work" },
    { key: "articles", href: "/articles" },
    { key: "contact", href: "/#contact" },
  ],
} as const;
