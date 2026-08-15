import React from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { RepeatableEntryCard } from './RepeatableEntryCard';
import { Plus, Trash2, BrainCircuit } from 'lucide-react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

export const ExperienceForm: React.FC = () => {
  const { resumeData, addExperience, updateExperience, removeExperience, reorderExperience, setFocusedFieldId } = useResumeStore();
  const { experience } = resumeData;

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const oldIndex = experience.findIndex((item) => item.id === active.id);
      const newIndex = experience.findIndex((item) => item.id === over.id);
      reorderExperience(oldIndex, newIndex);
    }
  };

  const handleAddBullet = (expId: string, bullets: string[]) => {
    updateExperience(expId, { bullets: [...bullets, ''] });
  };

  const handleUpdateBullet = (expId: string, bullets: string[], index: number, value: string) => {
    const updated = [...bullets];
    updated[index] = value;
    updateExperience(expId, { bullets: updated });
  };

  const handleRemoveBullet = (expId: string, bullets: string[], index: number) => {
    const updated = bullets.filter((_, i) => i !== index);
    updateExperience(expId, { bullets: updated });
  };

  const handleAiBullet = async (expId: string, bullets: string[], index: number) => {
    const currentText = bullets[index];
    if (!currentText) return;

    try {
      const res = await fetch('/api/ai-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'bullet', text: currentText }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.result) {
          handleUpdateBullet(expId, bullets, index, data.result);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-4 text-xs">
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={experience.map((e) => e.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {experience.map((exp) => (
              <div id={`field-exp-${exp.id}`} key={exp.id}>
                <RepeatableEntryCard
                  id={exp.id}
                  title={exp.role || 'New Position'}
                  subtitle={exp.company}
                  onDelete={() => removeExperience(exp.id)}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Company Name</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                        onFocus={() => setFocusedFieldId(`experience.${exp.id}.company`)}
                        onBlur={() => setFocusedFieldId(null)}
                        placeholder="TechCorp Solutions"
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:border-teal-500 outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Job Role / Title</label>
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) => updateExperience(exp.id, { role: e.target.value })}
                        onFocus={() => setFocusedFieldId(`experience.${exp.id}.role`)}
                        onBlur={() => setFocusedFieldId(null)}
                        placeholder="Senior Full Stack Engineer"
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:border-teal-500 outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Location (Optional)</label>
                      <input
                        type="text"
                        value={exp.location || ''}
                        onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                        onFocus={() => setFocusedFieldId(`experience.${exp.id}.location`)}
                        onBlur={() => setFocusedFieldId(null)}
                        placeholder="San Francisco, CA"
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:border-teal-500 outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Start Date</label>
                      <input
                        type="text"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                        placeholder="2022-03"
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:border-teal-500 outline-none"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <div className="flex justify-between items-center mb-1">
                        <label className="font-semibold text-slate-700">End Date</label>
                        <label className="flex items-center gap-1.5 text-xs text-teal-600 font-medium cursor-pointer">
                          <input
                            type="checkbox"
                            checked={exp.isCurrent || exp.endDate === 'Present'}
                            onChange={(e) =>
                              updateExperience(exp.id, {
                                isCurrent: e.target.checked,
                                endDate: e.target.checked ? 'Present' : '',
                              })
                            }
                            className="rounded text-teal-600 focus:ring-teal-500"
                          />
                          <span>Currently work here</span>
                        </label>
                      </div>

                      {!exp.isCurrent && exp.endDate !== 'Present' && (
                        <input
                          type="text"
                          value={exp.endDate}
                          onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                          placeholder="2024-01"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:border-teal-500 outline-none"
                        />
                      )}
                    </div>
                  </div>

                  {/* Bullet Points List */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex justify-between items-center">
                      <label className="font-semibold text-slate-700 text-xs">Achievement Bullet Points</label>
                      <button
                        onClick={() => handleAddBullet(exp.id, exp.bullets || [])}
                        type="button"
                        className="flex items-center gap-1 text-teal-600 hover:text-teal-700 font-medium text-xs"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Bullet
                      </button>
                    </div>

                    {(exp.bullets || []).map((bullet, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={bullet}
                          onChange={(e) => handleUpdateBullet(exp.id, exp.bullets, idx, e.target.value)}
                          placeholder="• Architected analytics dashboard serving 2M+ active daily users..."
                          className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 focus:border-teal-500 outline-none text-xs"
                        />

                        <button
                          onClick={() => handleAiBullet(exp.id, exp.bullets, idx)}
                          type="button"
                          className="p-1.5 text-teal-600 hover:bg-teal-50 rounded"
                          title="AI Improve bullet"
                        >
                          <BrainCircuit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleRemoveBullet(exp.id, exp.bullets, idx)}
                          type="button"
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </RepeatableEntryCard>
              </div>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <button
        onClick={addExperience}
        type="button"
        className="w-full py-2.5 rounded-xl border border-dashed border-teal-300 bg-teal-50/50 hover:bg-teal-50 text-teal-700 font-semibold flex items-center justify-center gap-2 transition-colors"
      >
        <Plus className="w-4 h-4" /> Add Work Experience
      </button>
    </div>
  );
};
