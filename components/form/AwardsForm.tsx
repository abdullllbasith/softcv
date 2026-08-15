import React from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { RepeatableEntryCard } from './RepeatableEntryCard';
import { Plus } from 'lucide-react';

export const AwardsForm: React.FC = () => {
  const { resumeData, addAward, updateAward, removeAward } = useResumeStore();
  const { awards } = resumeData;

  return (
    <div className="space-y-4 text-xs">
      <div className="space-y-3">
        {awards.map((award) => (
          <RepeatableEntryCard
            key={award.id}
            id={award.id}
            title={award.title || 'New Award'}
            subtitle={award.issuer}
            onDelete={() => removeAward(award.id)}
          >
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Award Title</label>
                  <input
                    type="text"
                    value={award.title}
                    onChange={(e) => updateAward(award.id, { title: e.target.value })}
                    placeholder="Engineering Excellence Award"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:border-teal-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Issuer / Presenter</label>
                  <input
                    type="text"
                    value={award.issuer}
                    onChange={(e) => updateAward(award.id, { issuer: e.target.value })}
                    placeholder="TechCorp Solutions"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:border-teal-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Date Received</label>
                <input
                  type="text"
                  value={award.date}
                  onChange={(e) => updateAward(award.id, { date: e.target.value })}
                  placeholder="2023-12"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:border-teal-500 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Description (Optional)</label>
                <textarea
                  rows={2}
                  value={award.description || ''}
                  onChange={(e) => updateAward(award.id, { description: e.target.value })}
                  placeholder="Awarded for outstanding contribution to core SaaS platform scalability..."
                  className="w-full p-2.5 rounded-lg border border-slate-200 focus:border-teal-500 outline-none resize-y text-xs"
                />
              </div>
            </div>
          </RepeatableEntryCard>
        ))}
      </div>

      <button
        onClick={addAward}
        type="button"
        className="w-full py-2.5 rounded-xl border border-dashed border-teal-300 bg-teal-50/50 hover:bg-teal-50 text-teal-700 font-semibold flex items-center justify-center gap-2 transition-colors"
      >
        <Plus className="w-4 h-4" /> Add Award / Honor
      </button>
    </div>
  );
};
