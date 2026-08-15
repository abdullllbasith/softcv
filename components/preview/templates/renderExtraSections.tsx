import React from 'react';
import {
  ResumeData,
  ProjectEntry,
  CertificationEntry,
  LanguageEntry,
  AwardEntry,
  CustomSection,
} from '@/types/resume';

type NavigateFn = (fieldId: string, sectionKey: string) => void;

export type SectionHeadingProps = {
  title: string;
};

type ExtraSectionArgs = {
  sectionKey: string;
  data: ResumeData;
  navigateToField: NavigateFn;
  Heading: React.FC<SectionHeadingProps>;
  itemClassName?: string;
};

/**
 * Renders projects / certifications / languages / awards / customSections
 * for templates that previously omitted them.
 */
export function renderExtraSection({
  sectionKey,
  data,
  navigateToField,
  Heading,
  itemClassName = 'resume-entry hover:outline hover:outline-2 hover:outline-teal-400 hover:outline-dashed rounded p-1 cursor-pointer transition-all',
}: ExtraSectionArgs): React.ReactNode {
  const { projects, certifications, languages, awards, customSections } = data;

  if (sectionKey === 'projects' && projects.length > 0) {
    return (
      <div key="projects" className="space-y-2">
        <Heading title="Projects" />
        <div className="space-y-2.5">
          {projects.map((proj: ProjectEntry) => (
            <div
              key={proj.id}
              onClick={() => navigateToField(`field-proj-${proj.id}`, 'projects')}
              className={`${itemClassName} space-y-0.5`}
            >
              <div className="flex justify-between items-baseline gap-2">
                <span className="font-bold text-slate-900">{proj.name}</span>
                {proj.link && (
                  <span className="text-[10px] text-slate-500 truncate max-w-[40%]">{proj.link}</span>
                )}
              </div>
              {proj.description && (
                <p className="text-slate-700 text-[11px] leading-relaxed">{proj.description}</p>
              )}
              {proj.techStack?.length > 0 && (
                <p className="text-[10px] text-slate-600">{proj.techStack.join(' · ')}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (sectionKey === 'certifications' && certifications.length > 0) {
    return (
      <div key="certifications" className="space-y-2">
        <Heading title="Certifications & Licenses" />
        <div className="space-y-1.5">
          {certifications.map((cert: CertificationEntry) => (
            <div
              key={cert.id}
              onClick={() => navigateToField(`field-cert-${cert.id}`, 'certifications')}
              className={`${itemClassName} flex justify-between items-baseline gap-2`}
            >
              <div>
                <span className="font-bold text-slate-900">{cert.name}</span>
                {cert.issuer && (
                  <span className="text-slate-600 text-[11px]"> — {cert.issuer}</span>
                )}
              </div>
              {cert.date && <span className="text-[11px] text-slate-500 shrink-0">{cert.date}</span>}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (sectionKey === 'languages' && languages.length > 0) {
    return (
      <div key="languages" className="space-y-2">
        <Heading title="Languages" />
        <div className="space-y-1">
          {languages.map((lang: LanguageEntry) => (
            <div
              key={lang.id}
              onClick={() => navigateToField(`field-lang-${lang.id}`, 'languages')}
              className={`${itemClassName} flex justify-between gap-2 text-[11px]`}
            >
              <span className="font-semibold text-slate-900">{lang.language}</span>
              <span className="text-slate-600">{lang.proficiency}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (sectionKey === 'awards' && awards.length > 0) {
    return (
      <div key="awards" className="space-y-2">
        <Heading title="Honors & Awards" />
        <div className="space-y-1.5">
          {awards.map((award: AwardEntry) => (
            <div
              key={award.id}
              onClick={() => navigateToField(`field-award-${award.id}`, 'awards')}
              className={`${itemClassName} space-y-0.5`}
            >
              <div className="flex justify-between items-baseline gap-2">
                <span className="font-bold text-slate-900">{award.title}</span>
                {award.date && <span className="text-[11px] text-slate-500 shrink-0">{award.date}</span>}
              </div>
              {award.issuer && <p className="text-[11px] text-slate-600">{award.issuer}</p>}
              {award.description && (
                <p className="text-[11px] text-slate-700 leading-relaxed">{award.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (sectionKey === 'customSections' && customSections.length > 0) {
    return (
      <React.Fragment key="customSections">
        {customSections.map((section: CustomSection) => (
          <div key={section.id} className="space-y-1.5">
            <Heading title={section.title || 'Custom Section'} />
            <p
              onClick={() => navigateToField(`field-custom-${section.id}`, 'customSections')}
              className={`${itemClassName} text-slate-700 leading-relaxed whitespace-pre-wrap text-[11px]`}
            >
              {section.content}
            </p>
          </div>
        ))}
      </React.Fragment>
    );
  }

  return null;
}
