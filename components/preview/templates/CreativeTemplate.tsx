import React from 'react';
import { ResumeData } from '@/types/resume';
import { useResumeStore } from '@/store/useResumeStore';
import { getContrastColor } from '@/lib/colorContrast';
import { renderExtraSection } from './renderExtraSections';

interface TemplateProps {
  data: ResumeData;
  focusedFieldId?: string | null;
}

export const CreativeTemplate: React.FC<TemplateProps> = ({ data, focusedFieldId }) => {
  const { navigateToField } = useResumeStore();
  const { personalInfo, summary, experience, education, skills, sectionOrder, sectionVisibility, accentColor } = data;

  const textColorOnAccent = getContrastColor(accentColor);
  const isVisible = (key: string) => sectionVisibility?.[key] !== false;

  const Heading = ({ title }: { title: string }) => (
    <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-900 flex items-center gap-2">
      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: accentColor }} />
      {title}
    </h2>
  );

  return (
    <div className="resume-sheet bg-white text-slate-800 text-xs font-sans select-text !p-0">
      {/* Top Banner Band */}
      <div
        className="flex items-center gap-6"
        style={{
          backgroundColor: accentColor,
          color: textColorOnAccent,
          padding: '14mm 18mm 12mm',
        }}
      >
        {personalInfo.photoUrl && (
          <div
            className="rounded-full overflow-hidden border-4 border-white/40 shadow-lg shrink-0 self-center"
            style={{
              width: 96,
              height: 96,
              minWidth: 96,
              minHeight: 96,
              maxWidth: 96,
              maxHeight: 96,
              aspectRatio: '1 / 1',
              flex: '0 0 96px',
              boxSizing: 'border-box',
            }}
          >
            <img
              src={personalInfo.photoUrl}
              alt={personalInfo.fullName}
              crossOrigin="anonymous"
              width={96}
              height={96}
              draggable={false}
              style={{
                width: 96,
                height: 96,
                maxWidth: 96,
                maxHeight: 96,
                objectFit: 'cover',
                objectPosition: 'center center',
                display: 'block',
                boxSizing: 'border-box',
              }}
            />
          </div>
        )}
        <div className="space-y-1">
          <h1
            onClick={() => navigateToField('field-personalInfo-fullName', 'personalInfo')}
            className="text-2xl font-black tracking-tight cursor-pointer hover:underline"
          >
            {personalInfo.fullName || 'Alex Morgan'}
          </h1>
          <p
            onClick={() => navigateToField('field-personalInfo-title', 'personalInfo')}
            className="text-sm font-semibold opacity-90 cursor-pointer hover:underline"
          >
            {personalInfo.title}
          </p>
          <div className="flex flex-wrap gap-2 pt-1 text-[11px] opacity-90">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>• {personalInfo.phone}</span>}
            {personalInfo.location && <span>• {personalInfo.location}</span>}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6" style={{ padding: '14mm 18mm 16mm' }}>
        {sectionOrder.map((sectionKey) => {
          if (!isVisible(sectionKey)) return null;

          if (sectionKey === 'summary' && summary) {
            return (
              <div key="summary" className="space-y-2">
                <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-900 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: accentColor }} />
                  About Me
                </h2>
                <p
                  onClick={() => navigateToField('field-summary', 'summary')}
                  className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 cursor-pointer hover:outline hover:outline-2 hover:outline-teal-400"
                >
                  {summary}
                </p>
              </div>
            );
          }

          if (sectionKey === 'experience' && experience.length > 0) {
            return (
              <div key="experience" className="space-y-3">
                <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-900 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: accentColor }} />
                  Work Experience
                </h2>
                <div className="space-y-4">
                  {experience.map((exp) => (
                    <div
                      key={exp.id}
                      onClick={() => navigateToField(`field-exp-${exp.id}`, 'experience')}
                      className="border-l-2 pl-4 space-y-1 cursor-pointer hover:outline hover:outline-2 hover:outline-teal-400 hover:outline-dashed rounded p-1 transition-all"
                      style={{ borderColor: accentColor }}
                    >
                      <div className="flex justify-between items-baseline font-bold text-slate-900">
                        <span>{exp.role} <span className="font-normal text-slate-500">at {exp.company}</span></span>
                        <span className="text-[11px] font-semibold text-slate-500">{exp.startDate} – {exp.endDate}</span>
                      </div>
                      {exp.bullets && (
                        <ul className="resume-bullets space-y-1 text-slate-700 text-[11px] leading-relaxed pt-1">
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

          if (sectionKey === 'skills' && skills.length > 0) {
            return (
              <div key="skills" className="space-y-2">
                <Heading title="Skills & Expertise" />
                <div className="grid grid-cols-2 gap-3">
                  {skills.map((group) => (
                    <div
                      key={group.id}
                      onClick={() => navigateToField(`field-skill-${group.id}`, 'skills')}
                      className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1 cursor-pointer hover:outline hover:outline-2 hover:outline-teal-400"
                    >
                      <p className="font-bold text-slate-900">{group.category}</p>
                      <div className="flex flex-wrap gap-1">
                        {group.skills.map((s, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[10px] text-slate-700">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          if (sectionKey === 'education' && education.length > 0) {
            return (
              <div key="education" className="space-y-2">
                <Heading title="Education" />
                <div className="space-y-2">
                  {education.map((edu) => (
                    <div
                      key={edu.id}
                      onClick={() => navigateToField(`field-edu-${edu.id}`, 'education')}
                      className="border-l-2 pl-4 space-y-0.5 cursor-pointer hover:outline hover:outline-2 hover:outline-teal-400 hover:outline-dashed rounded p-1"
                      style={{ borderColor: accentColor }}
                    >
                      <div className="flex justify-between items-baseline gap-2">
                        <span className="font-bold text-slate-900">
                          {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                        </span>
                        <span className="text-[11px] text-slate-500 shrink-0">
                          {edu.startDate} – {edu.endDate}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600">{edu.institution}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          return renderExtraSection({
            sectionKey,
            data,
            navigateToField,
            Heading,
          });
        })}
      </div>
    </div>
  );
};
