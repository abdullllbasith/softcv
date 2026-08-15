import React, { useState } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { analyzeAtsScore, AtsScoreResult } from '@/lib/atsAnalyzer';
import { X, Award, CheckCircle2, AlertCircle, BrainCircuit } from 'lucide-react';

interface AtsScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AtsScoreModal: React.FC<AtsScoreModalProps> = ({ isOpen, onClose }) => {
  const { resumeData } = useResumeStore();
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState<AtsScoreResult | null>(null);

  if (!isOpen) return null;

  const handleAnalyze = () => {
    const analysis = analyzeAtsScore(resumeData, jobDescription);
    setResult(analysis);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 border border-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">ATS Resume Scanner & Score</h2>
              <p className="text-xs text-slate-500">Check keyword match against target job description</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Area */}
        <div className="space-y-2 text-xs">
          <label className="font-semibold text-slate-700">Paste Target Job Description (Optional)</label>
          <textarea
            rows={4}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste job posting text here to analyze keyword match score..."
            className="w-full p-3 rounded-xl border border-slate-200 focus:border-teal-500 outline-none text-slate-800"
          />
          <button
            onClick={handleAnalyze}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-teal-600 text-white font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <BrainCircuit className="w-4 h-4" /> Run ATS Compatibility Audit
          </button>
        </div>

        {/* Score Results Display */}
        {result && (
          <div className="space-y-4 pt-3 border-t border-slate-100 text-xs">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {result.hasJobDescription ? 'Overall Match Score' : 'Resume Completeness Score'}
                </span>
                <div className="text-3xl font-extrabold text-slate-900 mt-0.5">{result.totalScore}%</div>
              </div>
              <div className="text-right space-y-1 text-slate-600 font-medium">
                <div>
                  Keyword Match:{' '}
                  <strong className="text-slate-900">
                    {result.hasJobDescription ? `${result.keywordScore}%` : 'N/A'}
                  </strong>
                </div>
                <div>
                  Completeness: <strong className="text-slate-900">{result.completenessScore}%</strong>
                </div>
              </div>
            </div>

            {/* Keyword Pills */}
            <div className="space-y-2">
              <h3 className="font-bold text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Matched Keywords
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {result.matchedKeywords.length > 0 ? (
                  result.matchedKeywords.map((kw, idx) => (
                    <span key={idx} className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 font-medium text-[11px]">
                      ✓ {kw}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400">No specific keyword match found.</span>
                )}
              </div>
            </div>

            {result.missingKeywords.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-bold text-slate-800 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" /> Missing Keywords
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {result.missingKeywords.map((kw, idx) => (
                    <span key={idx} className="px-2 py-1 rounded-md bg-amber-50 text-amber-800 font-medium text-[11px]">
                      + {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {result.suggestions.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-bold text-slate-800">Actionable Improvement Tips</h3>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  {result.suggestions.map((sug, idx) => (
                    <li key={idx}>{sug}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
