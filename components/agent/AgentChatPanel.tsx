'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  BrainCircuit,
  X,
  Plus,
  SquarePen,
  History,
  ArrowUp,
  Trash2,
  MessageCircle,
} from 'lucide-react';
import { useResumeStore } from '@/store/useResumeStore';
import { applyAgentActions } from '@/lib/agent/applyActions';
import type { AgentAction } from '@/lib/agent/actions';

type ChatRole = 'user' | 'assistant' | 'system';

type ChatItem = {
  id: string;
  role: ChatRole;
  content: string;
  changelog?: string[];
};

type SavedChat = {
  id: string;
  title: string;
  updatedAt: number;
  messages: ChatItem[];
};

const SUGGESTIONS = [
  'Make it more corporate with a navy theme',
  'Creative teal ocean look',
  'Switch to ATS-friendly template',
  'Strengthen my professional summary',
  'Rewrite experience bullets for impact',
  'Give me ATS writing tips for this CV',
];

const HISTORY_KEY = 'softora-cv-agent-history';

function loadingPhrasesFor(message: string): string[] {
  const t = message.toLowerCase();

  if (/\b(summary|professional summary|profile|about me)\b/.test(t)) {
    return ['Rewriting your summary…', 'Sharpening impact keywords…', 'Polishing your opener…'];
  }
  if (/\b(experience|bullet|bullets|work history|job|roles?)\b/.test(t)) {
    return ['Improving experience bullets…', 'Making wins more measurable…', 'Tightening role copy…'];
  }
  if (/\b(skill|skills|tech stack|technologies)\b/.test(t)) {
    return ['Updating your skills…', 'Organizing skill groups…', 'Aligning skills to roles…'];
  }
  if (/\b(project|projects|portfolio)\b/.test(t)) {
    return ['Refining your projects…', 'Highlighting tech & impact…', 'Cleaning project copy…'];
  }
  if (/\b(education|degree|university|school)\b/.test(t)) {
    return ['Updating education…', 'Formatting education details…'];
  }
  if (/\b(ats|keyword|keywords|scanner|applicant)\b/.test(t)) {
    return ['Reviewing ATS fit…', 'Gathering keyword tips…', 'Checking scan-friendly wording…'];
  }
  if (/\b(template|layout|modern|classic|minimal|ats-friendly)\b/.test(t)) {
    return ['Switching template…', 'Adjusting layout…', 'Refreshing structure…'];
  }
  if (/\b(color|colour|theme|navy|teal|corporate|creative|palette|accent)\b/.test(t)) {
    return ['Designing your theme…', 'Applying color accents…', 'Refreshing visual style…'];
  }
  if (/\b(certif|language|award|section)\b/.test(t)) {
    return ['Updating sections…', 'Applying section changes…'];
  }
  if (/\b(tip|advice|coach|help|improve|feedback|review|suggest)\b/.test(t)) {
    return ['Coaching your CV…', 'Reviewing your content…', 'Preparing guidance…'];
  }
  if (
    /\b(love|like|perfect|great|awesome|thanks|yes|ok|okay|do it|go ahead)\b/.test(t) ||
    t.length < 24
  ) {
    return ['Applying your feedback…', 'Following up on that…', 'Updating the resume…'];
  }

  return ['Working on your request…', 'Analyzing your resume…', 'Preparing updates…'];
}

function loadHistory(): SavedChat[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedChat[];
    return Array.isArray(parsed) ? parsed.slice(0, 20) : [];
  } catch {
    return [];
  }
}

function saveHistory(list: SavedChat[]) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, 20)));
  } catch {
    /* ignore quota */
  }
}

