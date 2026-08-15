import React from 'react';
import { ResumeData } from '@/types/resume';
import { useResumeStore } from '@/store/useResumeStore';
import { renderExtraSection } from './renderExtraSections';

interface TemplateProps {
  data: ResumeData;
  focusedFieldId?: string | null;
}

export const CompactTemplate: React.FC<TemplateProps> = ({ data, focusedFieldId }) => {
  const { navigateToField } = useResumeStore();
  const { personalInfo, summary, experience, education, skills, sectionOrder, sectionVisibility, accentColor } = data;

  const isVisible = (key: string) => sectionVisibility?.[key] !== false;

  const Heading = ({ title }: { title: string }) => (
    <h2
      className="font-extrabold text-[11px] uppercase tracking-wider text-slate-900"
      style={{ color: accentColor }}
    >
      {title}
    </h2>
  );

  return (
    <div className="resume-sheet bg-white text-slate-800 text-[11px] leading-tight font-sans space-y-3.5 select-text">
      {/* Header */}
      <div className="resume-section flex justify-between items-end border-b pb-2" style={{ borderColor: accentColor }}>
        <div>
          <h1
            onClick={() => navigateToField('field-personalInfo-fullName', 'personalInfo')}
            className="text-lg font-extrabold text-slate-900 tracking-tight cursor-pointer hover:underline"
          >
            {personalInfo.fullName || 'Alex Morgan'}
          </h1>
          <p
            onClick={() => navigateToField('field-personalInfo-title', 'personalInfo')}
            className="font-semibold text-slate-700 cursor-pointer hover:underline"
          >
            {personalInfo.title}
          </p>
        </div>

        <div className="text-right text-[10px] text-slate-600 space-y-0.5">
          <div>{personalInfo.email} | {personalInfo.phone}</div>
          <div>{personalInfo.location} | {personalInfo.linkedin}</div>
        </div>
      </div>

      {/* Sections */}
      {sectionOrder.map((sectionKey) => {
        if (!isVisible(sectionKey)) return null;

        if (sectionKey === 'summary' && summary) {
          return (
            <div key="summary" className="resume-section space-y-0.5">
              <h2 className="font-extrabold text-[11px] uppercase tracking-wider text-slate-900" style={{ color: accentColor }}>
                Summary
              </h2>
              <p
                onClick={() => navigateToField('field-summary', 'summary')}
                className="text-slate-700 leading-normal cursor-pointer hover:outline hover:outline-1 hover:outline-teal-400 rounded p-0.5"
              >
                {summary}
              </p>
            </div>
          );
        }

        if (sectionKey === 'experience' && experience.length > 0) {
          return (
            <div key="experience" className="resume-section space-y-1.5">
              <h2 className="font-extrabold text-[11px] uppercase tracking-wider text-slate-900" style={{ color: accentColor }}>
                Experience
              </h2>
              <div className="space-y-2">
                {experience.map((exp) => (
                  <div
                    key={exp.id}
                    onClick={() => navigateToField(`field-exp-${exp.id}`, 'experience')}
                    className="space-y-0.5 cursor-pointer hover:outline hover:outline-1 hover:outline-teal-400 rounded p-0.5"
                  >
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{exp.role} <span className="font-semibold text-slate-600">@ {exp.company}</span></span>
                      <span className="text-[10px] text-slate-500 font-normal">{exp.startDate} – {exp.endDate}</span>
                    </div>
                    {exp.bullets && (
                      <ul className="resume-bullets space-y-0.5 text-slate-700 text-[10.5px]">
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
              <h2 className="font-extrabold text-[11px] uppercase tracking-wider text-slate-900" style={{ color: accentColor }}>
                Education
              </h2>
              {education.map((edu) => (
                <div
                  key={edu.id}
                  onClick={() => navigateToField(`field-edu-${edu.id}`, 'education')}
                  className="flex justify-between cursor-pointer hover:outline hover:outline-1 hover:outline-teal-400 rounded p-0.5"
                >
                  <div>
                    <span className="font-bold text-slate-900">{edu.degree} in {edu.field}</span>
                    <span className="text-slate-600 ml-2">— {edu.institution}</span>
                  </div>
                  <span className="text-slate-500 text-[10px]">{edu.startDate} – {edu.endDate}</span>
                </div>
              ))}
            </div>
          );
        }

        if (sectionKey === 'skills' && skills.length > 0) {
          return (
            <div key="skills" className="resume-section space-y-0.5">
              <Heading title="Skills" />
              {skills.map((group) => (
                <div
                  key={group.id}
                  onClick={() => navigateToField(`field-skill-${group.id}`, 'skills')}
                  className="cursor-pointer hover:outline hover:outline-1 hover:outline-teal-400 rounded p-0.5"
                >
                  <span className="font-bold text-slate-900">{group.category}: </span>
                  <span className="text-slate-700">{group.skills.join(', ')}</span>
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
          itemClassName: 'cursor-pointer hover:outline hover:outline-1 hover:outline-teal-400 rounded p-0.5',
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
