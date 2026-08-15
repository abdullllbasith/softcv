import React from 'react';
import { ResumeData } from '@/types/resume';
import { useResumeStore } from '@/store/useResumeStore';
import { renderExtraSection } from './renderExtraSections';

interface TemplateProps {
  data: ResumeData;
  focusedFieldId?: string | null;
}

export const AtsTemplate: React.FC<TemplateProps> = ({ data, focusedFieldId }) => {
  const { navigateToField } = useResumeStore();
  const { personalInfo, summary, experience, education, skills, sectionOrder, sectionVisibility } = data;

  const isVisible = (key: string) => sectionVisibility?.[key] !== false;

  const Heading = ({ title }: { title: string }) => (
    <h2 className="font-bold uppercase tracking-wider text-black border-b border-black pb-0.5">{title}</h2>
  );

  return (
    <div className="resume-sheet bg-white text-black font-serif text-xs leading-normal space-y-4 select-text">
      {/* ATS Plain Text Header */}
      <div className="resume-section text-center space-y-1">
        <h1
          onClick={() => navigateToField('field-personalInfo-fullName', 'personalInfo')}
          className="text-xl font-bold uppercase tracking-widest cursor-pointer hover:underline"
        >
          {personalInfo.fullName || 'Alex Morgan'}
        </h1>
        <p
          onClick={() => navigateToField('field-personalInfo-title', 'personalInfo')}
          className="font-medium text-slate-800 cursor-pointer hover:underline"
        >
          {personalInfo.title}
        </p>
        <p className="text-[11px] text-slate-700">
          {[personalInfo.email, personalInfo.phone, personalInfo.location, personalInfo.website, personalInfo.linkedin]
            .filter(Boolean)
            .join(' | ')}
        </p>
      </div>

      {/* Sections */}
      {sectionOrder.map((sectionKey) => {
        if (!isVisible(sectionKey)) return null;

        if (sectionKey === 'summary' && summary) {
          return (
            <div key="summary" className="resume-section space-y-1">
              <h2 className="font-bold uppercase tracking-wider text-black border-b border-black pb-0.5">
                SUMMARY
              </h2>
              <p
                onClick={() => navigateToField('field-summary', 'summary')}
                className="text-black cursor-pointer hover:outline hover:outline-1 hover:outline-black rounded p-0.5"
              >
                {summary}
              </p>
            </div>
          );
        }

        if (sectionKey === 'experience' && experience.length > 0) {
          return (
            <div key="experience" className="resume-section space-y-2">
              <h2 className="font-bold uppercase tracking-wider text-black border-b border-black pb-0.5">
                WORK EXPERIENCE
              </h2>
              <div className="space-y-3">
                {experience.map((exp) => (
                  <div
                    key={exp.id}
                    onClick={() => navigateToField(`field-exp-${exp.id}`, 'experience')}
                    className="space-y-1 cursor-pointer hover:outline hover:outline-1 hover:outline-black rounded p-0.5"
                  >
                    <div className="flex justify-between font-bold">
                      <span>{exp.company} — {exp.role}</span>
                      <span>{exp.startDate} - {exp.endDate}</span>
                    </div>
                    {exp.bullets && (
                      <ul className="resume-bullets space-y-0.5">
                        {exp.bullets.map((b, idx) => (
                          <li key={idx}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        }

        if (sectionKey === 'education' && education.length > 0) {
          return (
            <div key="education" className="resume-section space-y-1">
              <h2 className="font-bold uppercase tracking-wider text-black border-b border-black pb-0.5">
                EDUCATION
              </h2>
              {education.map((edu) => (
                <div
                  key={edu.id}
                  onClick={() => navigateToField(`field-edu-${edu.id}`, 'education')}
                  className="flex justify-between font-bold cursor-pointer hover:outline hover:outline-1 hover:outline-black rounded p-0.5"
                >
                  <span>{edu.institution} — {edu.degree} in {edu.field}</span>
                  <span>{edu.startDate} - {edu.endDate}</span>
                </div>
              ))}
            </div>
          );
        }

        if (sectionKey === 'skills' && skills.length > 0) {
          return (
            <div key="skills" className="resume-section space-y-1">
              <Heading title="TECHNICAL SKILLS" />
              {skills.map((group) => (
                <div
                  key={group.id}
                  onClick={() => navigateToField(`field-skill-${group.id}`, 'skills')}
                  className="cursor-pointer hover:outline hover:outline-1 hover:outline-black rounded p-0.5"
                >
                  <span className="font-bold">{group.category}: </span>
                  <span>{group.skills.join(', ')}</span>
                </div>
              ))}
            </div>
          );
        }

        const extra = renderExtraSection({
          sectionKey,
          data,
          navigateToField,
          Heading,
          itemClassName: 'cursor-pointer hover:outline hover:outline-1 hover:outline-black rounded p-0.5',
        });
        if (!extra) return null;
        return (
          <div key={sectionKey} className="resume-section">
            {extra}
          </div>
        );
      })}
    </div>
  );
};