export const AgentChatPanel: React.FC = () => {
  const resumeData = useResumeStore((s) => s.resumeData);

  const [open, setOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState<SavedChat[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [statusPhrase, setStatusPhrase] = useState('Working on your request…');
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const statusPhrasesRef = useRef<string[]>([]);

  const isEmpty = !messages.some((m) => m.role === 'user');

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  useEffect(() => {
    if (!open || isEmpty || historyOpen) return;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      });
    });
    return () => cancelAnimationFrame(id);
  }, [messages, open, busy, isEmpty, historyOpen]);

  useEffect(() => {
    if (open && !historyOpen) setTimeout(() => inputRef.current?.focus(), 120);
  }, [open, historyOpen]);

  useEffect(() => {
    if (!busy) return;
    const phrases = statusPhrasesRef.current;
    if (phrases.length < 2) return;
    let i = 0;
    const id = window.setInterval(() => {
      i = (i + 1) % phrases.length;
      setStatusPhrase(phrases[i]);
    }, 2200);
    return () => window.clearInterval(id);
  }, [busy]);

  const persistCurrentIfNeeded = useCallback(() => {
    if (!messages.some((m) => m.role === 'user')) return;
    const firstUser = messages.find((m) => m.role === 'user');
    const title = (firstUser?.content || 'CV chat').slice(0, 48);
    const entry: SavedChat = {
      id: `chat-${Date.now()}`,
      title,
      updatedAt: Date.now(),
      messages,
    };
    setHistory((prev) => {
      const next = [entry, ...prev].slice(0, 20);
      saveHistory(next);
      return next;
    });
  }, [messages]);

  const startNewChat = () => {
    if (busy) return;
    persistCurrentIfNeeded();
    setMessages([]);
    setInput('');
    setError(null);
    setHistoryOpen(false);
    setShowSuggestions(false);
    setStatusPhrase('Working on your request…');
  };

  const openSavedChat = (chat: SavedChat) => {
    if (busy) return;
    persistCurrentIfNeeded();
    setMessages(chat.messages);
    setHistoryOpen(false);
    setError(null);
  };

  const deleteSavedChat = (id: string) => {
    setHistory((prev) => {
      const next = prev.filter((c) => c.id !== id);
      saveHistory(next);
      return next;
    });
  };

  const send = async (raw: string) => {
    const text = raw.trim();
    if (!text || busy) return;

    setError(null);
    setInput('');
    setShowSuggestions(false);
    setHistoryOpen(false);
    const userMsg: ChatItem = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
    };
    setMessages((prev) => [...prev, userMsg]);
    const phrases = loadingPhrasesFor(text);
    statusPhrasesRef.current = phrases;
    setStatusPhrase(phrases[0]);
    setBusy(true);

    try {
      const historyMsgs = [...messages, userMsg]
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .slice(-8)
        .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          resumeData,
          history: historyMsgs.slice(0, -1),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Agent request failed');
      }

      const actions = (data.actions || []) as AgentAction[];
      const changelog = applyAgentActions(actions);

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: data.reply || 'Done.',
          changelog: changelog.filter((l) => !l.startsWith('Advice')),
        },
      ]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong';
      setError(msg);
      setMessages((prev) => [
        ...prev,
        {
          id: `e-${Date.now()}`,
          role: 'assistant',
          content: `I couldn't complete that. ${msg}`,
        },
      ]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed right-4 bottom-[4.75rem] z-[55] flex flex-col items-end gap-3 no-print md:right-6 lg:bottom-6">
      {open && (
        <div
          className="flex h-[min(560px,75vh)] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
          aria-label="SoftCV Agent"
        >
          {/* Header — Softora style */}
          <div className="flex items-center justify-between px-2 py-2 shrink-0">
            <button
              type="button"
              onClick={startNewChat}
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 disabled:opacity-40"
              aria-label="New chat"
              title="New chat"
            >
              <SquarePen size={15} />
              New chat
            </button>
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setHistoryOpen((v) => !v)}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 ${
                  historyOpen ? 'bg-slate-100 text-slate-900' : ''
                }`}
                aria-label="Chat history"
                title="History"
              >
                <History size={18} />
              </button>
              <button
                type="button"
                onClick={() => {
                  setHistoryOpen(false);
                  setOpen(false);
                }}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="relative flex-1 min-h-0 overflow-hidden">
            {historyOpen ? (
              <div className="absolute inset-0 z-10 overflow-y-auto bg-white px-3 py-2 agent-chat-scroll">
                <p className="mb-3 px-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                  History
                </p>
                {history.length === 0 ? (
                  <p className="px-1 text-sm text-slate-500">No saved chats yet.</p>
                ) : (
                  <ul className="space-y-1">
                    {history.map((chat) => (
                      <li key={chat.id}>
                        <div className="group flex items-center gap-1 rounded-xl hover:bg-slate-50">
                          <button
                            type="button"
                            onClick={() => openSavedChat(chat)}
                            className="min-w-0 flex-1 px-3 py-2.5 text-left"
                          >
                            <div className="truncate text-sm font-medium text-slate-800">
                              {chat.title}
                            </div>
                            <div className="mt-0.5 text-[11px] text-slate-400">
                              {new Date(chat.updatedAt).toLocaleString()}
                            </div>
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteSavedChat(chat.id)}
                            className="mr-1 inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-400 opacity-0 transition-opacity hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100"
                            aria-label="Delete chat"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : null}

            <div
              ref={listRef}
              className={`agent-chat-scroll h-full overflow-y-auto overscroll-contain px-4 scroll-smooth ${
                isEmpty ? 'flex items-center justify-center' : 'space-y-3 bg-white py-2'
              }`}
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {isEmpty ? (
                <p className="max-w-[240px] text-center font-display text-xl font-semibold leading-snug text-slate-800">
                  Design your CV with SoftCV
                </p>
              ) : (
                <>
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                          m.role === 'user'
                            ? 'bg-slate-900 text-white'
                            : 'border border-slate-100 bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div
                          className={`break-words [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:my-1.5 [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:my-1.5 [&_ol]:list-decimal [&_ol]:pl-4 [&_li]:my-0.5 [&_strong]:font-semibold [&_em]:italic ${
                            m.role === 'user' ? '[&_strong]:text-white' : '[&_strong]:text-slate-900'
                          }`}
                        >
                          <ReactMarkdown
                            components={{
                              a: ({ href, children }) => (
                                <a
                                  href={href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={
                                    m.role === 'user'
                                      ? 'underline text-teal-100'
                                      : 'underline text-teal-700'
                                  }
                                >
                                  {children}
                                </a>
                              ),
                            }}
                          >
                            {m.content}
                          </ReactMarkdown>
                        </div>
                        {m.changelog && m.changelog.length > 0 && (
                          <ul className="mt-2 pt-2 border-t border-slate-200/80 space-y-1">
                            {m.changelog.map((line, i) => (
                              <li
                                key={i}
                                className="text-[10px] font-semibold text-teal-700 flex items-center gap-1"
                              >
                                <BrainCircuit className="w-3 h-3 shrink-0" />
                                {line}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  ))}

                  {busy && (
                    <div
                      className="inline-flex rounded-2xl border border-slate-100 bg-slate-50 px-3.5 py-2.5"
                      aria-live="polite"
                      aria-busy="true"
                    >
                      <span key={statusPhrase} className="agent-status-shine text-sm font-medium">
                        {statusPhrase}
                      </span>
                    </div>
                  )}

                  {error && (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700">
                      {error.includes('NVIDIA_API_KEY')
                        ? 'Add NVIDIA_API_KEY to .env.local (see .env.example), then restart the dev server.'
                        : error}
                    </div>
                  )}

                  <div ref={bottomRef} className="h-px w-full shrink-0" aria-hidden />
                </>
              )}
            </div>
          </div>

          {/* Suggestions (when + pressed) */}
          {showSuggestions && !busy && !historyOpen && (
            <div className="px-3 pb-1 flex flex-wrap gap-1.5 shrink-0">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="text-[10px] font-medium px-2.5 py-1.5 rounded-full border border-slate-200 bg-white text-slate-600 hover:border-teal-300 hover:text-teal-700 hover:bg-teal-50 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Composer — Softora pill */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="bg-white px-3 pb-3 pt-1 shrink-0"
          >
            <div className="rounded-full border border-slate-200 bg-white focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/15">
              <div className="flex items-end gap-1 px-1.5 py-1">
                <button
                  type="button"
                  onClick={() => setShowSuggestions((v) => !v)}
                  disabled={busy}
                  className="mb-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-700 transition-colors hover:bg-slate-100 disabled:opacity-50"
                  aria-label="Quick prompts"
                  title="Quick prompts"
                >
                  <Plus size={18} strokeWidth={2.25} />
                </button>
                <textarea
                  ref={inputRef}
                  value={input}
                  rows={1}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      send(input);
                    }
                  }}
                  placeholder="Ask about your CV design…"
                  disabled={busy}
                  className="max-h-[120px] min-h-[24px] flex-1 resize-none overflow-y-auto bg-transparent py-1.5 text-sm leading-6 text-slate-900 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={busy || !input.trim()}
                  className="mb-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white transition-colors hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Send message"
                >
                  <ArrowUp size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>
            <p className="mt-1 px-1 text-center text-[9px] leading-snug text-slate-400/80">
              SoftCV AI can make mistakes. Please verify important details.
            </p>
          </form>
        </div>
      )}

      <button
        type="button"
        data-tour="agent"
        onClick={() => {
          setOpen((v) => !v);
          setHistoryOpen(false);
        }}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 p-3.5 text-sm font-medium text-white shadow-xl transition-colors hover:bg-teal-600 lg:px-5"
        aria-label={open ? 'Close chat' : 'Open SoftCV Agent'}
        title={open ? 'Close chat' : 'Open SoftCV agent'}
      >
        {open ? <X size={20} /> : <MessageCircle size={20} />}
        <span className="hidden lg:inline">{open ? 'Close' : 'SoftCV'}</span>
      </button>
    </div>
  );
};
