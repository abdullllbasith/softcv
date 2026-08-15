import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useResumeStore } from '@/store/useResumeStore';
import { ACCENT_COLOR_PRESETS } from '@/lib/initialData';
import { exportToPdf } from '@/lib/pdfExport';
import { SampleDataLoader } from './SampleDataLoader';
import {
  Palette,
  Layout,
  Undo2,
  Redo2,
  Download,
  Upload,
  Check,
  Plus,
  Trash2,
  Edit2,
  ChevronDown,
  Award,
  Layers,
  FileCode,
  Menu,
  X,
} from 'lucide-react';
import { TemplateId } from '@/types/resume';
import { RESUME_TEMPLATES } from '@/lib/templates';

interface NavbarProps {
  onOpenAtsModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAtsModal }) => {
  const {
    resumeData,
    setTemplateId,
    setAccentColor,
    undo,
    redo,
    canUndo,
    canRedo,
    profiles,
    activeProfileId,
    switchProfile,
    createProfile,
    renameProfile,
    deleteProfile,
    importJson,
  } = useResumeStore();

  const [isExporting, setIsExporting] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [profileNameInput, setProfileNameInput] = useState('');
  const [autosaveText, setAutosaveText] = useState('Saved');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const templateMenuRef = useRef<HTMLDivElement>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAutosaveText('Saving...');
    const timer = setTimeout(() => setAutosaveText('Saved'), 600);
    return () => clearTimeout(timer);
  }, [resumeData]);

  useEffect(() => {
    const anyOpen = showColorPicker || showTemplateMenu || showProfileMenu;
    if (!anyOpen) return;

    const handlePointerDown = (e: MouseEvent | PointerEvent) => {
      const target = e.target as Node;
      if (showProfileMenu && profileMenuRef.current && !profileMenuRef.current.contains(target)) {
        setShowProfileMenu(false);
        setEditingProfileId(null);
      }
      if (showTemplateMenu && templateMenuRef.current && !templateMenuRef.current.contains(target)) {
        setShowTemplateMenu(false);
      }
      if (showColorPicker && colorPickerRef.current && !colorPickerRef.current.contains(target)) {
        setShowColorPicker(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setShowProfileMenu(false);
      setShowTemplateMenu(false);
      setShowColorPicker(false);
      setShowMobileMenu(false);
      setEditingProfileId(null);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showColorPicker, showTemplateMenu, showProfileMenu]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        if (!e.shiftKey && canUndo()) {
          e.preventDefault();
          undo();
        } else if (e.shiftKey && canRedo()) {
          e.preventDefault();
          redo();
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y' && canRedo()) {
        e.preventDefault();
        redo();
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        handleExportPdf();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canUndo, canRedo, undo, redo, resumeData]);

  useEffect(() => {
    if (!showMobileMenu) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showMobileMenu]);

  const handleExportPdf = async () => {
    setIsExporting(true);
    try {
      const name = resumeData.personalInfo.fullName
        ? `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`
        : 'Resume.pdf';
      await exportToPdf(name);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(resumeData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resumeData.personalInfo.fullName || 'resume'}-data.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJsonFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          importJson(parsed);
        } catch {
          alert('Invalid JSON file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0];

  const templatesList = RESUME_TEMPLATES;

  const closeMobileMenu = () => setShowMobileMenu(false);

  return (
    <>
      <header className="h-14 sm:h-16 bg-white border-b border-slate-200 px-3 sm:px-6 flex items-center justify-between gap-2 z-40 sticky top-0 shadow-xs no-print select-none safe-top">
        {/* Left: Brand + Profile */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <Link
            href="/"
            className="hidden sm:flex items-center shrink-0 min-w-0 group"
            title="SoftCV home"
          >
            <img
              src="/SoftCV.png"
              alt="SoftCV"
              className="h-5 w-auto object-contain transition-opacity group-hover:opacity-90"
            />
          </Link>

          <div className="h-5 w-px bg-slate-200 hidden sm:block" />

          <div className="relative min-w-0" ref={profileMenuRef}>
            <button
              onClick={() => {
                setShowProfileMenu((v) => !v);
                setShowTemplateMenu(false);
                setShowColorPicker(false);
              }}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold transition-colors max-w-[120px] sm:max-w-[160px] truncate touch-target"
              title="Switch resume profile"
            >
              <Layers className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="truncate">{activeProfile?.name || 'My Resume'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 hidden sm:block" />
            </button>

            {showProfileMenu && (
              <div className="absolute top-full mt-2 left-0 w-[min(18rem,calc(100vw-1.5rem))] bg-white border border-slate-200 shadow-xl rounded-xl p-2 z-50 text-xs space-y-1">
                <div className="px-2 py-1 font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                  Resume Versions
                </div>
                {profiles.map((p) => (
                  <div
                    key={p.id}
                    className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer ${
                      p.id === activeProfileId ? 'bg-teal-50 text-teal-700 font-semibold' : 'hover:bg-slate-50'
                    }`}
                    onClick={() => {
                      switchProfile(p.id);
                      setShowProfileMenu(false);
                    }}
                  >
                    {editingProfileId === p.id ? (
                      <input
                        type="text"
                        autoFocus
                        value={profileNameInput}
                        onChange={(e) => setProfileNameInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            renameProfile(p.id, profileNameInput);
                            setEditingProfileId(null);
                          }
                        }}
                        onBlur={() => {
                          renameProfile(p.id, profileNameInput);
                          setEditingProfileId(null);
                        }}
                        className="px-1.5 py-0.5 border rounded outline-none w-full text-xs"
                      />
                    ) : (
                      <span className="truncate flex-1">{p.name}</span>
                    )}

                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => {
                          setEditingProfileId(p.id);
                          setProfileNameInput(p.name);
                        }}
                        className="p-2 text-slate-400 hover:text-slate-700 touch-target"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {profiles.length > 1 && (
                        <button onClick={() => deleteProfile(p.id)} className="p-2 text-slate-400 hover:text-red-600 touch-target">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                <div className="border-t pt-1">
                  <button
                    onClick={() => {
                      createProfile(`Resume ${profiles.length + 1}`);
                      setShowProfileMenu(false);
                    }}
                    className="w-full py-2.5 px-2 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 font-medium flex items-center gap-1.5 touch-target"
                  >
                    <Plus className="w-3.5 h-3.5" /> Create New Resume Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Desktop middle controls */}
        <div className="hidden lg:flex items-center gap-3" data-tour="template">
          <div className="relative" ref={templateMenuRef}>
            <button
              onClick={() => {
                setShowTemplateMenu((v) => !v);
                setShowProfileMenu(false);
                setShowColorPicker(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium"
            >
              <Layout className="w-4 h-4 text-teal-600" />
              <span className="font-semibold text-slate-900 capitalize">{resumeData.templateId} Template</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showTemplateMenu && (
              <div className="absolute top-full mt-2 left-0 w-56 bg-white border border-slate-200 shadow-xl rounded-xl p-2 z-50 space-y-1">
                {templatesList.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => {
                      setTemplateId(tmpl.id);
                      setShowTemplateMenu(false);
                    }}
                    className={`w-full text-left p-2 rounded-lg transition-colors flex flex-col ${
                      resumeData.templateId === tmpl.id ? 'bg-teal-50 border border-teal-200' : 'hover:bg-slate-50'
                    }`}
                  >
                    <span className="font-bold text-slate-900 text-xs">{tmpl.name}</span>
                    <span className="text-[11px] text-slate-500">{tmpl.desc}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative" ref={colorPickerRef}>
            <button
              onClick={() => {
                setShowColorPicker((v) => !v);
                setShowProfileMenu(false);
                setShowTemplateMenu(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium"
              title="Change template accent theme color"
            >
              <div className="w-4 h-4 rounded-full border border-slate-300 shadow-xs" style={{ backgroundColor: resumeData.accentColor }} />
              <Palette className="w-3.5 h-3.5 text-slate-500" />
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showColorPicker && (
              <div className="absolute top-full mt-2 left-0 w-64 bg-white border border-slate-200 shadow-xl rounded-xl p-3 z-50 text-xs space-y-2">
                <p className="font-semibold text-slate-800">Accent Color Swatch</p>
                <div className="grid grid-cols-4 gap-2">
                  {ACCENT_COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.value}
                      onClick={() => {
                        setAccentColor(preset.value);
                        setShowColorPicker(false);
                      }}
                      className={`w-10 h-10 rounded-full border-2 transition-transform flex items-center justify-center ${
                        resumeData.accentColor === preset.value ? 'border-slate-900 scale-110' : 'border-transparent hover:scale-105'
                      }`}
                      style={{ backgroundColor: preset.value }}
                      title={preset.name}
                    >
                      {resumeData.accentColor === preset.value && <Check className="w-4 h-4 text-white" />}
                    </button>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-slate-600 font-medium">Custom Hex:</span>
                  <input
                    type="color"
                    value={resumeData.accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-7 h-7 rounded border cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-0.5 border border-slate-200 rounded-lg p-0.5 bg-slate-50">
            <button
              onClick={undo}
              disabled={!canUndo()}
              className="p-1.5 rounded hover:bg-slate-200/60 disabled:opacity-30 transition-colors text-slate-700"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo()}
              className="p-1.5 rounded hover:bg-slate-200/60 disabled:opacity-30 transition-colors text-slate-700"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>

          <SampleDataLoader />

          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium px-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{autosaveText}</span>
          </div>
        </div>

        {/* Right: mobile undo/redo + menu + export */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="flex items-center gap-1.5 lg:hidden">
            <button
              type="button"
              onClick={undo}
              disabled={!canUndo()}
              className="flex h-[42px] w-[42px] items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition-colors hover:bg-slate-100 disabled:opacity-30"
              title="Undo"
              aria-label="Undo"
            >
              <Undo2 className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={redo}
              disabled={!canRedo()}
              className="flex h-[42px] w-[42px] items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition-colors hover:bg-slate-100 disabled:opacity-30"
              title="Redo"
              aria-label="Redo"
            >
              <Redo2 className="h-5 w-5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowMobileMenu(true)}
            className="lg:hidden flex h-[42px] w-[42px] items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
            title="More tools"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={onOpenAtsModal}
            className="hidden md:flex lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold transition-colors"
          >
            <Award className="w-4 h-4 text-amber-600" />
            <span className="hidden xl:inline">ATS Score</span>
          </button>

          <div className="hidden md:flex items-center gap-1">
            <button
              onClick={handleExportJson}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              title="Export Resume JSON"
            >
              <FileCode className="w-4 h-4" />
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              title="Import Resume JSON"
            >
              <Upload className="w-4 h-4" />
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImportJsonFile}
          />

          <button
            data-tour="export"
            onClick={handleExportPdf}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-2.5 sm:px-4 py-2 rounded-xl bg-slate-900 hover:bg-teal-600 text-white font-semibold text-xs shadow-sm transition-colors disabled:opacity-50 touch-target"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">{isExporting ? 'Generating…' : 'Export PDF'}</span>
            <span className="sm:hidden">{isExporting ? '…' : 'PDF'}</span>
          </button>
        </div>
      </header>

      {/* Mobile / tablet tools bottom sheet */}
      {showMobileMenu && (
        <div className="lg:hidden fixed inset-0 z-[60] no-print">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            aria-label="Close menu"
            onClick={closeMobileMenu}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto bg-white rounded-t-2xl shadow-2xl safe-bottom animate-sheet-up">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between z-10">
              <div>
                <p className="text-sm font-bold text-slate-900">Tools & Settings</p>
                <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {autosaveText}
                </p>
              </div>
              <button
                type="button"
                onClick={closeMobileMenu}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 touch-target"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-5 pb-8">
              {/* Template */}
              <section className="space-y-2">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Template</h3>
                <div className="grid grid-cols-2 gap-2">
                  {templatesList.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => {
                        setTemplateId(tmpl.id);
                      }}
                      className={`text-left p-3 rounded-xl border transition-colors touch-target ${
                        resumeData.templateId === tmpl.id
                          ? 'bg-teal-50 border-teal-300 ring-1 ring-teal-200'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span className="font-bold text-slate-900 text-xs block">{tmpl.name}</span>
                      <span className="text-[10px] text-slate-500">{tmpl.desc}</span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Color */}
              <section className="space-y-2">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Accent Color</h3>
                <div className="flex flex-wrap gap-2.5 items-center">
                  {ACCENT_COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => setAccentColor(preset.value)}
                      className={`w-11 h-11 rounded-full border-2 flex items-center justify-center touch-target ${
                        resumeData.accentColor === preset.value ? 'border-slate-900 scale-105' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: preset.value }}
                      title={preset.name}
                    >
                      {resumeData.accentColor === preset.value && <Check className="w-4 h-4 text-white" />}
                    </button>
                  ))}
                  <label className="w-11 h-11 rounded-full border-2 border-dashed border-slate-300 overflow-hidden touch-target relative">
                    <input
                      type="color"
                      value={resumeData.accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <span className="absolute inset-0" style={{ backgroundColor: resumeData.accentColor }} />
                  </label>
                </div>
              </section>

              {/* Actions */}
              <section className="space-y-2">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Actions</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={undo}
                    disabled={!canUndo()}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-xs text-slate-700 disabled:opacity-40 touch-target"
                  >
                    <Undo2 className="w-4 h-4" /> Undo
                  </button>
                  <button
                    type="button"
                    onClick={redo}
                    disabled={!canRedo()}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-xs text-slate-700 disabled:opacity-40 touch-target"
                  >
                    <Redo2 className="w-4 h-4" /> Redo
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onOpenAtsModal();
                      closeMobileMenu();
                    }}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl border border-amber-200 bg-amber-50 font-semibold text-xs text-amber-800 touch-target"
                  >
                    <Award className="w-4 h-4" /> ATS Score
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleExportJson();
                      closeMobileMenu();
                    }}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 bg-white font-semibold text-xs text-slate-700 touch-target"
                  >
                    <FileCode className="w-4 h-4" /> Export JSON
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 bg-white font-semibold text-xs text-slate-700 touch-target"
                  >
                    <Upload className="w-4 h-4" /> Import JSON
                  </button>
                  <div className="col-span-2 [&_button]:w-full [&_button]:justify-center [&_button]:py-3">
                    <SampleDataLoader />
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
