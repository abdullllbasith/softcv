import React from 'react';
import { ResumeData } from '@/types/resume';
import { useResumeStore } from '@/store/useResumeStore';
import { renderExtraSection } from './renderExtraSections';

interface TemplateProps {
  data: ResumeData;
  focusedFieldId?: string | null;
}

export const MinimalTemplate: React.FC<TemplateProps> = ({ data, focusedFieldId }) => {
  const { navigateToField } = useResumeStore();
  const { personalInfo, summary, experience, education, skills, sectionOrder, sectionVisibility, accentColor } = data;

  const isVisible = (key: string) => sectionVisibility?.[key] !== false;
  const isFocused = (fieldId: string) => focusedFieldId === fieldId;

  const Heading = ({ title }: { title: string }) => (
    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
      {title}
    </h2>
  );

  return (
    <div className="resume-sheet bg-white text-slate-800 text-xs font-sans select-text">
      <header className="resume-section text-center space-y-2 border-b border-slate-200 pb-5 mb-5">
        <div
          onClick={() => navigateToField('field-personalInfo-fullName', 'personalInfo')}
          className={`rounded px-1 py-0.5 cursor-pointer transition-all ${
            isFocused('personalInfo.fullName') ? 'bg-teal-50/60' : ''
          }`}
        >
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {personalInfo.fullName || 'Alex Morgan'}
          </h1>
          <p className="text-sm font-medium mt-0.5" style={{ color: accentColor }}>
            {personalInfo.title || 'Target Job Title'}
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-[11px] text-slate-600">
          {personalInfo.email && (
            <span
              onClick={() => navigateToField('field-personalInfo-email', 'personalInfo')}
              className="hover:underline cursor-pointer"
            >
              {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span
              onClick={() => navigateToField('field-personalInfo-phone', 'personalInfo')}
              className="hover:underline cursor-pointer"
            >
              · {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span
              onClick={() => navigateToField('field-personalInfo-location', 'personalInfo')}
              className="hover:underline cursor-pointer"
            >
              · {personalInfo.location}
            </span>
          )}
          {personalInfo.website && (
            <span
              onClick={() => navigateToField('field-personalInfo-website', 'personalInfo')}
              className="hover:underline cursor-pointer"
            >
              · {personalInfo.website}
            </span>
          )}
        </div>
      </header>

      <div className="space-y-5">
        {sectionOrder.map((sectionKey) => {
          if (!isVisible(sectionKey)) return null;

          if (sectionKey === 'summary' && summary) {
            return (
              <section key="summary" className="resume-section">
                <Heading title="Professional Summary" />
                <p
                  onClick={() => navigateToField('field-summary', 'summary')}
                  className={`text-slate-700 leading-relaxed rounded p-1 cursor-pointer transition-all ${
                    isFocused('summary') ? 'bg-teal-50/60' : ''
                  }`}
                >
                  {summary}
                </p>
              </section>
            );
          }

          if (sectionKey === 'experience' && experience.length > 0) {
            return (
              <section key="experience" className="resume-section">
                <Heading title="Work Experience" />
                <div className="space-y-3.5">
                  {experience.map((exp) => (
                    <div
                      key={exp.id}
                      onClick={() => navigateToField(`field-exp-${exp.id}`, 'experience')}
                      className="resume-entry rounded p-1 cursor-pointer transition-all space-y-1"
                    >
                      <div className="flex justify-between items-baseline gap-3 font-semibold text-slate-900">
                        <span className="min-w-0">
                          {exp.role} — <span style={{ color: accentColor }}>{exp.company}</span>
                        </span>
                        <span className="text-[11px] text-slate-500 font-normal shrink-0 whitespace-nowrap">
                          {exp.startDate} – {exp.endDate}
                        </span>
                      </div>
                      {exp.bullets && exp.bullets.length > 0 && (
                        <ul className="resume-bullets space-y-1 text-slate-700 text-[11px] leading-relaxed">
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
                      className="resume-entry rounded p-1 cursor-pointer transition-all flex justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <span className="font-semibold text-slate-900">
                          {edu.degree}
                          {edu.field ? ` in ${edu.field}` : ''}
                        </span>
                        <p className="text-slate-600 text-[11px]">{edu.institution}</p>
                      </div>
                      <span className="text-[11px] text-slate-500 shrink-0 whitespace-nowrap">
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
                      className="resume-entry rounded p-1 cursor-pointer transition-all"
                    >
                      <span className="font-semibold text-slate-900">{group.category}: </span>
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
