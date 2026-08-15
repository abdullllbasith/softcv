import React, { useState } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { RepeatableEntryCard } from './RepeatableEntryCard';
import { Plus } from 'lucide-react';

const parseTechStack = (raw: string) =>
  raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

export const ProjectsForm: React.FC = () => {
  const { resumeData, addProject, updateProject, removeProject } = useResumeStore();
  const { projects } = resumeData;
  // Keep raw text while typing so commas / trailing spaces aren't stripped
  const [techDrafts, setTechDrafts] = useState<Record<string, string>>({});

  return (
    <div className="space-y-4 text-xs">
      <div className="space-y-3">
        {projects.map((proj) => (
          <div id={`field-proj-${proj.id}`} key={proj.id}>
            <RepeatableEntryCard
              id={proj.id}
              title={proj.name || 'New Project'}
              onDelete={() => removeProject(proj.id)}
            >
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Project Name</label>
                    <input
                      type="text"
                      value={proj.name}
                      onChange={(e) => updateProject(proj.id, { name: e.target.value })}
                      placeholder="FlowSpace Whiteboard"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:border-teal-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Project URL (Optional)</label>
                    <input
                      type="text"
                      value={proj.link || ''}
                      onChange={(e) => updateProject(proj.id, { link: e.target.value })}
                      placeholder="https://github.com/alexmorgan/flowspace"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:border-teal-500 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Short Description</label>
                  <textarea
                    rows={2}
                    value={proj.description}
                    onChange={(e) => updateProject(proj.id, { description: e.target.value })}
                    placeholder="Real-time collaborative canvas with web sockets and CRDT data sync..."
                    className="w-full p-2.5 rounded-lg border border-slate-200 focus:border-teal-500 outline-none resize-y text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Technologies Used (Comma-separated)</label>
                  <input
                    type="text"
                    value={
                      techDrafts[proj.id] !== undefined
                        ? techDrafts[proj.id]
                        : (proj.techStack || []).join(', ')
                    }
                    onChange={(e) => {
                      const raw = e.target.value;
                      setTechDrafts((prev) => ({ ...prev, [proj.id]: raw }));
                      updateProject(proj.id, { techStack: parseTechStack(raw) });
                    }}
                    onBlur={() => {
                      setTechDrafts((prev) => {
                        const next = { ...prev };
                        delete next[proj.id];
                        return next;
                      });
                    }}
                    placeholder="React, WebSockets, Canvas API, Node.js"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:border-teal-500 outline-none"
                  />
                </div>
              </div>
            </RepeatableEntryCard>
          </div>
        ))}
      </div>

      <button
        onClick={addProject}
        type="button"
        className="w-full py-2.5 rounded-xl border border-dashed border-teal-300 bg-teal-50/50 hover:bg-teal-50 text-teal-700 font-semibold flex items-center justify-center gap-2 transition-colors"
      >
        <Plus className="w-4 h-4" /> Add Key Project
      </button>
    </div>
  );
};
