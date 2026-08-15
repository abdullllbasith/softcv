import React, { useState, useEffect, useRef } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { BrainCircuit, RefreshCw, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export const SampleDataLoader: React.FC = () => {
  const { loadSampleData, resetToBlank } = useResumeStore();
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showConfirm) return;

    const handlePointerDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowConfirm(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowConfirm(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showConfirm]);

  const handleLoadSample = () => {
    loadSampleData();
    setMessage('Sample data loaded!');
    setShowConfirm(false);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.2 },
    });
    setTimeout(() => setMessage(''), 3000);
  };

  const handleResetBlank = () => {
    resetToBlank();
    setMessage('Reset to blank template!');
    setShowConfirm(false);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setShowConfirm(!showConfirm)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-teal-200 bg-teal-50/80 hover:bg-teal-100 text-teal-700 text-xs font-semibold transition-colors"
        title="Load pre-filled sample resume data"
        type="button"
      >
        <BrainCircuit className="w-3.5 h-3.5 text-teal-600" />
        <span>Sample Data</span>
      </button>

      {message && (
        <div className="absolute top-full mt-2 left-0 z-50 bg-emerald-600 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1 whitespace-nowrap">
          <Check className="w-3.5 h-3.5" />
          <span>{message}</span>
        </div>
      )}

      {showConfirm && (
        <div className="absolute top-full mt-2 left-0 z-50 w-64 bg-white border border-slate-200 shadow-xl rounded-xl p-3 text-xs space-y-2">
          <p className="font-semibold text-slate-800">Choose Action</p>
          <p className="text-slate-500 text-[11px]">Loading sample data will replace current fields with demonstration content.</p>
          <div className="flex flex-col gap-1.5 pt-1">
            <button
              onClick={handleLoadSample}
              className="w-full py-1.5 px-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <BrainCircuit className="w-3.5 h-3.5" /> Load Rich Sample Resume
            </button>
            <button
              onClick={handleResetBlank}
              className="w-full py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset to Blank Form
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
