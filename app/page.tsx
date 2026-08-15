'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  FileDown,
  LayoutTemplate,
  Menu,
  MessageSquare,
  SplitSquareHorizontal,
  X,
} from 'lucide-react';

const ease = [0.16, 1, 0.3, 1] as const;

const workflow = [
  {
    step: '01',
    title: 'Fill your story',
    body: 'Add experience, skills, and education in a structured editor — or paste a draft and refine as you go.',
  },
  {
    step: '02',
    title: 'Shape the layout',
    body: 'Pick a template, tune accent color, and reorder sections while the A4 preview updates live.',
  },
  {
    step: '03',
    title: 'Export with confidence',
    body: 'Run ATS completeness checks, ask SoftCV AI for polish, then download a clean multi-page PDF.',
  },
];

const capabilities = [
  {
    icon: SplitSquareHorizontal,
    title: 'Split-screen workspace',
    body: 'Edit on the left, see true A4 pagination on the right — what you preview is what you export.',
  },
  {
    icon: LayoutTemplate,
    title: 'Templates that stay readable',
    body: 'Modern, Professional, Minimal, ATS, Compact, and Creative — designed for hiring screens and print.',
  },
  {
    icon: MessageSquare,
    title: 'SoftCV AI agent',
    body: 'Ask for theme changes, stronger bullets, or layout tweaks — updates apply against the live resume.',
  },
  {
    icon: FileDown,
    title: 'Pixel-faithful PDF',
    body: 'Export with consistent margins and page breaks so your document looks board-ready offline.',
  },
];

