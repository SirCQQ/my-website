import type { CvContent } from "./cv";

export const en: CvContent = {
  summary:
    "Senior Full-Stack Engineer with 6+ years of experience designing and scaling API-driven systems across fintech, supply chain, and digital publishing. Deep expertise in React, Next.js, Node.js, GraphQL, and PostgreSQL, with a strong focus on system architecture, performance, and cloud infrastructure (AWS). Comfortable driving technical decisions, partnering with architects on system design, and mentoring junior engineers.",
  about: {
    paragraphs: [
      "I'm a Senior Full-Stack Engineer based in Iași, Romania, with 6+ years of experience building and scaling API-driven systems for fintech, supply chain, and digital publishing companies. My day-to-day centers on React, Next.js, Node.js, GraphQL, and PostgreSQL, but I care just as much about the system around the code — architecture, performance, and the cloud infrastructure it runs on.",
      "I've led legacy rewrites, built products from scratch, and spent a lot of time in the unglamorous but critical work of keeping distributed systems reliable. I like partnering closely with architects on system design, and I enjoy mentoring junior engineers — a good code review is one of the best ways I know to level up a team.",
      "Outside of client work, I keep a couple of side projects running, including this site, and I'm always looking for the next interesting problem to dig into.",
    ],
  },
  coreSkills: [
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "GraphQL",
    "PostgreSQL",
    "AWS",
  ],
  experience: [
    {
      title: "Full-Stack Developer",
      company: "rinf.tech",
      location: "Iași",
      period: "March 2025 – Present",
      intro:
        "Designing and scaling robust web applications in close collaboration with architects and senior engineers, contributing directly to system design and technical direction.",
      highlights: [
        "Architect scalable, maintainable systems using React, TypeScript, PostgreSQL, GraphQL, and AWS (including SQS)",
        "Shape sprint planning and technical direction within a cross-functional Agile team",
        "Optimize database performance and data access patterns for high-efficiency queries",
        "Diagnose and resolve complex reliability issues across distributed systems",
      ],
      stack: ["React", "TypeScript", "PostgreSQL", "GraphQL", "AWS", "SQS"],
    },
    {
      title: "Full-Stack Developer (Contract)",
      company: "Payset",
      location: "Remote",
      period: "April 2024 – May 2025",
      intro:
        "Built and scaled fintech applications handling financial data flows within a microservices architecture, with a strong emphasis on data integrity and system reliability.",
      highlights: [
        "Developed customer-facing interfaces in React and back-office tooling in Remix, backed by TypeScript and NestJS microservices",
        "Designed distributed systems for financial data flows, prioritizing consistency, reliability, and data integrity",
        "Integrated secure, high-performance APIs across services in a regulated banking environment",
        "Partnered with architects on service boundaries, integration patterns, and system design",
        "Debugged complex cross-service issues, improving production stability",
      ],
      stack: ["React", "Remix", "TypeScript", "NestJS", "PostgreSQL"],
    },
    {
      title: "Full-Stack Developer",
      company: "Eviden",
      location: "Remote",
      period: "March 2024 – April 2025",
      intro:
        "Built and scaled web applications in parallel with the Payset engagement, contributing to sprint planning and technical decision-making.",
      highlights: [
        "Developed and maintained applications using Next.js, TypeScript, PostgreSQL, and AWS",
        "Optimized database queries and improved overall application performance",
        "Diagnosed and resolved issues across existing production systems",
      ],
      stack: ["Next.js", "TypeScript", "PostgreSQL", "AWS"],
    },
    {
      title: "Full-Stack Developer",
      company: "Haufe Group",
      location: "Remote",
      period: "November 2022 – March 2024",
      intro:
        "Led the rewrite of a legacy company platform and delivered a second product build, shaping technical direction across both efforts.",
      highlights: [
        "Rewrote a legacy application end-to-end using Remix, GraphQL, TypeScript, AWS, and Pulumi (Infrastructure as Code)",
        "Built a second product using React, Next.js, Tailwind, Express, MongoDB, and PostgreSQL",
        "Shaped sprint planning and contributed to architectural decisions within an Agile team",
        "Delivered new features with clean, maintainable code following engineering best practices",
      ],
      stack: [
        "Remix",
        "GraphQL",
        "TypeScript",
        "AWS",
        "Pulumi",
        "React",
        "Next.js",
        "Tailwind",
        "Express",
        "MongoDB",
        "PostgreSQL",
      ],
    },
    {
      title: "Full-Stack Developer (Contract / Freelance)",
      company: "Seed2shelf Inc",
      location: "Romania / Remote",
      period: "December 2021 – July 2022",
      intro:
        "Owned the front-end and API architecture for a SaaS platform helping production labs manage inventory, transport, and workflow — including integration with Metrc.",
      highlights: [
        "Designed and built the front-end architecture and API layer from the ground up",
        "Authored technical documentation and led code reviews for the team",
        "Mentored two junior developers, supporting their technical growth",
        "Translated client requirements into clear technical tasks and sprint goals",
      ],
      stack: ["TypeScript", "Node.js", "React", "Next.js", "NestJS", "MariaDB", "Bitbucket"],
    },
    {
      title: "Full-Stack Developer",
      company: "Skywind Group",
      location: "Iași",
      period: "October 2020 – June 2021",
      intro:
        "Delivered two products end-to-end: a sports and betting content platform, and a property management app connecting landlords, administrators, and tenants.",
      highlights: [
        "Maintained and extended a legacy sports/betting platform, including a new calendar feature linking games to tagged articles",
        "Built a property management app, implementing pixel-perfect designs and integrating the subscription billing module",
        "Wrote reusable, maintainable React components and effective, well-documented APIs",
      ],
      stack: ["React", "Redux", "Express", "MongoDB", "MySQL", "Redis", "Styled-Components", "TypeScript"],
    },
    {
      title: "Full-Stack Developer",
      company: "Bytex Technologies",
      location: "Iași",
      period: "February 2019 – April 2020",
      intro:
        "Contributed to Powercode, an application helping telecom providers (TV, Internet, Telephone) manage clients and services.",
      highlights: [
        "Built invoice generation and automated PDF delivery via email",
        "Implemented user-defined fields, notifications, and permission management",
        "Maintained the codebase, fixed bugs, and implemented pixel-perfect UI designs",
      ],
      stack: ["JavaScript", "TypeScript", "Node.js", "React", "GraphQL", "MySQL"],
    },
    {
      title: "Web Application Developer (Internship)",
      company: "OSRAM Continental",
      location: "Iași",
      period: "February 2019 – May 2021",
      intro:
        "Built a desktop tool that parsed structured Excel files and let engineers organize parameters into sub-modules, streamlining internal workflows.",
      highlights: [
        "Delivered a cross-platform desktop application using React, Electron, and a Flask backend",
        "Optimized the application for large datasets",
        "Mentored an incoming intern and participated in code reviews",
      ],
      stack: ["React", "Electron", "Flask", "Node.js", "MySQL"],
    },
  ],
  education: [
    {
      degree: "Bachelor's Degree, Computer Science",
      institution: '"Alexandru Ioan Cuza" University',
      location: "Iași",
      period: "2017 – 2020",
    },
  ],
  projects: [
    {
      name: "Internal tool — Catena Electric Iași",
      description:
        "Freelance internal tool for drafting and editing contracts and amendments, with an integrated client database.",
      period: "2022 – present (occasional maintenance)",
      stack: ["Next.js", "MongoDB"],
    },
    {
      name: "Personal Portfolio",
      description:
        "This site — built with Next.js, shadcn/ui, and a bilingual, themeable design system.",
      url: "https://sircqq.vercel.app",
      stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    },
  ],
};
