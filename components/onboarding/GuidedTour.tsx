'use client';

import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, BrainCircuit, X } from 'lucide-react';
import { useResumeStore } from '@/store/useResumeStore';

const STORAGE_KEY = 'softcv-guided-tour-v1';

type TourStep = {
  id: string;
  /** data-tour attribute value; omit for centered welcome/finish */
  target?: string;
  title: string;
  body: string;
};

const STEPS: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to SoftCV',
    body: 'A quick tour of the workspace — edit on one side, watch your A4 resume update live on the other.',
  },
  {
    id: 'editor',
    target: 'editor',
    title: 'Fill in your content',
    body: 'Add personal details, experience, education, and skills here. Drag section handles to reorder — changes sync instantly.',
  },
  {
    id: 'preview',
    target: 'preview',
    title: 'Live A4 preview',
    body: 'Your resume renders page-by-page as you type. What you see here is what Export PDF will produce.',
  },
  {
    id: 'template',
    target: 'template',
    title: 'Templates & accent color',
    body: 'Switch between Modern, Professional, Minimal, ATS, and more. Use the palette to tune your accent color.',
  },
  {
    id: 'export',
    target: 'export',
    title: 'Export when you are ready',
    body: 'Download a clean multi-page PDF, or check ATS Score first to catch gaps before you apply.',
  },
  {
    id: 'agent',
    target: 'agent',
    title: 'SoftCV AI agent',
    body: 'Ask SoftCV to rewrite bullets, change themes, or polish wording — updates apply to your live resume.',
  },
];

type Rect = { top: number; left: number; width: number; height: number };

function getTargetRect(selector: string): Rect | null {
  const el = document.querySelector(`[data-tour="${selector}"]`) as HTMLElement | null;
  if (!el) return null;
  const r = el.getBoundingClientRect();
  if (r.width < 2 || r.height < 2) return null;
  const pad = 8;
  return {
    top: Math.max(8, r.top - pad),
    left: Math.max(8, r.left - pad),
    width: Math.min(window.innerWidth - 16, r.width + pad * 2),
    height: Math.min(window.innerHeight - 16, r.height + pad * 2),
  };
}

function markComplete() {
  try {
    localStorage.setItem(STORAGE_KEY, '1');
  } catch {
    /* ignore */
  }
}

