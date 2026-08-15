export type TemplateId = 'minimal' | 'modern' | 'professional' | 'creative' | 'compact' | 'ats';

export interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
  photoUrl?: string;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  location?: string;
  startDate: string;
  endDate: string | "Present";
  isCurrent?: boolean;
  bullets: string[];
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
  gpa?: string;
}

export interface SkillGroup {
  id: string;
  category: string;
  skills: string[];
  displayStyle: "tags" | "bars" | "dots" | "commaList";
}

export interface ProjectEntry {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  link?: string;
  bullets: string[];
}

export interface CertificationEntry {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
}

export interface LanguageEntry {
  id: string;
  language: string;
  proficiency: "Basic" | "Conversational" | "Fluent" | "Native";
}

export interface AwardEntry {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
}

export interface CustomSection {
  id: string;
  title: string;
  content: string;
}

export interface SectionVisibility {
  personalInfo: boolean;
  summary: boolean;
  experience: boolean;
  education: boolean;
  skills: boolean;
  projects: boolean;
  certifications: boolean;
  languages: boolean;
  awards: boolean;
  customSections: boolean;
}

export interface ResumeData {
  templateId: TemplateId;
  accentColor: string;
  fontFamily?: string;
  personalInfo: PersonalInfo;
  summary: string;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: SkillGroup[];
  projects: ProjectEntry[];
  certifications: CertificationEntry[];
  languages: LanguageEntry[];
  awards: AwardEntry[];
  customSections: CustomSection[];
  sectionOrder: string[];
  sectionVisibility?: Record<string, boolean>;
}

export interface ResumeProfile {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  data: ResumeData;
}
