import React, { useState } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { RepeatableEntryCard } from './RepeatableEntryCard';
import { Plus, X } from 'lucide-react';

export const SkillsForm: React.FC = () => {
  const { resumeData, addSkillGroup, updateSkillGroup, removeSkillGroup } = useResumeStore();
  const { skills } = resumeData;
  const [newSkillInput, setNewSkillInput] = useState<Record<string, string>>({});

  const handleAddTag = (groupId: string, skillList: string[]) => {
    const text = newSkillInput[groupId]?.trim();
    if (text) {
      updateSkillGroup(groupId, { skills: [...skillList, text] });
      setNewSkillInput((prev) => ({ ...prev, [groupId]: '' }));
    }
  };

  const handleRemoveTag = (groupId: string, skillList: string[], index: number) => {
    const updated = skillList.filter((_, i) => i !== index);
    updateSkillGroup(groupId, { skills: updated });
  };

  return (
    <div className="space-y-4 text-xs">
      <div className="space-y-3">
        {skills.map((group) => (
          <div id={`field-skill-${group.id}`} key={group.id}>
            <RepeatableEntryCard
              id={group.id}
              title={group.category || 'Skill Group'}
              subtitle={`${group.skills.length} skills`}
              onDelete={() => removeSkillGroup(group.id)}
            >
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Category Name</label>
                    <input
                      type="text"
                      value={group.category}
                      onChange={(e) => updateSkillGroup(group.id, { category: e.target.value })}
                      placeholder="Languages & Frameworks"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:border-teal-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Display Style</label>
                    <select
                      value={group.displayStyle || 'tags'}
                      onChange={(e) => updateSkillGroup(group.id, { displayStyle: e.target.value as any })}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:border-teal-500 outline-none bg-white"
                    >
                      <option value="tags">Badge Tags</option>
                      <option value="commaList">Comma Separated List</option>
                      <option value="bars">Progress Rating Bars</option>
                      <option value="dots">Dot Ratings</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700">Skills Tags</label>
                  <div className="flex flex-wrap gap-1.5 p-2 rounded-lg border border-slate-200 bg-slate-50/50 min-h-[42px] items-center">
                    {group.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-teal-50 text-teal-700 text-xs font-medium border border-teal-100"
                      >
                        {skill}
                        <button
                          onClick={() => handleRemoveTag(group.id, group.skills, idx)}
                          type="button"
                          className="hover:text-red-600 rounded"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}

                    <input
                      type="text"
                      value={newSkillInput[group.id] || ''}
                      onChange={(e) => setNewSkillInput((prev) => ({ ...prev, [group.id]: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ',') {
                          e.preventDefault();
                          handleAddTag(group.id, group.skills);
                        }
                      }}
                      placeholder="Type skill & press Enter..."
                      className="flex-1 min-w-[120px] bg-transparent outline-none text-xs px-1"
                    />
                  </div>
                </div>
              </div>
            </RepeatableEntryCard>
          </div>
        ))}
      </div>

      <button
        onClick={addSkillGroup}
        type="button"
        className="w-full py-2.5 rounded-xl border border-dashed border-teal-300 bg-teal-50/50 hover:bg-teal-50 text-teal-700 font-semibold flex items-center justify-center gap-2 transition-colors"
      >
        <Plus className="w-4 h-4" /> Add Skill Group
      </button>
    </div>
  );
};
