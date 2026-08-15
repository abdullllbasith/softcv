import React from 'react';
import { ResumeData } from '@/types/resume';
import { useResumeStore } from '@/store/useResumeStore';
import { renderExtraSection } from './renderExtraSections';

interface TemplateProps {
  data: ResumeData;
  focusedFieldId?: string | null;
}

export const ProfessionalTemplate: React.FC<TemplateProps> = ({ data, focusedFieldId }) => {
  const { navigateToField } = useResumeStore();
  const { personalInfo, summary, experience, education, skills, sectionOrder, sectionVisibility, accentColor } = data;

  const isVisible = (key: string) => sectionVisibility?.[key] !== false;
  const isFocused = (fieldId: string) => focusedFieldId === fieldId;

  const Heading = ({ title }: { title: string }) => (
    <h2
      className="text-[11px] font-bold uppercase tracking-[0.14em] font-sans pb-1 mb-2 border-b text-slate-800"
      style={{ borderColor: accentColor }}
    >
      {title}
    </h2>
  );

  return (
    <div
      className="resume-sheet resume-sheet--professional bg-white text-slate-900 text-xs font-serif select-text"
    >
      {/* Header */}
      <header
        className="resume-section text-center space-y-2.5 border-b-2 pb-5 mb-6"
        style={{ borderColor: accentColor }}
      >
        <div
          onClick={() => navigateToField('field-personalInfo-fullName', 'personalInfo')}
          className={`rounded px-1 py-0.5 cursor-pointer transition-all ${
            isFocused('personalInfo.fullName') ? 'bg-teal-50/60' : ''
          }`}
          title="Click to edit name"
        >
          <h1 className="text-2xl font-bold tracking-wide uppercase text-slate-900">
            {personalInfo.fullName || 'Alex Morgan'}
          </h1>
          <p className="text-xs italic font-sans font-medium text-slate-600 mt-1">
            {personalInfo.title}
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-x-2.5 gap-y-1 text-[11px] font-sans text-slate-600 px-1">
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.email && <span>· {personalInfo.email}</span>}
          {personalInfo.phone && <span>· {personalInfo.phone}</span>}
          {personalInfo.linkedin && <span>· {personalInfo.linkedin}</span>}
        </div>
      </header>

      <div className="space-y-5">
        {sectionOrder.map((sectionKey) => {
          if (!isVisible(sectionKey)) return null;

          if (sectionKey === 'summary' && summary) {
            return (
              <section key="summary" className="resume-section">
                <Heading title="Executive Summary" />
                <p
                  onClick={() => navigateToField('field-summary', 'summary')}
                  className="text-slate-800 leading-relaxed font-serif text-[11.5px] hover:outline hover:outline-2 hover:outline-teal-400 hover:outline-dashed rounded p-1 cursor-pointer transition-all"
                >
                  {summary}
                </p>
              </section>
            );
          }

          if (sectionKey === 'experience' && experience.length > 0) {
            return (
              <section key="experience" className="resume-section">
                <Heading title="Professional Experience" />
                <div className="space-y-3.5">
                  {experience.map((exp) => (
                    <div
                      key={exp.id}
                      onClick={() => navigateToField(`field-exp-${exp.id}`, 'experience')}
                      className="resume-entry hover:outline hover:outline-2 hover:outline-teal-400 hover:outline-dashed rounded p-1 cursor-pointer transition-all space-y-1"
                    >
                      <div className="flex justify-between gap-3 font-bold text-slate-900 font-sans text-xs">
                        <span className="min-w-0">{exp.role}</span>
                        <span className="font-normal text-slate-600 text-[11px] shrink-0 whitespace-nowrap">
                          {exp.startDate} – {exp.endDate}
                        </span>
                      </div>
                      <div className="flex justify-between gap-3 text-slate-700 italic text-[11px]">
                        <span className="min-w-0">{exp.company}</span>
                        <span className="shrink-0">{exp.location}</span>
                      </div>
                      {exp.bullets && exp.bullets.length > 0 && (
                        <ul className="resume-bullets space-y-0.5 text-slate-800 font-serif text-[11px] leading-relaxed pt-0.5">
                          {exp.bullets.map((b, idx) => (
                            <li key={idx}>{b}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (sectionKey === 'education' && education.length > 0) {
            return (
              <section key="education" className="resume-section">
                <Heading title="Education" />
                <div className="space-y-2">
                  {education.map((edu) => (
                    <div
                      key={edu.id}
                      onClick={() => navigateToField(`field-edu-${edu.id}`, 'education')}
                      className="resume-entry hover:outline hover:outline-2 hover:outline-teal-400 hover:outline-dashed rounded p-1 cursor-pointer transition-all flex justify-between items-baseline gap-3"
                    >
                      <div className="min-w-0">
                        <span className="font-bold text-slate-900 font-sans">
                          {edu.degree}
                          {edu.field ? ` in ${edu.field}` : ''}
                        </span>
                        <span className="text-slate-700 italic text-[11px] ml-2">
                          — {edu.institution}
                        </span>
                      </div>
                      <span className="text-slate-600 text-[11px] font-sans shrink-0 whitespace-nowrap">
                        {edu.startDate} – {edu.endDate}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (sectionKey === 'skills' && skills.length > 0) {
            return (
              <section key="skills" className="resume-section">
                <Heading title="Skills & Technical Expertise" />
                <div className="space-y-1.5">
                  {skills.map((group) => (
                    <div
                      key={group.id}
                      onClick={() => navigateToField(`field-skill-${group.id}`, 'skills')}
                      className="resume-entry hover:outline hover:outline-2 hover:outline-teal-400 hover:outline-dashed rounded p-1 cursor-pointer transition-all text-[11px] font-sans"
                    >
                      <span className="font-bold text-slate-900">{group.category}: </span>
                      <span className="text-slate-700">{group.skills.join(', ')}</span>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          const extra = renderExtraSection({
            sectionKey,
            data,
            navigateToField,
            Heading,
          });
          if (!extra) return null;
          return (
            <section key={sectionKey} className="resume-section">
              {extra}
            </section>
          );
        })}
      </div>
    </div>
  );
};
