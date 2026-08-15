import React from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { RepeatableEntryCard } from './RepeatableEntryCard';
import { Plus } from 'lucide-react';

export const EducationForm: React.FC = () => {
  const { resumeData, addEducation, updateEducation, removeEducation } = useResumeStore();
  const { education } = resumeData;

  return (
    <div className="space-y-4 text-xs">
      <div className="space-y-3">
        {education.map((edu) => (
          <div id={`field-edu-${edu.id}`} key={edu.id}>
            <RepeatableEntryCard
              id={edu.id}
              title={edu.degree ? `${edu.degree} in ${edu.field || ''}` : 'New Degree'}
              subtitle={edu.institution}
              onDelete={() => removeEducation(edu.id)}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1 sm:col-span-2">
                  <label className="font-semibold text-slate-700">University / Institution</label>
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                    placeholder="University of California, Berkeley"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:border-teal-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Degree</label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                    placeholder="Bachelor of Science"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:border-teal-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Field of Study</label>
                  <input
                    type="text"
                    value={edu.field}
                    onChange={(e) => updateEducation(edu.id, { field: e.target.value })}
                    placeholder="Computer Science"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:border-teal-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Start Date</label>
                  <input
                    type="text"
                    value={edu.startDate}
                    onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                    placeholder="2015-08"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:border-teal-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">End Date</label>
                  <input
                    type="text"
                    value={edu.endDate}
                    onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                    placeholder="2019-05"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:border-teal-500 outline-none"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-semibold text-slate-700">GPA / Honors (Optional)</label>
                  <input
                    type="text"
                    value={edu.gpa || ''}
                    onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
                    placeholder="3.85 / 4.0"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:border-teal-500 outline-none"
                  />
                </div>
              </div>
            </RepeatableEntryCard>
          </div>
        ))}
      </div>

      <button
        onClick={addEducation}
        type="button"
        className="w-full py-2.5 rounded-xl border border-dashed border-teal-300 bg-teal-50/50 hover:bg-teal-50 text-teal-700 font-semibold flex items-center justify-center gap-2 transition-colors"
      >
        <Plus className="w-4 h-4" /> Add Education
      </button>
    </div>
  );
};
