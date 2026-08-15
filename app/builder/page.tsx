'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { SplitPane } from '@/components/layout/SplitPane';
import { AtsScoreModal } from '@/components/form/AtsScoreModal';
import { AgentChatPanel } from '@/components/agent/AgentChatPanel';
import { GuidedTour, hasCompletedGuidedTour } from '@/components/onboarding/GuidedTour';
import { TemplatePicker } from '@/components/onboarding/TemplatePicker';
import { useResumeStore } from '@/store/useResumeStore';
import { TemplateId } from '@/types/resume';

function BuilderWorkspace() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isAtsModalOpen, setIsAtsModalOpen] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  const [pickingTemplate, setPickingTemplate] = useState(false);
  const hydrateFromStorage = useResumeStore((s) => s.hydrateFromStorage);
  const setTemplateId = useResumeStore((s) => s.setTemplateId);

  useEffect(() => {
    hydrateFromStorage();
  }, [hydrateFromStorage]);

  useEffect(() => {
    const shouldPick =
      searchParams.get('chooseTemplate') === '1' ||
      searchParams.get('chooseTemplate') === 'true';
    if (shouldPick) setPickingTemplate(true);
  }, [searchParams]);

  useEffect(() => {
    if (pickingTemplate) return;
    if (hasCompletedGuidedTour()) return;
    const timer = window.setTimeout(() => setTourOpen(true), 700);
    return () => window.clearTimeout(timer);
  }, [pickingTemplate]);

  const handleTemplateSelect = (id: TemplateId) => {
    setTemplateId(id);
    setPickingTemplate(false);
    router.replace('/builder', { scroll: false });
  };

  return (
    <div className="flex flex-col h-[100dvh] max-h-[100dvh] overflow-hidden bg-surface">
      {!pickingTemplate && (
        <>
          <Navbar onOpenAtsModal={() => setIsAtsModalOpen(true)} />

          <main className="flex-1 min-h-0 overflow-hidden flex flex-col">
            <SplitPane />
          </main>

          <AtsScoreModal isOpen={isAtsModalOpen} onClose={() => setIsAtsModalOpen(false)} />
          <AgentChatPanel />
          <GuidedTour open={tourOpen} onClose={() => setTourOpen(false)} />
        </>
      )}

      <TemplatePicker open={pickingTemplate} onSelect={handleTemplateSelect} />
    </div>
  );
}

export default function ResumeBuilderPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[100dvh] items-center justify-center bg-surface text-sm text-slate-500">
          Loading SoftCV…
        </div>
      }
    >
      <BuilderWorkspace />
    </Suspense>
  );
}
