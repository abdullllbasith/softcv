import React from 'react';
import { ResumeData } from '@/types/resume';
import { useResumeStore } from '@/store/useResumeStore';
import { getContrastColor, hexToRgba } from '@/lib/colorContrast';
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
  focusedFieldId?: string | null;
}

export const ModernTemplate: React.FC<TemplateProps> = ({ data, focusedFieldId }) => {
  const navigateToField = useResumeStore((s) => s.navigateToField);
  const {
    personalInfo,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
    languages,
    awards,
    customSections,
    sectionOrder,
    sectionVisibility,
    accentColor,
  } = data;

  const textColorOnAccent = getContrastColor(accentColor);
  const subtleAccentBg = hexToRgba(accentColor, 0.12);

  const isVisible = (key: string) => sectionVisibility?.[key] !== false;
  const isFocused = (fieldId: string) => focusedFieldId === fieldId;

  const SectionHeading = ({ title }: { title: string }) => (
    <h2
      className="text-xs font-extrabold uppercase tracking-wider pb-1 border-b-2"
      style={{ borderColor: accentColor, color: accentColor }}
    >
      {title}
    </h2>
  );

  return (
    <div
      className="relative w-full min-h-[297mm] bg-white text-slate-800 text-xs font-sans"
      data-modern-template="true"
    >
      {/* Full-height accent rail — continues cleanly on page 2+ without slicing text */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0"
        style={{ width: '34%', backgroundColor: accentColor }}
      />

      <div className="relative flex w-full min-h-[297mm]">
        {/* SIDEBAR — keep short (identity + contact + education) so it fits page 1 */}
        <div
          className="w-[34%] shrink-0 select-text"
          style={{ color: textColorOnAccent, padding: '16mm 12mm' }}
        >
          <div className="space-y-5">
            <div className="flex flex-col items-center gap-3">
              {personalInfo.photoUrl && (
                <div
                  className="rounded-full overflow-hidden border-2 border-white/40 shadow-md"
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

              <div
                onClick={() => navigateToField('field-personalInfo-fullName', 'personalInfo')}
                className={`w-full hover:outline hover:outline-2 hover:outline-white/70 hover:outline-dashed rounded p-1 cursor-pointer transition-all ${
                  isFocused('personalInfo.fullName') ? 'ring-2 ring-white bg-white/10' : ''
                }`}
                title="Click to edit full name"
              >
                <h1 className="text-xl font-bold tracking-tight break-words text-center">
                  {personalInfo.fullName || 'Alex Morgan'}
                </h1>
                <p className="text-xs opacity-90 font-medium mt-0.5 break-words text-center">
                  {personalInfo.title || 'Job Title'}
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/20 text-[11px]">
              <h2 className="text-xs font-extrabold uppercase tracking-wider opacity-80 mb-2">Contact</h2>
              {personalInfo.email && (
                <div
                  onClick={() => navigateToField('field-personalInfo-email', 'personalInfo')}
                  className="flex items-start gap-2 hover:underline cursor-pointer opacity-90"
                >
                  <Mail className="w-3 h-3 shrink-0 mt-0.5" />
                  <span className="min-w-0 break-all leading-snug">{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.phone && (
                <div
                  onClick={() => navigateToField('field-personalInfo-phone', 'personalInfo')}
                  className="flex items-start gap-2 hover:underline cursor-pointer opacity-90"
                >
                  <Phone className="w-3 h-3 shrink-0 mt-0.5" />
                  <span className="min-w-0 break-words">{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.location && (
                <div
                  onClick={() => navigateToField('field-personalInfo-location', 'personalInfo')}
                  className="flex items-start gap-2 hover:underline cursor-pointer opacity-90"
                >
                  <MapPin className="w-3 h-3 shrink-0 mt-0.5" />
                  <span className="min-w-0 break-words">{personalInfo.location}</span>
                </div>
              )}
              {personalInfo.website && (
                <div
                  onClick={() => navigateToField('field-personalInfo-website', 'personalInfo')}
                  className="flex items-start gap-2 hover:underline cursor-pointer opacity-90"
                >
                  <Globe className="w-3 h-3 shrink-0 mt-0.5" />
                  <span className="min-w-0 break-all leading-snug">{personalInfo.website}</span>
                </div>
              )}
              {personalInfo.linkedin && (
                <div
                  onClick={() => navigateToField('field-personalInfo-linkedin', 'personalInfo')}
                  className="flex items-start gap-2 hover:underline cursor-pointer opacity-90"
                >
                  <Linkedin className="w-3 h-3 shrink-0 mt-0.5" />
                  <span className="min-w-0 break-all leading-snug">{personalInfo.linkedin}</span>
                </div>
              )}
              {personalInfo.github && (
                <div
                  onClick={() => navigateToField('field-personalInfo-github', 'personalInfo')}
                  className="flex items-start gap-2 hover:underline cursor-pointer opacity-90"
                >
                  <Github className="w-3 h-3 shrink-0 mt-0.5" />
                  <span className="min-w-0 break-all leading-snug">{personalInfo.github}</span>
                </div>
              )}
            </div>

            {isVisible('education') && education.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-white/20">
                <h2 className="text-xs font-extrabold uppercase tracking-wider opacity-80">Education</h2>
                {education.map((edu) => (
                  <div
                    key={edu.id}
                    onClick={() => navigateToField(`field-edu-${edu.id}`, 'education')}
                    className="hover:outline hover:outline-2 hover:outline-white/70 hover:outline-dashed rounded p-1 cursor-pointer transition-all space-y-0.5"
                  >
                    <p className="font-bold text-xs">
                      {edu.degree} {edu.field ? `in ${edu.field}` : ''}
                    </p>
                    <p className="text-[11px] opacity-90">{edu.institution}</p>
                    <p className="text-[10px] opacity-75">
                      {edu.startDate} – {edu.endDate}
                    </p>
                    {edu.gpa && <p className="text-[10px] opacity-75">GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* MAIN — page-break-safe flowing content (includes skills / certs / languages) */}
        <div
          className="flex-1 min-w-0 space-y-6 select-text"
          style={{ padding: '16mm 16mm 16mm 14mm' }}
        >
          {sectionOrder.map((sectionKey) => {
            if (!isVisible(sectionKey)) return null;

            if (sectionKey === 'summary' && summary) {
              return (
                <div key="summary" className="resume-section space-y-1.5">
                  <SectionHeading title="Profile Summary" />
                  <p
                    onClick={() => navigateToField('field-summary', 'summary')}
                    className={`text-slate-700 leading-relaxed hover:outline hover:outline-2 hover:outline-teal-400 hover:outline-dashed rounded p-1 cursor-pointer transition-all ${
                      isFocused('summary') ? 'ring-2 ring-teal-500 bg-teal-50/50' : ''
                    }`}
                    title="Click to edit summary"
                  >
                    {summary}
                  </p>
                </div>
              );
            }

            if (sectionKey === 'experience' && experience.length > 0) {
              return (
                <div key="experience" className="resume-section space-y-3">
                  <SectionHeading title="Work Experience" />
                  <div className="space-y-4">
                    {experience.map((exp) => (
                      <div
                        key={exp.id}
                        onClick={() => navigateToField(`field-exp-${exp.id}`, 'experience')}
                        className={`resume-entry hover:outline hover:outline-2 hover:outline-teal-400 hover:outline-dashed rounded p-1.5 cursor-pointer transition-all space-y-1 ${
                          isFocused(`experience.${exp.id}.company`) ||
                          isFocused(`experience.${exp.id}.role`)
                            ? 'ring-2 ring-teal-500 bg-teal-50/50'
                            : ''
                        }`}
                        title="Click to edit work experience entry"
                      >
                        <div className="flex justify-between items-baseline gap-2">
                          <span className="font-bold text-slate-900 text-xs">{exp.role}</span>
                          <span className="text-[11px] text-slate-500 font-medium shrink-0">
                            {exp.startDate} – {exp.endDate}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-slate-600 text-[11px] gap-2">
                          <span className="font-semibold">{exp.company}</span>
                          {exp.location && <span className="shrink-0">{exp.location}</span>}
                        </div>
                        {exp.bullets && exp.bullets.length > 0 && (
                          <ul className="resume-bullets space-y-1 text-slate-700 pt-1 text-[11px] leading-relaxed">
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
                <div key="skills" className="resume-section space-y-3">
                  <SectionHeading title="Skills" />
                  <div className="space-y-3">
                    {skills.map((group) => (
                      <div
                        key={group.id}
                        onClick={() => navigateToField(`field-skill-${group.id}`, 'skills')}
                        className="resume-entry hover:outline hover:outline-2 hover:outline-teal-400 hover:outline-dashed rounded p-1 cursor-pointer transition-all space-y-1.5"
                      >
                        <p className="font-bold text-[11px] text-slate-800">{group.category}</p>
                        <p className="text-[11px] text-slate-700 leading-relaxed">
                          {group.skills.filter(Boolean).join(' · ')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            if (sectionKey === 'projects' && projects.length > 0) {
              return (
                <div key="projects" className="resume-section space-y-3">
                  <SectionHeading title="Key Projects" />
                  <div className="space-y-3">
                    {projects.map((proj) => (
                      <div
                        key={proj.id}
                        onClick={() => navigateToField(`field-proj-${proj.id}`, 'projects')}
                        className="resume-entry hover:outline hover:outline-2 hover:outline-teal-400 hover:outline-dashed rounded p-1.5 cursor-pointer transition-all space-y-1"
                      >
                        <div className="flex justify-between items-baseline gap-2">
                          <span className="font-bold text-slate-900">{proj.name}</span>
                          {proj.link && (
                            <span className="text-[10px] text-teal-600 underline shrink-0">{proj.link}</span>
                          )}
                        </div>
                        {proj.description && (
                          <p className="text-slate-700 text-[11px] leading-relaxed">{proj.description}</p>
                        )}
                        {proj.bullets && proj.bullets.length > 0 && (
                          <ul className="resume-bullets space-y-1 text-slate-700 pt-0.5 text-[11px] leading-relaxed">
                            {proj.bullets.filter(Boolean).map((b, idx) => (
                              <li key={idx}>{b}</li>
                            ))}
                          </ul>
                        )}
                        {proj.techStack && proj.techStack.length > 0 && (
                          <div
                            className="pt-1"
                            style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 5 }}
                          >
                            {proj.techStack.filter(Boolean).map((tech, idx) => (
                              <span
                                key={idx}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  height: 18,
                                  padding: '0 6px',
                                  borderRadius: 4,
                                  backgroundColor: subtleAccentBg,
                                  color: accentColor,
                                  fontSize: 9.5,
                                  fontWeight: 600,
                                  lineHeight: 1,
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            if (sectionKey === 'certifications' && certifications.length > 0) {
              return (
                <div key="certifications" className="resume-section space-y-2">
                  <SectionHeading title="Certifications" />
                  <div className="space-y-2">
                    {certifications.map((cert) => (
                      <div
                        key={cert.id}
                        onClick={() => navigateToField(`field-cert-${cert.id}`, 'certifications')}
                        className="resume-entry hover:outline hover:outline-2 hover:outline-teal-400 hover:outline-dashed rounded p-1 cursor-pointer transition-all space-y-0.5"
                      >
                        <div className="flex justify-between items-baseline gap-2">
                          <span className="font-bold text-slate-900 text-xs">{cert.name}</span>
                          {cert.date && (
                            <span className="text-[11px] text-slate-500 shrink-0">{cert.date}</span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600">{cert.issuer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            if (sectionKey === 'languages' && languages.length > 0) {
              return (
                <div key="languages" className="resume-section space-y-2">
                  <SectionHeading title="Languages" />
                  <div className="space-y-1">
                    {languages.map((lang) => (
                      <div
                        key={lang.id}
                        onClick={() => navigateToField(`field-lang-${lang.id}`, 'languages')}
                        className="resume-entry flex justify-between gap-3 text-[11px] hover:outline hover:outline-2 hover:outline-teal-400 hover:outline-dashed rounded p-1 cursor-pointer"
                      >
                        <span className="font-semibold text-slate-800">{lang.language}</span>
                        <span className="text-slate-600">{lang.proficiency}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            if (sectionKey === 'awards' && awards.length > 0) {
              return (
                <div key="awards" className="resume-section space-y-3">
                  <SectionHeading title="Honors & Awards" />
                  <div className="space-y-2">
                    {awards.map((award) => (
                      <div
                        key={award.id}
                        onClick={() => navigateToField(`field-award-${award.id}`, 'awards')}
                        className="resume-entry hover:outline hover:outline-2 hover:outline-teal-400 hover:outline-dashed rounded p-1.5 cursor-pointer transition-all space-y-0.5"
                      >
                        <div className="flex justify-between items-baseline gap-2">
                          <span className="font-bold text-slate-900">{award.title}</span>
                          {award.date && (
                            <span className="text-[11px] text-slate-500 shrink-0">{award.date}</span>
                          )}
                        </div>
                        {award.issuer && <p className="text-[11px] text-slate-600">{award.issuer}</p>}
                        {award.description && (
                          <ul className="resume-bullets space-y-1 text-slate-700 pt-0.5 text-[11px] leading-relaxed">
                            <li>{award.description}</li>
                          </ul>
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
                  {customSections.map((section) => (
                    <div key={section.id} className="resume-section resume-entry space-y-1.5">
                      <SectionHeading title={section.title || 'Custom Section'} />
                      <p
                        onClick={() => navigateToField(`field-custom-${section.id}`, 'customSections')}
                        className="text-slate-700 leading-relaxed whitespace-pre-wrap hover:outline hover:outline-2 hover:outline-teal-400 hover:outline-dashed rounded p-1 cursor-pointer transition-all text-[11px]"
                      >
                        {section.content}
                      </p>
                    </div>
                  ))}
                </React.Fragment>
              );
            }

            // education stays in sidebar
            return null;
          })}
        </div>
      </div>
    </div>
  );
};
