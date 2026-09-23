import type { CvContent } from "./cv";

export const ro: CvContent = {
  summary:
    "Inginer Full-Stack Senior cu peste {{years}} ani de experiență în proiectarea și scalarea sistemelor bazate pe API în fintech, supply chain și publicare digitală. Expertiză solidă în React, Next.js, Node.js, GraphQL și PostgreSQL, cu accent pe arhitectura sistemelor, performanță și infrastructură cloud (AWS). Confortabil în a lua decizii tehnice, a colabora cu arhitecții la proiectarea sistemelor și a îndruma ingineri juniori.",
  about: {
    paragraphs: [
      "Sunt Inginer Full-Stack Senior din Iași, cu peste {{years}} ani de experiență în construirea și scalarea sistemelor bazate pe API pentru companii din fintech, supply chain și publicare digitală. Activitatea mea zilnică se concentrează pe React, Next.js, Node.js, GraphQL și PostgreSQL, dar îmi pasă la fel de mult de tot ce înconjoară codul — arhitectură, performanță și infrastructura cloud pe care rulează.",
      "Am condus rescrieri de aplicații legacy, am construit produse de la zero și am petrecut mult timp în munca mai puțin vizibilă, dar esențială, de a menține sistemele distribuite fiabile. Îmi place să colaborez îndeaproape cu arhitecții la design-ul sistemelor și mă bucur să îndrum ingineri juniori — un code review bun e una dintre cele mai bune metode pe care le știu pentru a ridica nivelul unei echipe.",
      "În afara proiectelor pentru clienți, mai am câteva proiecte personale active, inclusiv acest site, și sunt mereu în căutarea următoarei probleme interesante de rezolvat.",
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
      title: "Developer Full-Stack",
      company: "rinf.tech",
      location: "Iași",
      period: "Martie 2025 – Prezent",
      intro:
        "Proiectez și scalez aplicații web robuste în strânsă colaborare cu arhitecți și ingineri seniori, contribuind direct la design-ul sistemului și direcția tehnică.",
      highlights: [
        "Arhitecturez sisteme scalabile și ușor de întreținut folosind React, TypeScript, PostgreSQL, GraphQL și AWS (inclusiv SQS)",
        "Contribui la planificarea sprint-urilor și la direcția tehnică într-o echipă Agile cross-funcțională",
        "Optimizez performanța bazei de date și tiparele de acces la date pentru interogări eficiente",
        "Diagnostichez și rezolv probleme complexe de fiabilitate în sisteme distribuite",
      ],
      stack: ["React", "TypeScript", "PostgreSQL", "GraphQL", "AWS", "SQS"],
    },
    {
      title: "Developer Full-Stack (Contract)",
      company: "Payset",
      location: "Remote",
      period: "Aprilie 2024 – Mai 2025",
      intro:
        "Am construit și scalat aplicații fintech care gestionează fluxuri de date financiare într-o arhitectură de micro­servicii, cu accent puternic pe integritatea datelor și fiabilitatea sistemului.",
      highlights: [
        "Am dezvoltat interfețe pentru clienți în React și unelte back-office în Remix, susținute de micro­servicii TypeScript și NestJS",
        "Am proiectat sisteme distribuite pentru fluxuri de date financiare, prioritizând consistența, fiabilitatea și integritatea datelor",
        "Am integrat API-uri securizate și performante între servicii, într-un mediu bancar reglementat",
        "Am colaborat cu arhitecții la definirea limitelor serviciilor, tiparelor de integrare și design-ul sistemului",
        "Am depanat probleme complexe între servicii, îmbunătățind stabilitatea în producție",
      ],
      stack: ["React", "Remix", "TypeScript", "NestJS", "PostgreSQL"],
    },
    {
      title: "Developer Full-Stack",
      company: "Eviden",
      location: "Remote",
      period: "Martie 2024 – Aprilie 2025",
      intro:
        "Am construit și scalat aplicații web în paralel cu proiectul Payset, contribuind la planificarea sprint-urilor și la deciziile tehnice.",
      highlights: [
        "Am dezvoltat și întreținut aplicații folosind Next.js, TypeScript, PostgreSQL și AWS",
        "Am optimizat interogările bazei de date și am îmbunătățit performanța generală a aplicației",
        "Am diagnosticat și rezolvat probleme în sistemele existente aflate în producție",
      ],
      stack: ["Next.js", "TypeScript", "PostgreSQL", "AWS"],
    },
    {
      title: "Developer Full-Stack",
      company: "Haufe Group",
      location: "Remote",
      period: "Noiembrie 2022 – Martie 2024",
      intro:
        "Am condus rescrierea unei platforme legacy a companiei și am livrat un al doilea produs, conturând direcția tehnică pentru ambele proiecte.",
      highlights: [
        "Am rescris integral o aplicație legacy folosind Remix, GraphQL, TypeScript, AWS și Pulumi (Infrastructure as Code)",
        "Am construit un al doilea produs folosind React, Next.js, Tailwind, Express, MongoDB și PostgreSQL",
        "Am contribuit la planificarea sprint-urilor și la deciziile arhitecturale într-o echipă Agile",
        "Am livrat funcționalități noi cu cod curat și ușor de întreținut, respectând bunele practici de inginerie",
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
      title: "Developer Full-Stack (Contract / Freelance)",
      company: "Seed2shelf Inc",
      location: "România / Remote",
      period: "Decembrie 2021 – Iulie 2022",
      intro:
        "Am fost responsabil de arhitectura front-end și API pentru o platformă SaaS care ajută laboratoare de producție să gestioneze inventarul, transportul și fluxul de lucru — inclusiv integrarea cu Metrc.",
      highlights: [
        "Am proiectat și construit de la zero arhitectura front-end și stratul de API",
        "Am redactat documentație tehnică și am coordonat code review-urile echipei",
        "Am îndrumat doi ingineri juniori, susținându-le dezvoltarea tehnică",
        "Am tradus cerințele clienților în task-uri tehnice clare și obiective de sprint",
      ],
      stack: ["TypeScript", "Node.js", "React", "Next.js", "NestJS", "MariaDB", "Bitbucket"],
    },
    {
      title: "Developer Full-Stack",
      company: "Skywind Group",
      location: "Iași",
      period: "Octombrie 2020 – Iunie 2021",
      intro:
        "Am livrat integral două produse: o platformă de conținut sportiv și pariuri, și o aplicație de administrare a proprietăților care conectează proprietari, administratori și chiriași.",
      highlights: [
        "Am întreținut și extins o platformă legacy de sport/pariuri, inclusiv o funcționalitate nouă de calendar care leagă meciurile de articole etichetate",
        "Am construit o aplicație de administrare a proprietăților, implementând design-uri pixel-perfect și integrând modulul de facturare pentru abonamente",
        "Am scris componente React reutilizabile și ușor de întreținut, precum și API-uri eficiente și bine documentate",
      ],
      stack: ["React", "Redux", "Express", "MongoDB", "MySQL", "Redis", "Styled-Components", "TypeScript"],
    },
    {
      title: "Developer Full-Stack",
      company: "Bytex Technologies",
      location: "Iași",
      period: "Februarie 2019 – Aprilie 2020",
      intro:
        "Am contribuit la Powercode, o aplicație care ajută furnizorii de telecomunicații (TV, Internet, Telefonie) să gestioneze clienții și serviciile.",
      highlights: [
        "Am construit generarea facturilor și livrarea automată a PDF-urilor prin email",
        "Am implementat câmpuri definite de utilizator, notificări și gestionarea permisiunilor",
        "Am întreținut codul sursă, am reparat bug-uri și am implementat design-uri UI pixel-perfect",
      ],
      stack: ["JavaScript", "TypeScript", "Node.js", "React", "GraphQL", "MySQL"],
    },
    {
      title: "Developer de Aplicații Web (Internship)",
      company: "OSRAM Continental",
      location: "Iași",
      period: "Februarie 2019 – Mai 2021",
      intro:
        "Am construit o unealtă desktop care parsa fișiere Excel structurate și permitea inginerilor să organizeze parametri în sub-module, eficientizând fluxurile interne de lucru.",
      highlights: [
        "Am livrat o aplicație desktop cross-platform folosind React, Electron și un backend Flask",
        "Am optimizat aplicația pentru seturi mari de date",
        "Am îndrumat un nou intern și am participat la code review-uri",
      ],
      stack: ["React", "Electron", "Flask", "Node.js", "MySQL"],
    },
  ],
  education: [
    {
      degree: "Licență, Informatică",
      institution: 'Universitatea "Alexandru Ioan Cuza"',
      location: "Iași",
      period: "2017 – 2020",
    },
  ],
  projects: [
    {
      name: "Unealtă internă — Catena Electric Iași",
      description:
        "Unealtă internă freelance pentru redactarea și editarea contractelor și actelor adiționale, cu bază de date de clienți integrată.",
      period: "2022 – prezent (mentenanță ocazională)",
      url: "https://catenaelectric.ro/",
      image: "/images/catena.jpg",
      stack: ["Next.js", "MongoDB"],
    },
    {
      name: "Seed2Shelf",
      description:
        "O platformă SaaS care ajută laboratoare de producție să gestioneze inventarul, transportul și fluxul de lucru, inclusiv integrarea cu Metrc. Am fost responsabil de arhitectura front-end și API.",
      period: "Decembrie 2021 – Iulie 2022",
      url: "http://seed2shelf.us/",
      image: "/images/s2s-logo.png",
      stack: ["TypeScript", "Node.js", "React", "Next.js", "NestJS", "MariaDB"],
    },
    {
      name: "Powercode",
      description:
        "O aplicație care ajută furnizorii de telecomunicații (TV, Internet, Telefonie) să gestioneze clienții și serviciile — generarea facturilor, notificări și gestionarea permisiunilor.",
      period: "Februarie 2019 – Aprilie 2020",
      url: "https://powercode.com",
      image: "/images/powercode-logo.png",
      stack: ["JavaScript", "TypeScript", "Node.js", "React", "GraphQL", "MySQL"],
    },
    {
      name: "Portofoliu Personal",
      description:
        "Acest site — construit cu Next.js, shadcn/ui și un sistem de design bilingv, cu teme configurabile.",
      url: "https://sircqq.vercel.app",
      stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    },
  ],
};
