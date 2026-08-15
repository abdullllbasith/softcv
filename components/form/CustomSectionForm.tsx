import React from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { RepeatableEntryCard } from './RepeatableEntryCard';
import { Plus } from 'lucide-react';

export const CustomSectionForm: React.FC = () => {
  const { resumeData, addCustomSection, updateCustomSection, removeCustomSection } = useResumeStore();
  const { customSections } = resumeData;

  return (
    <div className="space-y-4 text-xs">
      <div className="space-y-3">
        {customSections.map((custom) => (
          <RepeatableEntryCard
            key={custom.id}
            id={custom.id}
            title={custom.title || 'Custom Section'}
            onDelete={() => removeCustomSection(custom.id)}
          >
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Section Title</label>
                <input
                  type="text"
                  value={custom.title}
                  onChange={(e) => updateCustomSection(custom.id, { title: e.target.value })}
                  placeholder="e.g. Publications & Speaking"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:border-teal-500 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Content / Bullets</label>
                <textarea
                  rows={4}
                  value={custom.content}
                  onChange={(e) => updateCustomSection(custom.id, { content: e.target.value })}
                  placeholder="Keynote Speaker at React Summit 2023: 'Optimizing Next.js App Router'..."
                  className="w-full p-2.5 rounded-lg border border-slate-200 focus:border-teal-500 outline-none resize-y text-xs leading-relaxed"
                />
              </div>
            </div>
          </RepeatableEntryCard>
        ))}
      </div>

      <button
        onClick={addCustomSection}
        type="button"
        className="w-full py-2.5 rounded-xl border border-dashed border-teal-300 bg-teal-50/50 hover:bg-teal-50 text-teal-700 font-semibold flex items-center justify-center gap-2 transition-colors"
      >
        <Plus className="w-4 h-4" /> Add Custom Section
      </button>
    </div>
  );
};
