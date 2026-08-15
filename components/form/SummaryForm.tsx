import React, { useState } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { BrainCircuit, HelpCircle } from 'lucide-react';

export const SummaryForm: React.FC = () => {
  const { resumeData, updateSummary, setFocusedFieldId } = useResumeStore();
  const { summary } = resumeData;
  const [isGenerating, setIsGenerating] = useState(false);

  const charCount = summary ? summary.length : 0;
  const wordCount = summary ? summary.trim().split(/\s+/).filter(Boolean).length : 0;

  const handleAiEnhance = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'summary', text: summary, title: resumeData.personalInfo.title }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.result) {
          updateSummary(data.result);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-3 text-xs">
      <div className="flex items-center justify-between">
        <label className="font-semibold text-slate-700">Professional Summary</label>
        <button
          onClick={handleAiEnhance}
          disabled={isGenerating}
          type="button"
          className="flex items-center gap-1 px-2.5 py-1 rounded bg-teal-50 hover:bg-teal-100 text-teal-700 font-medium transition-colors disabled:opacity-50"
        >
          <BrainCircuit className="w-3.5 h-3.5 text-teal-600" />
          <span>{isGenerating ? 'Enhancing...' : 'AI Enhance Summary'}</span>
        </button>
      </div>

      <div className="relative">
        <textarea
          id="field-summary"
          rows={4}
          value={summary}
          onChange={(e) => updateSummary(e.target.value)}
          onFocus={() => setFocusedFieldId('summary')}
          onBlur={() => setFocusedFieldId(null)}
          placeholder="Write a concise 2–4 sentence summary highlighting your core expertise, key achievements, and career goals..."
          className="w-full p-3 rounded-lg border border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none text-slate-800 leading-relaxed resize-y transition-all"
        />

        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5 px-0.5">
          <div className="flex items-center gap-1 text-slate-600">
            <HelpCircle className="w-3 h-3 text-teal-500" />
            <span>Tip: Keep between 40 - 80 words for optimal recruiter impact.</span>
          </div>
          <div className="font-mono text-slate-400">
            {wordCount} words | {charCount} chars
          </div>
        </div>
      </div>
    </div>
  );
};