export function hasCompletedGuidedTour(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

export function resetGuidedTour() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

interface GuidedTourProps {
  open: boolean;
  onClose: () => void;
}

export const GuidedTour: React.FC<GuidedTourProps> = ({ open, onClose }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);
  const [tooltipSide, setTooltipSide] = useState<'bottom' | 'top' | 'center'>('center');
  const setActiveTab = useResumeStore((s) => s.setActiveTab);

  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;

  const measure = useCallback(() => {
    if (!step?.target) {
      setRect(null);
      setTooltipSide('center');
      return;
    }
    const next = getTargetRect(step.target);
    setRect(next);
    if (!next) {
      setTooltipSide('center');
      return;
    }
    // Prefer above when target sits in the lower half (e.g. SoftCV agent FAB)
    const targetMidY = next.top + next.height / 2;
    const preferTop = targetMidY > window.innerHeight * 0.45;
    const spaceBelow = window.innerHeight - (next.top + next.height);
    const spaceAbove = next.top;
    if (preferTop && spaceAbove > 180) {
      setTooltipSide('top');
    } else if (spaceBelow > 220) {
      setTooltipSide('bottom');
    } else if (spaceAbove > 180) {
      setTooltipSide('top');
    } else {
      setTooltipSide('center');
    }
  }, [step]);

  useEffect(() => {
    if (open) setStepIndex(0);
  }, [open]);

  // Ensure the right mobile pane is visible for spotlight steps
  useEffect(() => {
    if (!open || !step?.target) return;
    if (step.target === 'editor') setActiveTab('edit');
    if (step.target === 'preview') setActiveTab('preview');
    const t = window.setTimeout(() => measure(), 80);
    return () => window.clearTimeout(t);
  }, [open, step, setActiveTab, measure]);

  useLayoutEffect(() => {
    if (!open) return;
    const id = window.requestAnimationFrame(() => measure());
    return () => window.cancelAnimationFrame(id);
  }, [open, stepIndex, measure]);

  useEffect(() => {
    if (!open) return;
    const onResize = () => measure();
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize, true);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onResize, true);
    };
  }, [open, measure]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        markComplete();
        onClose();
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setStepIndex((i) => Math.max(0, i - 1));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, stepIndex, onClose]);

  const finish = () => {
    markComplete();
    onClose();
  };

  const goNext = () => {
    if (isLast) {
      finish();
      return;
    }
    // Skip steps whose targets are missing (e.g. template on mobile)
    let next = stepIndex + 1;
    while (next < STEPS.length) {
      const s = STEPS[next];
      if (!s.target || getTargetRect(s.target)) break;
      next += 1;
    }
    if (next >= STEPS.length) {
      finish();
      return;
    }
    setStepIndex(next);
  };

  const goBack = () => {
    let prev = stepIndex - 1;
    while (prev > 0) {
      const s = STEPS[prev];
      if (!s.target || getTargetRect(s.target)) break;
      prev -= 1;
    }
    setStepIndex(Math.max(0, prev));
  };

  if (!open) return null;

  const TOOLTIP_W = 320;
  const TOOLTIP_H = 240; // approx; clamped so buttons stay on-screen
  const MARGIN = 16;

  const tooltipStyle: React.CSSProperties = (() => {
    if (!rect || tooltipSide === 'center') {
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        maxHeight: `calc(100dvh - ${MARGIN * 2}px)`,
        overflowY: 'auto' as const,
      };
    }

    const maxLeft = Math.max(MARGIN, window.innerWidth - TOOLTIP_W - MARGIN);
    let left = Math.min(Math.max(MARGIN, rect.left + rect.width / 2 - TOOLTIP_W / 2), maxLeft);

    // Keep card clear of the FAB when highlighting the agent button
    if (step.target === 'agent') {
      left = Math.min(left, Math.max(MARGIN, rect.left - TOOLTIP_W - 12));
    }

    let top: number;
    if (tooltipSide === 'bottom') {
      top = rect.top + rect.height + 14;
    } else {
      top = rect.top - 14 - TOOLTIP_H;
    }

    // Clamp fully inside viewport so actions stay clickable
    const maxTop = window.innerHeight - TOOLTIP_H - MARGIN;
    top = Math.min(Math.max(MARGIN, top), Math.max(MARGIN, maxTop));

    return {
      top,
      left,
      width: `min(${TOOLTIP_W}px, calc(100vw - ${MARGIN * 2}px))`,
      maxHeight: `calc(100dvh - ${MARGIN * 2}px)`,
      overflowY: 'auto' as const,
    };
  })();

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] no-print" role="dialog" aria-modal="true" aria-label="SoftCV guided tour">
          {/* Dim + spotlight cutout — pointer-events only on backdrop, not cutout */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
          >
            {rect ? (
              <div
                className="absolute rounded-2xl ring-2 ring-teal-400/90 shadow-[0_0_0_9999px_rgba(15,23,42,0.62)] transition-all duration-300 pointer-events-none"
                style={{
                  top: rect.top,
                  left: rect.left,
                  width: rect.width,
                  height: rect.height,
                }}
              />
            ) : (
              <div className="absolute inset-0 bg-slate-900/65 backdrop-blur-[2px] pointer-events-none" />
            )}
          </motion.div>
          <button
            type="button"
            className="absolute inset-0 z-0 cursor-default bg-transparent"
            aria-label="Dismiss tour"
            onClick={finish}
          />

          {/* Tooltip card */}
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="absolute z-10 w-[min(20rem,calc(100vw-2rem))] rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl"
            style={tooltipStyle}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
                  <BrainCircuit className="h-4 w-4" strokeWidth={2} />
                </span>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-teal-700">
                    SoftCV tour · {stepIndex + 1}/{STEPS.length}
                  </p>
                  <h2 className="font-display text-base font-semibold tracking-tight text-slate-900">
                    {step.title}
                  </h2>
                </div>
              </div>
              <button
                type="button"
                onClick={finish}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                aria-label="Skip tour"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-sm leading-relaxed text-slate-600">{step.body}</p>

            <div className="mt-5 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={finish}
                className="text-xs font-medium text-slate-500 transition-colors hover:text-slate-800"
              >
                Skip
              </button>
              <div className="flex items-center gap-2">
                {stepIndex > 0 && (
                  <button
                    type="button"
                    onClick={goBack}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    Back
                  </button>
                )}
                <button
                  type="button"
                  onClick={goNext}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-teal-600"
                >
                  {isLast ? 'Got it' : 'Next'}
                  {!isLast && <ArrowRight className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