const templates = [
  { name: 'Modern', note: 'Sidebar + photo' },
  { name: 'Professional', note: 'Classic corporate' },
  { name: 'Minimal', note: 'Clean & quiet' },
  { name: 'ATS', note: 'Parser-friendly' },
  { name: 'Compact', note: 'Dense one-pager' },
  { name: 'Creative', note: 'Accent-forward' },
];

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  /** Shared mobile shell width — closed pill and open menu must match */
  const mobileHeaderWidth = 'w-[min(18.5rem,calc(100%-2rem))]';

  const mobileNavLinks = [
    { label: 'Softora', href: 'https://softora-co.vercel.app/', external: true },
    { label: 'How it works', href: '#how' },
    { label: 'Features', href: '#features' },
    { label: 'Templates', href: '#templates' },
  ] as const;
  return (
    <div className="min-h-[100dvh] overflow-y-auto overflow-x-hidden bg-[#f7f8fa] text-slate-900">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#f7f8fa]" />
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(15,23,42,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.035) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
            maskImage: 'linear-gradient(to bottom, black 0%, black 40%, transparent 85%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 40%, transparent 85%)',
          }}
        />
        <div className="absolute -top-24 right-[-10%] h-[420px] w-[420px] rounded-full bg-teal-400/15 blur-[100px]" />
        <div className="absolute top-[30%] left-[-8%] h-[320px] w-[320px] rounded-full bg-cyan-300/10 blur-[90px]" />
      </div>

      {/* Fixed floating header — Softora-size pill; menu expands from this same bar */}
      <div className="pointer-events-none fixed top-4 right-0 left-0 z-50 flex flex-col items-center px-4 safe-top">
        <header
          className={`pointer-events-auto relative ${mobileHeaderWidth} lg:w-fit lg:max-w-[calc(100%-2rem)] rounded-2xl border border-slate-200 bg-white/95 shadow-sm backdrop-blur-md transition-shadow duration-300 ${
            isScrolled || menuOpen ? 'shadow-md' : ''
          }`}
        >
          <div className="flex w-full items-center justify-between gap-10 px-4 py-3.5 sm:gap-12 sm:px-5 sm:py-4">
            <Link
              href="/"
              className="inline-flex min-w-0 shrink-0 items-center group"
              aria-label="SoftCV"
              onClick={closeMenu}
            >
              <img
                src="/SoftCV.png"
                alt="SoftCV"
                className="h-5 w-auto object-contain transition-opacity group-hover:opacity-90 md:h-[1.35rem]"
              />
            </Link>

            <nav className="hidden shrink-0 items-center gap-1 lg:flex">
              <a
                href="https://softora-co.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
              >
                Softora
              </a>
              <a
                href="#how"
                className="px-2.5 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
              >
                How it works
              </a>
              <a
                href="#features"
                className="px-2.5 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
              >
                Features
              </a>
              <Link
                href="/builder?chooseTemplate=1"
                className="ml-1 inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-teal-600"
              >
                Open SoftCV
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </nav>

            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-900 transition-colors hover:bg-slate-100 lg:hidden"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? (
                <X className="h-5 w-5" strokeWidth={2} />
              ) : (
                <Menu className="h-5 w-5" strokeWidth={2} />
              )}
            </button>
          </div>
        </header>

        {/* Dropdown from the same header — Softora style (no second logo bar) */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Navigation"
              initial={reduceMotion ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.28, ease }}
              className={`pointer-events-auto relative z-10 mt-2 h-fit ${mobileHeaderWidth} overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_16px_40px_-16px_rgba(15,23,42,0.3)] lg:hidden`}
            >
              <nav className="flex flex-col px-2 py-1.5">
                {mobileNavLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    {...('external' in item && item.external
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                    onClick={closeMenu}
                    className="group flex items-center justify-between rounded-xl px-4 py-3 text-[15px] font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
                  >
                    {item.label}
                    <ChevronRight className="h-4 w-4 text-slate-300 transition-colors group-hover:text-slate-500" />
                  </a>
                ))}
              </nav>

              <div className="border-t border-slate-100 p-3">
                <Link
                  href="/builder?chooseTemplate=1"
                  onClick={closeMenu}
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-600"
                >
                  Open SoftCV
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {menuOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-transparent lg:hidden"
          aria-label="Close menu"
          onClick={closeMenu}
        />
      )}

      <main className="relative z-10">
        {/* Hero — full first viewport only (mobile matches Softora: text+CTAs, no mockup) */}
        <section className="flex min-h-[100dvh] items-center">
          <div className="mx-auto w-full max-w-6xl px-5 pb-16 pt-32 sm:px-8 sm:pb-20 sm:pt-36 lg:px-10 lg:pb-16 lg:pt-28">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10">
            <div className="mx-auto w-full max-w-xl text-center lg:mx-0 lg:text-left">
              <motion.h1
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05, duration: 0.55, ease }}
                className="font-display text-4xl font-bold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.4rem]"
              >
                Build a resume that looks finished — while you write it.
              </motion.h1>

              <motion.p
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12, duration: 0.5, ease }}
                className="mx-auto mt-6 max-w-lg text-[15px] leading-relaxed text-slate-600 sm:mt-7 sm:text-lg lg:mx-0"
              >
                SoftCV is Softora&apos;s live resume builder: split-screen editing, ATS-aware templates,
                AI polish, and PDF export that matches the preview. Free to use — open SoftCV and start
                writing. No account, no login.
              </motion.p>

              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 0.45, ease }}
                className="mt-10 flex w-full flex-col items-stretch gap-3 sm:mx-auto sm:mt-10 sm:max-w-md lg:mx-0 lg:mt-8 lg:max-w-none lg:flex-row lg:flex-wrap lg:items-center"
              >
                <Link
                  href="/builder?chooseTemplate=1"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-600 lg:w-auto"
                >
                  Start building — it&apos;s free
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <a
                  href="#how"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-medium text-slate-800 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50 lg:w-auto"
                >
                  See how it works
                </a>
              </motion.div>

              <motion.ul
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.28, duration: 0.5 }}
                className="mt-10 flex flex-wrap justify-center gap-x-5 gap-y-2.5 text-sm text-slate-500 lg:mt-8 lg:justify-start"
              >
                {['Free forever', 'No login required', 'Works in your browser', 'PDF export'].map((item) => (
                  <li key={item} className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-teal-600" strokeWidth={2} />
                    {item}
                  </li>
                ))}
              </motion.ul>
            </div>

            {/* Product visual — desktop only (Softora-style mobile hero has no mockup) */}
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.65, ease }}
              className="relative mx-auto hidden w-full max-w-md lg:mx-0 lg:block lg:max-w-none"
              aria-hidden
            >
              <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-teal-500/10 via-transparent to-slate-900/5 blur-2xl" />
              <motion.div
                animate={
                  reduceMotion
                    ? undefined
                    : { y: [0, -6, 0] }
                }
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_24px_60px_-20px_rgba(15,23,42,0.25)]"
              >
                <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/80 px-4 py-2.5">
                  <span className="h-2 w-2 rounded-full bg-slate-300" />
                  <span className="h-2 w-2 rounded-full bg-slate-300" />
                  <span className="h-2 w-2 rounded-full bg-slate-300" />
                  <span className="ml-2 font-display text-[11px] font-medium tracking-wide text-slate-400">
                    SoftCV · Live preview
                  </span>
                </div>
                <div className="grid grid-cols-[0.34fr_0.66fr] min-h-[280px] sm:min-h-[340px]">
                  <div className="bg-teal-700 px-3 py-4 text-white sm:px-4 sm:py-5">
                    <div className="mx-auto mb-3 h-10 w-10 rounded-full bg-white/20 sm:mb-4 sm:h-12 sm:w-12" />
                    <p className="font-display text-[10px] font-semibold uppercase tracking-[0.14em] text-teal-100/90">
                      Contact
                    </p>
                    <div className="mt-2 space-y-1.5">
                      <div className="h-1.5 w-full rounded bg-white/25" />
                      <div className="h-1.5 w-4/5 rounded bg-white/20" />
                      <div className="h-1.5 w-3/5 rounded bg-white/15" />
                    </div>
                    <p className="mt-5 font-display text-[10px] font-semibold uppercase tracking-[0.14em] text-teal-100/90">
                      Skills
                    </p>
                    <div className="mt-2 space-y-1.5">
                      <div className="h-1.5 w-full rounded bg-white/25" />
                      <div className="h-1.5 w-5/6 rounded bg-white/20" />
                      <div className="h-1.5 w-2/3 rounded bg-white/15" />
                    </div>
                  </div>
                  <div className="bg-[#fafbfc] px-3 py-4 sm:px-5 sm:py-5">
                    <div className="h-3 w-2/3 rounded bg-slate-800/90 sm:h-3.5" />
                    <div className="mt-2 h-1.5 w-1/2 rounded bg-teal-600/70" />
                    <div className="mt-5 space-y-2">
                      <div className="h-1.5 w-full rounded bg-slate-200" />
                      <div className="h-1.5 w-[92%] rounded bg-slate-200" />
                      <div className="h-1.5 w-[78%] rounded bg-slate-200" />
                    </div>
                    <p className="mt-6 font-display text-[10px] font-semibold uppercase tracking-[0.16em] text-teal-700">
                      Experience
                    </p>
                    <div className="mt-2 space-y-3">
                      <div>
                        <div className="h-2 w-1/2 rounded bg-slate-700/80" />
                        <div className="mt-1.5 space-y-1">
                          <div className="h-1.5 w-full rounded bg-slate-200" />
                          <div className="h-1.5 w-[88%] rounded bg-slate-200" />
                        </div>
                      </div>
                      <div>
                        <div className="h-2 w-2/5 rounded bg-slate-700/80" />
                        <div className="mt-1.5 space-y-1">
                          <div className="h-1.5 w-full rounded bg-slate-200" />
                          <div className="h-1.5 w-4/5 rounded bg-slate-200" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="scroll-mt-28 border-y border-slate-200/80 bg-white">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, ease }}
              className="max-w-2xl"
            >
              <p className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-700">
                Workflow
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                From blank page to interview-ready PDF
              </h2>
              <p className="mt-3 text-base leading-relaxed text-slate-600">
                SoftCV keeps writing and layout in one loop — no exporting early just to see if it fits.
              </p>
            </motion.div>

            <ol className="mt-12 grid gap-0 border-t border-slate-200 sm:grid-cols-3">
              {workflow.map((item, i) => (
                <motion.li
                  key={item.step}
                  initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: i * 0.08, duration: 0.45, ease }}
                  className="border-b border-slate-200 py-8 sm:border-b-0 sm:border-r sm:px-6 sm:py-10 sm:first:pl-0 sm:last:border-r-0 sm:last:pr-0 lg:px-8"
                >
                  <span className="font-display text-sm font-semibold text-teal-700">{item.step}</span>
                  <h3 className="mt-3 font-display text-xl font-semibold tracking-tight text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.body}</p>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="scroll-mt-28">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, ease }}
              className="max-w-2xl"
            >
              <p className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-700">
                Capabilities
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Everything you need after the first draft
              </h2>
              <p className="mt-3 text-base leading-relaxed text-slate-600">
                SoftCV is built for precision — governed layouts, live feedback, and export you can trust.
              </p>
            </motion.div>

            <ul className="mt-12 grid gap-10 sm:grid-cols-2">
              {capabilities.map((item, i) => (
                <motion.li
                  key={item.title}
                  initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: i * 0.06, duration: 0.45, ease }}
                  className="flex gap-4"
                >
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
                    <item.icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold tracking-tight text-slate-900">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{item.body}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        </section>

        {/* Templates */}
        <section id="templates" className="scroll-mt-28 border-y border-slate-200/80 bg-slate-900 text-white">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, ease }}
                className="max-w-xl"
              >
                <p className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-300">
                  Templates
                </p>
                <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                  Six layouts. One export pipeline.
                </h2>
                <p className="mt-3 text-base leading-relaxed text-slate-300">
                  Switch styles without rebuilding content. SoftCV keeps your data; templates only change presentation.
                </p>
              </motion.div>
              <Link
                href="/builder?chooseTemplate=1"
                className="inline-flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-teal-50"
              >
                Try templates in SoftCV
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <ul className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-3 lg:grid-cols-6">
              {templates.map((t, i) => (
                <motion.li
                  key={t.name}
                  initial={reduceMotion ? false : { opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  className="bg-slate-900 px-4 py-6 sm:px-5"
                >
                  <p className="font-display text-base font-semibold tracking-tight">{t.name}</p>
                  <p className="mt-1 text-xs text-slate-400">{t.note}</p>
                </motion.li>
              ))}
            </ul>
          </div>
        </section>

        {/* AI */}
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, ease }}
              >
                <p className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-700">
                  SoftCV AI
                </p>
                <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  Ask for changes. Watch the resume move.
                </h2>
                <p className="mt-4 text-base leading-relaxed text-slate-600">
                  SoftCV&apos;s agent understands your live document — themes, wording, and structure — so
                  coaching turns into applied updates, not copy-paste homework.
                </p>
                <ul className="mt-6 space-y-3 text-sm text-slate-600">
                  {[
                    'Rewrite bullets for impact and clarity',
                    'Swap templates and accent colors on request',
                    'Stay in flow with history and undo-friendly edits',
                  ].map((line) => (
                    <li key={line} className="flex items-start gap-2.5">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                      {line}
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, ease }}
                className="relative"
                aria-hidden
              >
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-[#f7f8fa] p-4 sm:p-5">
                  <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                      <span className="font-display text-sm font-semibold text-slate-800">SoftCV Agent</span>
                      <span className="text-[11px] font-medium text-teal-700">Live</span>
                    </div>
                    <div className="space-y-3 px-4 py-4">
                      <div className="ml-auto max-w-[85%] rounded-2xl bg-slate-900 px-3.5 py-2.5 text-sm text-white">
                        Make my experience bullets more results-focused and switch to the Modern template.
                      </div>
                      <div className="max-w-[90%] rounded-2xl border border-slate-100 bg-slate-50 px-3.5 py-2.5 text-sm leading-relaxed text-slate-700">
                        Done — Modern template applied and three experience bullets tightened for impact.
                        Check the live preview.
                      </div>
                    </div>
                    <div className="border-t border-slate-100 px-4 py-3">
                      <div className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-400">
                        Ask SoftCV to refine your CV…
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-slate-200/80">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, ease }}
              className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-teal-700 via-teal-800 to-slate-900 px-6 py-12 text-white sm:px-10 sm:py-14 lg:px-14"
            >
              <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-teal-400/20 blur-3xl" />
              <div className="absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-cyan-300/10 blur-3xl" />
              <div className="relative max-w-2xl">
                <p className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-200/90">
                  SoftCV · by Softora
                </p>
                <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                  Open SoftCV and finish your resume today.
                </h2>
                <p className="mt-3 text-base leading-relaxed text-teal-50/85">
                  SoftCV is free — no signup, no login, no install. Your resume stays in the browser
                  until you export. Built by Softora for people who care how their documents look.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/builder?chooseTemplate=1"
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-teal-50"
                  >
                    Launch SoftCV — free
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <a
                    href="https://softora-co.vercel.app/contact"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/5 px-5 py-3.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
                  >
                    Talk to Softora
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-slate-200/80 bg-white/80">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:px-8 lg:flex-row lg:items-start lg:justify-between lg:px-10 safe-bottom">
          <div>
            <img src="/SoftCV.png" alt="SoftCV" className="h-5 w-auto object-contain" />
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-500">
              Free live resume builder by Softora. No login required.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-600">
            <a href="#how" className="hover:text-teal-700 transition-colors">
              How it works
            </a>
            <a href="#features" className="hover:text-teal-700 transition-colors">
              Features
            </a>
            <a href="#templates" className="hover:text-teal-700 transition-colors">
              Templates
            </a>
            <a
              href="https://softora-co.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-teal-700 transition-colors"
            >
              Softora
            </a>
            <Link href="/builder?chooseTemplate=1" className="font-semibold text-slate-900 hover:text-teal-700 transition-colors">
              Open SoftCV
            </Link>
          </div>
        </div>
        <div className="border-t border-slate-100">
          <p className="mx-auto max-w-6xl px-5 py-4 text-xs text-slate-400 sm:px-8 lg:px-10">
            © {new Date().getFullYear()} Softora IT Solutions · Dharga Town, Sri Lanka
          </p>
        </div>
      </footer>
    </div>
  );
}
