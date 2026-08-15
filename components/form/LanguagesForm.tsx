import React from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { RepeatableEntryCard } from './RepeatableEntryCard';
import { Plus } from 'lucide-react';

export const LanguagesForm: React.FC = () => {
  const { resumeData, addLanguage, updateLanguage, removeLanguage } = useResumeStore();
  const { languages } = resumeData;

  return (
    <div className="space-y-4 text-xs">
      <div className="space-y-3">
        {languages.map((l) => (
          <RepeatableEntryCard
            key={l.id}
            id={l.id}
            title={l.language || 'New Language'}
            subtitle={l.proficiency}
            onDelete={() => removeLanguage(l.id)}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Language Name</label>
                <input
                  type="text"
                  value={l.language}
                  onChange={(e) => updateLanguage(l.id, { language: e.target.value })}
                  placeholder="English"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:border-teal-500 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Proficiency Level</label>
                <select
                  value={l.proficiency}
                  onChange={(e) => updateLanguage(l.id, { proficiency: e.target.value as any })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:border-teal-500 outline-none bg-white"
                >
                  <option value="Basic">Basic</option>
                  <option value="Conversational">Conversational</option>
                  <option value="Fluent">Fluent</option>
                  <option value="Native">Native</option>
                </select>
              </div>
            </div>
          </RepeatableEntryCard>
        ))}
      </div>

      <button
        onClick={addLanguage}
        type="button"
        className="w-full py-2.5 rounded-xl border border-dashed border-teal-300 bg-teal-50/50 hover:bg-teal-50 text-teal-700 font-semibold flex items-center justify-center gap-2 transition-colors"
      >
        <Plus className="w-4 h-4" /> Add Language
      </button>
    </div>
  );
};
