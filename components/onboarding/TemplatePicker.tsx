'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, LayoutTemplate } from 'lucide-react';
import { TemplateId } from '@/types/resume';
import { RESUME_TEMPLATES } from '@/lib/templates';

interface TemplatePickerProps {
  open: boolean;
  onSelect: (id: TemplateId) => void;
}

const previewStyles: Record<
  TemplateId,
  { shell: string; accent: string; layout: 'sidebar' | 'banner' | 'single' | 'dense' }
> = {
  modern: { shell: 'bg-white', accent: 'bg-teal-600', layout: 'sidebar' },
  professional: { shell: 'bg-white', accent: 'bg-slate-800', layout: 'single' },
  minimal: { shell: 'bg-white', accent: 'bg-slate-400', layout: 'single' },
  ats: { shell: 'bg-white', accent: 'bg-slate-500', layout: 'single' },
  compact: { shell: 'bg-white', accent: 'bg-teal-700', layout: 'dense' },
  creative: { shell: 'bg-white', accent: 'bg-teal-500', layout: 'banner' },
};

function MiniPreview({ id }: { id: TemplateId }) {
  const style = previewStyles[id];
  return (
    <div className={`relative h-28 w-full overflow-hidden rounded-lg border border-slate-200 ${style.shell}`}>
      {style.layout === 'sidebar' && (
        <div className="flex h-full">
          <div className={`w-[34%] ${style.accent} p-1.5 space-y-1`}>
            <div className="mx-auto h-4 w-4 rounded-full bg-white/30" />
            <div className="h-1 w-full rounded bg-white/25" />
            <div className="h-1 w-4/5 rounded bg-white/20" />
            <div className="mt-2 space-y-0.5">
              <div className="h-1 w-full rounded bg-white/20" />
              <div className="h-1 w-3/4 rounded bg-white/15" />
            </div>
          </div>
          <div className="flex-1 p-2 space-y-1.5">
            <div className={`h-1 w-1/3 rounded ${style.accent}`} />
            <div className="h-1 w-full rounded bg-slate-200" />
            <div className="h-1 w-5/6 rounded bg-slate-200" />
            <div className={`mt-2 h-1 w-1/4 rounded ${style.accent}`} />
            <div className="h-1 w-full rounded bg-slate-200" />
            <div className="h-1 w-4/5 rounded bg-slate-200" />
          </div>
        </div>
      )}
      {style.layout === 'banner' && (
        <div className="flex h-full flex-col">
          <div className={`flex h-8 items-center gap-1.5 px-2 ${style.accent}`}>
            <div className="h-4 w-4 rounded-full bg-white/30" />
            <div className="h-1.5 w-12 rounded bg-white/40" />
          </div>
          <div className="flex-1 space-y-1 p-2">
            <div className="h-1 w-full rounded bg-slate-200" />
            <div className="h-1 w-5/6 rounded bg-slate-200" />
            <div className="h-1 w-2/3 rounded bg-slate-200" />
          </div>
        </div>
      )}
      {(style.layout === 'single' || style.layout === 'dense') && (
        <div className={`space-y-1 p-2.5 ${style.layout === 'dense' ? 'space-y-0.5' : ''}`}>
          <div className="h-2 w-1/2 rounded bg-slate-800/80" />
          <div className={`h-0.5 w-full rounded ${style.accent} opacity-60`} />
          <div className="h-1 w-full rounded bg-slate-200" />
          <div className="h-1 w-5/6 rounded bg-slate-200" />
          <div className="mt-1.5 h-1 w-1/3 rounded bg-slate-700/70" />
          <div className="h-1 w-full rounded bg-slate-200" />
          <div className="h-1 w-4/5 rounded bg-slate-200" />
          {style.layout === 'dense' && (
            <>
              <div className="h-1 w-full rounded bg-slate-200" />
              <div className="h-1 w-3/4 rounded bg-slate-200" />
            </>
          )}
        </div>
      )}
    </div>
  );
}

export const TemplatePicker: React.FC<TemplatePickerProps> = ({ open, onSelect }) => {
  const [selected, setSelected] = useState<TemplateId>('modern');

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex flex-col bg-[#f7f8fa] no-print">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 right-[-10%] h-[380px] w-[380px] rounded-full bg-teal-400/15 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-8%] h-[300px] w-[300px] rounded-full bg-cyan-300/10 blur-[90px]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8 lg:px-8 safe-top safe-bottom">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 sm:mb-8"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
            <LayoutTemplate className="h-3.5 w-3.5" />
            Choose your template
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Pick a layout to start SoftCV
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
            You can switch templates anytime from the toolbar. Choose the style that fits the role
            you&apos;re applying for.
          </p>
        </motion.div>

        <div className="grid flex-1 grid-cols-1 gap-3 overflow-y-auto pb-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
          {RESUME_TEMPLATES.map((tmpl, i) => {
            const isActive = selected === tmpl.id;
            return (
              <motion.button
                key={tmpl.id}
                type="button"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 * i, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setSelected(tmpl.id)}
                onDoubleClick={() => onSelect(tmpl.id)}
                className={`group relative flex flex-col rounded-2xl border bg-white p-3 text-left shadow-sm transition-all sm:p-4 ${
                  isActive
                    ? 'border-teal-500 ring-2 ring-teal-500/25 shadow-md'
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                {isActive && (
                  <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-white shadow-sm">
                    <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </span>
                )}
                <MiniPreview id={tmpl.id} />
                <div className="mt-3">
                  <p className="font-display text-sm font-semibold text-slate-900">{tmpl.name}</p>
                  <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-teal-700">
                    {tmpl.desc}
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{tmpl.blurb}</p>
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="mt-4 flex shrink-0 flex-col-reverse gap-3 border-t border-slate-200/80 pt-4 sm:mt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-center text-xs text-slate-500 sm:text-left">
            Selected: <span className="font-semibold text-slate-800 capitalize">{selected}</span>
          </p>
          <button
            type="button"
            onClick={() => onSelect(selected)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-600"
          >
            Continue with {RESUME_TEMPLATES.find((t) => t.id === selected)?.name}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
