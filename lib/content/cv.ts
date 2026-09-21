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

export function getCvContent(locale: Locale): CvContent {
  return content[locale];
}
