import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { AccordionSection } from '@/components/form/AccordionSection';
import { PersonalInfoForm } from '@/components/form/PersonalInfoForm';
import { SummaryForm } from '@/components/form/SummaryForm';
import { ExperienceForm } from '@/components/form/ExperienceForm';
import { EducationForm } from '@/components/form/EducationForm';
import { SkillsForm } from '@/components/form/SkillsForm';
import { ProjectsForm } from '@/components/form/ProjectsForm';
import { CertificationsForm } from '@/components/form/CertificationsForm';
import { LanguagesForm } from '@/components/form/LanguagesForm';
import { AwardsForm } from '@/components/form/AwardsForm';
import { CustomSectionForm } from '@/components/form/CustomSectionForm';
import { PreviewCanvas } from '@/components/preview/PreviewCanvas';
import {
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderGit2,
  Award,
  Globe,
  Trophy,
  Layers,
  PanelLeftClose,
  PanelRightClose,
  PanelLeftOpen,
  PanelRightOpen,
  GripVertical,
  Pencil,
  Eye,
} from 'lucide-react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

const MIN_LEFT_PCT = 22;
const MAX_LEFT_PCT = 70;
const DEFAULT_LEFT_PCT = 45;

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return isDesktop;
}

export const SplitPane: React.FC = () => {
  const { resumeData, reorderSections, activeTab, setActiveTab } = useResumeStore();
  const { sectionOrder } = resumeData;
  const isDesktop = useIsDesktop();

  const [leftPct, setLeftPct] = useState(DEFAULT_LEFT_PCT);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleDragSectionEnd = (event: any) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const oldIndex = sectionOrder.indexOf(active.id);
      const newIndex = sectionOrder.indexOf(over.id);
      const updatedOrder = [...sectionOrder];
      const [moved] = updatedOrder.splice(oldIndex, 1);
      updatedOrder.splice(newIndex, 0, moved);
      reorderSections(updatedOrder);
    }
  };

  const getSectionTitle = (key: string) => {
    switch (key) {
      case 'personalInfo': return 'Personal Information';
      case 'summary': return 'Professional Summary';
      case 'experience': return 'Work Experience';
      case 'education': return 'Education';
      case 'skills': return 'Skills & Technical Expertise';
      case 'projects': return 'Projects';
      case 'certifications': return 'Certifications & Licenses';
      case 'languages': return 'Languages';
      case 'awards': return 'Honors & Awards';
      case 'customSections': return 'Custom Sections';
      default: return key;
    }
  };

  const getSectionIcon = (key: string) => {
    switch (key) {
      case 'personalInfo': return <User className="w-4 h-4" />;
      case 'summary': return <FileText className="w-4 h-4" />;
      case 'experience': return <Briefcase className="w-4 h-4" />;
      case 'education': return <GraduationCap className="w-4 h-4" />;
      case 'skills': return <Wrench className="w-4 h-4" />;
      case 'projects': return <FolderGit2 className="w-4 h-4" />;
      case 'certifications': return <Award className="w-4 h-4" />;
      case 'languages': return <Globe className="w-4 h-4" />;
      case 'awards': return <Trophy className="w-4 h-4" />;
      case 'customSections': return <Layers className="w-4 h-4" />;
      default: return null;
    }
  };

  const getSectionForm = (key: string) => {
    switch (key) {
      case 'personalInfo': return <PersonalInfoForm />;
      case 'summary': return <SummaryForm />;
      case 'experience': return <ExperienceForm />;
      case 'education': return <EducationForm />;
      case 'skills': return <SkillsForm />;
      case 'projects': return <ProjectsForm />;
      case 'certifications': return <CertificationsForm />;
      case 'languages': return <LanguagesForm />;
      case 'awards': return <AwardsForm />;
      case 'customSections': return <CustomSectionForm />;
      default: return null;
    }
  };

  const getBadgeCount = (key: string) => {
    switch (key) {
      case 'experience': return resumeData.experience?.length || 0;
      case 'education': return resumeData.education?.length || 0;
      case 'skills': return resumeData.skills?.length || 0;
      case 'projects': return resumeData.projects?.length || 0;
      case 'certifications': return resumeData.certifications?.length || 0;
      case 'languages': return resumeData.languages?.length || 0;
      case 'awards': return resumeData.awards?.length || 0;
      case 'customSections': return resumeData.customSections?.length || 0;
      default: return undefined;
    }
  };

  const onResizeMove = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setLeftPct(Math.min(MAX_LEFT_PCT, Math.max(MIN_LEFT_PCT, pct)));
  }, []);

  useEffect(() => {
    if (!isResizing) return;

    const onMove = (e: MouseEvent | PointerEvent) => {
      e.preventDefault();
      onResizeMove(e.clientX);
    };
    const onUp = () => setIsResizing(false);

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [isResizing, onResizeMove]);

  // Reset collapse when switching to mobile
  useEffect(() => {
    if (!isDesktop) {
      setLeftCollapsed(false);
      setRightCollapsed(false);
    }
  }, [isDesktop]);

  const collapseLeft = () => {
    setLeftCollapsed(true);
    setRightCollapsed(false);
  };

  const collapseRight = () => {
    setRightCollapsed(true);
    setLeftCollapsed(false);
  };

  const expandLeft = () => setLeftCollapsed(false);
  const expandRight = () => setRightCollapsed(false);

  const showLeft = !leftCollapsed;
  const showRight = !rightCollapsed;
  const bothVisible = showLeft && showRight;

  // Mobile/tablet: one pane at a time via activeTab. Desktop: split/collapse.
  const showEditorPane = isDesktop ? showLeft : activeTab === 'edit';
  const showPreviewPane = isDesktop ? showRight : activeTab === 'preview';

  return (
    <div
      ref={containerRef}
      className={`w-full h-full min-h-0 flex flex-col lg:flex-row overflow-hidden relative ${
        isResizing ? 'select-none' : ''
      }`}
    >
      {/* LEFT: Editor */}
      <div
        data-tour="editor"
        className={`pane-scroll min-h-0 overflow-y-auto overscroll-contain p-3 sm:p-5 lg:p-6 pb-24 lg:pb-10 space-y-3 sm:space-y-4 bg-gradient-premium ${
          showEditorPane ? 'flex flex-col flex-1' : 'hidden'
        }`}
        style={
          isDesktop && bothVisible
            ? { width: `${leftPct}%`, flex: 'none', flexShrink: 0 }
            : showEditorPane
              ? { flex: '1 1 100%', width: '100%' }
              : undefined
        }
      >
        <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-200 shrink-0">
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-slate-900">Resume Content Editor</h2>
            <p className="text-[11px] sm:text-xs text-slate-500 hidden sm:block">
              Drag handles to reorder sections. Changes update live.
            </p>
            <p className="text-[11px] text-slate-500 sm:hidden">Tap a section to edit · updates live</p>
          </div>
          <button
            type="button"
            onClick={collapseLeft}
            className="hidden lg:inline-flex shrink-0 items-center gap-1 px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 text-[11px] font-semibold transition-colors"
            title="Collapse editor panel"
          >
            <PanelLeftClose className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Collapse</span>
          </button>
        </div>

        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragSectionEnd}>
          <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
            <div className="space-y-2.5 sm:space-y-3">
              {sectionOrder.map((key, index) => (
                <AccordionSection
                  key={key}
                  id={key}
                  title={getSectionTitle(key)}
                  icon={getSectionIcon(key)}
                  badgeCount={getBadgeCount(key)}
                  defaultOpen={index === 0 || index === 1}
                >
                  {getSectionForm(key)}
                </AccordionSection>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* Desktop divider */}
      <div
        className={`hidden lg:flex relative shrink-0 flex-col items-center justify-center z-20 ${
          bothVisible ? 'w-3' : 'w-10'
        }`}
      >
        {bothVisible && (
          <>
            <div
              role="separator"
              aria-orientation="vertical"
              aria-valuenow={Math.round(leftPct)}
              aria-label="Resize editor and preview"
              onPointerDown={(e) => {
                e.preventDefault();
                (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
                setIsResizing(true);
              }}
              className={`absolute inset-y-0 -left-1 -right-1 cursor-col-resize group flex items-center justify-center ${
                isResizing ? 'bg-teal-100/80' : 'hover:bg-teal-50/80'
              }`}
              title="Drag to resize panels"
            >
              <div
                className={`w-px h-full transition-colors ${
                  isResizing ? 'bg-teal-400' : 'bg-slate-200 group-hover:bg-teal-300'
                }`}
              />
              <div
                className={`absolute top-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5 px-0.5 py-2 rounded-full border bg-white shadow-sm transition-colors ${
                  isResizing
                    ? 'border-teal-400 text-teal-600'
                    : 'border-slate-200 text-slate-400 group-hover:border-teal-300 group-hover:text-teal-500'
                }`}
              >
                <GripVertical className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="absolute top-1/2 -translate-y-1/2 mt-16 flex flex-col gap-1 z-30">
              <button
                type="button"
                onClick={collapseLeft}
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-teal-600 hover:border-teal-200 shadow-sm transition-colors"
                title="Collapse editor"
              >
                <PanelLeftClose className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={collapseRight}
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-teal-600 hover:border-teal-200 shadow-sm transition-colors"
                title="Collapse preview"
              >
                <PanelRightClose className="w-3.5 h-3.5" />
              </button>
            </div>
          </>
        )}

        {leftCollapsed && (
          <div className="h-full w-full flex flex-col items-center justify-center gap-3 bg-slate-100 border-r border-slate-200">
            <button
              type="button"
              onClick={expandLeft}
              className="flex flex-col items-center gap-2 px-1.5 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 shadow-sm transition-colors"
              title="Show editor"
            >
              <PanelLeftOpen className="w-4 h-4" />
              <span
                className="text-[10px] font-bold tracking-wide"
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              >
                Editor
              </span>
            </button>
          </div>
        )}

        {rightCollapsed && (
          <div className="h-full w-full flex flex-col items-center justify-center gap-3 bg-slate-100 border-l border-slate-200">
            <button
              type="button"
              onClick={expandRight}
              className="flex flex-col items-center gap-2 px-1.5 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 shadow-sm transition-colors"
              title="Show preview"
            >
              <PanelRightOpen className="w-4 h-4" />
              <span className="text-[10px] font-bold tracking-wide" style={{ writingMode: 'vertical-rl' }}>
                Preview
              </span>
            </button>
          </div>
        )}
      </div>

      {/* RIGHT: Preview */}
      <div
        data-tour="preview"
        className={`min-h-0 relative overflow-hidden ${
          showPreviewPane ? 'flex flex-col flex-1' : 'hidden'
        }`}
        style={
          isDesktop && bothVisible
            ? { flex: '1 1 0%', minWidth: 0 }
            : showPreviewPane
              ? { flex: '1 1 100%', width: '100%' }
              : undefined
        }
      >
        <div className="flex-1 min-h-0 pb-16 lg:pb-0">
          <PreviewCanvas />
        </div>
      </div>

      {rightCollapsed && showLeft && isDesktop && (
        <button
          type="button"
          onClick={expandRight}
          className="hidden lg:flex absolute top-3 right-3 z-30 items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-[11px] font-semibold shadow-sm hover:bg-teal-50 hover:text-teal-700"
          title="Show preview"
        >
          <PanelRightOpen className="w-3.5 h-3.5" />
          Preview
        </button>
      )}

      {/* Mobile / tablet bottom nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur-md shadow-[0_-4px_20px_rgba(15,23,42,0.06)] safe-bottom no-print">
        <div className="grid grid-cols-2 max-w-lg mx-auto">
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`flex flex-col items-center justify-center gap-0.5 py-2.5 touch-target transition-colors ${
              activeTab === 'edit' ? 'text-teal-600' : 'text-slate-500'
            }`}
          >
            <div
              className={`p-1.5 rounded-xl ${
                activeTab === 'edit' ? 'bg-teal-50' : ''
              }`}
            >
              <Pencil className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold">Edit</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex flex-col items-center justify-center gap-0.5 py-2.5 touch-target transition-colors ${
              activeTab === 'preview' ? 'text-teal-600' : 'text-slate-500'
            }`}
          >
            <div
              className={`p-1.5 rounded-xl ${
                activeTab === 'preview' ? 'bg-teal-50' : ''
              }`}
            >
              <Eye className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold">Preview</span>
          </button>
        </div>
      </nav>
    </div>
  );
};
