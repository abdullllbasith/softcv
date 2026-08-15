import React, { useRef, useEffect, useLayoutEffect, useState, useCallback } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { ResumeData } from '@/types/resume';
import { MinimalTemplate } from './templates/MinimalTemplate';
import { ModernTemplate } from './templates/ModernTemplate';
import { ProfessionalTemplate } from './templates/ProfessionalTemplate';
import { CreativeTemplate } from './templates/CreativeTemplate';
import { CompactTemplate } from './templates/CompactTemplate';
import { AtsTemplate } from './templates/AtsTemplate';
import { ZoomControls, ZOOM_MIN, ZOOM_MAX, ZOOM_STEP } from './ZoomControls';
import {
  A4_WIDTH_PX,
  DOC_WIDTH_PX,
  PAGE_GAP_PX,
  PAGE_MARGIN_PX,
  a4HeightPx,
  contentPageHeightPx,
} from '@/lib/pageLayout';
import { applyPageBreakGuards, clearPageGuards } from '@/lib/pageBreaks';

const PAD = 24;

/** Stable module-level component — NEVER define inside PreviewCanvas (remount = flicker). */
const ResumeDocument = React.memo(function ResumeDocument({
  data,
  focusedFieldId,
}: {
  data: ResumeData;
  focusedFieldId: string | null;
}) {
  switch (data.templateId) {
    case 'minimal':
      return <MinimalTemplate data={data} focusedFieldId={focusedFieldId} />;
    case 'modern':
      return <ModernTemplate data={data} focusedFieldId={focusedFieldId} />;
    case 'professional':
      return <ProfessionalTemplate data={data} focusedFieldId={focusedFieldId} />;
    case 'creative':
      return <CreativeTemplate data={data} focusedFieldId={focusedFieldId} />;
    case 'compact':
      return <CompactTemplate data={data} focusedFieldId={focusedFieldId} />;
    case 'ats':
      return <AtsTemplate data={data} focusedFieldId={focusedFieldId} />;
    default:
      return <ModernTemplate data={data} focusedFieldId={focusedFieldId} />;
  }
});

type ZoomFocus = {
  contentX: number;
  contentY: number;
  viewX: number;
  viewY: number;
};

export const PreviewCanvas: React.FC = () => {
  const resumeData = useResumeStore((s) => s.resumeData);
  const focusedFieldId = useResumeStore((s) => s.focusedFieldId);
  const zoomLevel = useResumeStore((s) => s.zoomLevel);
  const setZoomLevel = useResumeStore((s) => s.setZoomLevel);
  const isPrintPreview = useResumeStore((s) => s.isPrintPreview);
  const shellRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const [fitScale, setFitScale] = useState<number>(0.9);
  const [pageCount, setPageCount] = useState<number>(1);
  const [pageHeightPx, setPageHeightPx] = useState<number>(() => a4HeightPx());
  const [contentHeightPx, setContentHeightPx] = useState<number>(() => a4HeightPx());
  const contentPageH = contentPageHeightPx(pageHeightPx);
  const [isHandTool, setIsHandTool] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const spaceHeldRef = useRef(false);
  const panStartRef = useRef<{ x: number; y: number; scrollLeft: number; scrollTop: number } | null>(null);
  const lastPointerRef = useRef<{ x: number; y: number } | null>(null);
  const pendingFocusRef = useRef<ZoomFocus | null>(null);
  const scaleRef = useRef(1);
  const pinchActiveRef = useRef(false);

  useEffect(() => {
    const handleResize = () => {
      if (shellRef.current) {
        const containerWidth = shellRef.current.clientWidth - PAD * 2;
        if (containerWidth > 0) {
          setFitScale(Math.min(1.1, Math.max(0.35, containerWidth / A4_WIDTH_PX)));
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Measure once per content change — no ResizeObserver (guards mutate height and would loop).
  useLayoutEffect(() => {
    const el = paperRef.current;
    if (!el) return;

    let cancelled = false;
    let frame = 0;

    const measure = () => {
      if (cancelled) return;
      const sheetH = a4HeightPx(A4_WIDTH_PX);
      const pageContentH = contentPageHeightPx(sheetH);

      applyPageBreakGuards(el, pageContentH);

      const height = Math.max(el.scrollHeight, pageContentH);
      const exactPages = height / pageContentH;
      const nextCount = Math.max(1, Math.ceil(exactPages - 0.02));

      setPageHeightPx((prev) => (Math.abs(prev - sheetH) < 0.5 ? prev : sheetH));
      setContentHeightPx((prev) => (Math.abs(prev - height) < 2 ? prev : height));
      setPageCount((prev) => {
        if (nextCount === prev) return prev;
        if (nextCount > prev && exactPages < prev + 0.97) return prev;
        if (nextCount < prev && exactPages > nextCount + 0.03) return prev;
        return nextCount;
      });
    };

    measure();

    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };

    // Fonts / images can change height after first paint — remasure once, not via RO.
    const fontsReady = document.fonts?.ready?.then(schedule);
    const imgs = Array.from(el.querySelectorAll('img'));
    imgs.forEach((img) => {
      if (!img.complete) img.addEventListener('load', schedule);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      imgs.forEach((img) => img.removeEventListener('load', schedule));
      void fontsReady;
      clearPageGuards(el);
    };
  }, [resumeData]);

  // Re-apply guards on visible page clones (layout only — never setState here)
  useLayoutEffect(() => {
    const pageContentH = contentPageHeightPx(pageHeightPx);
    if (pageContentH <= 0) return;

    stageRef.current?.querySelectorAll<HTMLElement>('[data-resume-doc]').forEach((pageEl) => {
      applyPageBreakGuards(pageEl, pageContentH);
    });
  }, [resumeData, pageCount, contentHeightPx, pageHeightPx]);

  const scale = zoomLevel === 'fit' ? fitScale : (zoomLevel as number) / 100;
  scaleRef.current = scale;

  // Stacked pages + gaps between sheets
  const stackHeightPx =
    pageCount * pageHeightPx + Math.max(0, pageCount - 1) * PAGE_GAP_PX;
  const scaledHeight = stackHeightPx * scale;
  const scaledWidth = A4_WIDTH_PX * scale;

  const resolvePercent = useCallback(
    (level: number | 'fit') => (level === 'fit' ? Math.round(fitScale * 100) : level),
    [fitScale]
  );

  const currentPercent = resolvePercent(zoomLevel);

  const zoomTo = useCallback(
    (nextLevel: number | 'fit', clientX?: number, clientY?: number) => {
      const viewport = viewportRef.current;
      const stage = stageRef.current;
      const nextPercent =
        nextLevel === 'fit'
          ? Math.round(fitScale * 100)
          : Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, nextLevel));

      if (viewport && stage) {
        const rect = viewport.getBoundingClientRect();
        const viewX =
          clientX != null
            ? clientX - rect.left
            : lastPointerRef.current
              ? lastPointerRef.current.x - rect.left
              : rect.width / 2;
        const viewY =
          clientY != null
            ? clientY - rect.top
            : lastPointerRef.current
              ? lastPointerRef.current.y - rect.top
              : rect.height / 2;

        const oldScale = scaleRef.current;
        const originX = stage.offsetLeft + PAD;
        const originY = stage.offsetTop + PAD;
        const docX = viewport.scrollLeft + viewX;
        const docY = viewport.scrollTop + viewY;

        pendingFocusRef.current = {
          contentX: (docX - originX) / oldScale,
          contentY: (docY - originY) / oldScale,
          viewX,
          viewY,
        };
      }

      if (nextLevel === 'fit') {
        setZoomLevel('fit');
      } else {
        setZoomLevel(nextPercent);
      }
    },
    [fitScale, setZoomLevel]
  );

  const bumpZoom = useCallback(
    (direction: 1 | -1, clientX?: number, clientY?: number) => {
      const next = Math.min(
        ZOOM_MAX,
        Math.max(ZOOM_MIN, Math.round((currentPercent + direction * ZOOM_STEP) / ZOOM_STEP) * ZOOM_STEP)
      );
      zoomTo(next, clientX, clientY);
    },
    [currentPercent, zoomTo]
  );

  useLayoutEffect(() => {
    const focus = pendingFocusRef.current;
    const viewport = viewportRef.current;
    const stage = stageRef.current;
    if (!focus || !viewport || !stage) return;

    pendingFocusRef.current = null;
    const newScale = scaleRef.current;
    const originX = stage.offsetLeft + PAD;
    const originY = stage.offsetTop + PAD;
    viewport.scrollLeft = focus.contentX * newScale + originX - focus.viewX;
    viewport.scrollTop = focus.contentY * newScale + originY - focus.viewY;
  }, [zoomLevel, scale]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        bumpZoom(e.deltaY < 0 ? 1 : -1, e.clientX, e.clientY);
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [bumpZoom]);

  // Pinch-to-zoom for phones / tablets (two fingers, no browser interference)
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    type PinchState = {
      startDist: number;
      startPercent: number;
      lastPercent: number;
    };

    let pinch: PinchState | null = null;
    let raf = 0;
    let pendingMid: { x: number; y: number } | null = null;

    const distance = (a: Touch, b: Touch) =>
      Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);

    const midpoint = (a: Touch, b: Touch) => ({
      x: (a.clientX + b.clientX) / 2,
      y: (a.clientY + b.clientY) / 2,
    });

    const clearPinch = () => {
      pinch = null;
      pinchActiveRef.current = false;
      cancelAnimationFrame(raf);
      raf = 0;
      pendingMid = null;
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length < 2) return;
      const dist = distance(e.touches[0], e.touches[1]);
      if (dist < 10) return;

      // Cancel any one-finger pan so pinch isn't interrupted
      panStartRef.current = null;
      setIsPanning(false);
      pinchActiveRef.current = true;

      const startPercent = Math.round(scaleRef.current * 100);
      pinch = { startDist: dist, startPercent, lastPercent: startPercent };
      e.preventDefault();
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!pinch || e.touches.length < 2) return;
      e.preventDefault();

      const dist = distance(e.touches[0], e.touches[1]);
      if (dist < 10 || pinch.startDist < 10) return;

      const next = Math.min(
        ZOOM_MAX,
        Math.max(ZOOM_MIN, Math.round(pinch.startPercent * (dist / pinch.startDist)))
      );
      pendingMid = midpoint(e.touches[0], e.touches[1]);
      if (next === pinch.lastPercent) return;
      pinch.lastPercent = next;

      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const mid = pendingMid;
        if (!mid) return;
        zoomTo(next, mid.x, mid.y);
      });
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) clearPinch();
    };

    el.addEventListener('touchstart', onTouchStart, { passive: false });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd);
    el.addEventListener('touchcancel', onTouchEnd);

    return () => {
      clearPinch();
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [zoomTo]);

  const trackPointer = (clientX: number, clientY: number) => {
    lastPointerRef.current = { x: clientX, y: clientY };
  };

  const startPan = (clientX: number, clientY: number) => {
    const el = viewportRef.current;
    if (!el) return;
    panStartRef.current = {
      x: clientX,
      y: clientY,
      scrollLeft: el.scrollLeft,
      scrollTop: el.scrollTop,
    };
    setIsPanning(true);
  };

  const movePan = (clientX: number, clientY: number) => {
    const el = viewportRef.current;
    const start = panStartRef.current;
    if (!el || !start) return;
    el.scrollLeft = start.scrollLeft - (clientX - start.x);
    el.scrollTop = start.scrollTop - (clientY - start.y);
  };

  const endPan = () => {
    panStartRef.current = null;
    setIsPanning(false);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    trackPointer(e.clientX, e.clientY);
    if (pinchActiveRef.current) return;
    const shouldPan = isHandTool || e.button === 1 || spaceHeldRef.current;
    if (!shouldPan || e.button === 2) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    startPan(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    trackPointer(e.clientX, e.clientY);
    if (pinchActiveRef.current) return;
    if (!isPanning) return;
    e.preventDefault();
    movePan(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    trackPointer(e.clientX, e.clientY);
    if (!isPanning) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
    endPan();
  };

  useEffect(() => {
    const isEditable = (target: EventTarget | null) =>
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      (target instanceof HTMLElement && target.isContentEditable);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape' && isHandTool) {
        setIsHandTool(false);
        endPan();
        return;
      }
      if (e.code !== 'Space' || e.repeat || isEditable(e.target)) return;
      e.preventDefault();
      spaceHeldRef.current = true;
      if (viewportRef.current && !isHandTool) {
        viewportRef.current.style.cursor = 'grab';
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code !== 'Space') return;
      spaceHeldRef.current = false;
      if (viewportRef.current && !isHandTool) {
        viewportRef.current.style.cursor = '';
      }
      endPan();
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [isHandTool]);

  const cursorClass = isHandTool
    ? isPanning
      ? 'cursor-grabbing'
      : 'cursor-grab'
    : isPanning
      ? 'cursor-grabbing'
      : '';

  const stageWidth = scaledWidth + PAD * 2;
  const stageHeight = scaledHeight + PAD * 2;

  return (
    <div
      ref={shellRef}
      className={`relative w-full h-full min-h-0 overflow-hidden flex flex-col ${
        isPrintPreview ? 'bg-slate-300' : 'bg-slate-100/90'
      }`}
    >
      <div className="no-print shrink-0 z-20 flex justify-center px-2 sm:px-4 pt-2 sm:pt-4 pb-1.5 sm:pb-2 pointer-events-none">
        <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 bg-white/95 backdrop-blur border border-slate-200 shadow-xs px-2.5 sm:px-3.5 py-1 rounded-full text-[11px] sm:text-xs text-slate-600 font-medium max-w-[calc(100%-0.5rem)]">
          <span>
            A4 Pages: <strong className="text-slate-900">{pageCount}</strong>
          </span>
          {pageCount > 1 && (
            <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-semibold">
              Auto-paginated
            </span>
          )}
          <span className="text-[10px] sm:text-[11px] text-slate-400 border-l border-slate-200 pl-2 ml-0.5 hidden sm:inline">
            {isHandTool
              ? 'Drag to pan · tap Hand again to edit'
              : 'Long content adds new A4 pages automatically'}
          </span>
        </div>
      </div>

      {/* Off-screen content document — PDF export + height measurement */}
      <div
        className="pointer-events-none"
        style={{
          position: 'fixed',
          left: -10000,
          top: 0,
          width: DOC_WIDTH_PX,
          opacity: 1,
          zIndex: -1,
        }}
        aria-hidden
      >
        <div
          ref={paperRef}
          id="resume-preview-canvas"
          data-resume-doc
          className="a4-page"
          style={{
            width: DOC_WIDTH_PX,
            minHeight: contentPageH,
            // @ts-ignore
            '--accent-color': resumeData.accentColor,
            boxShadow: 'none',
            margin: 0,
          }}
        >
          <ResumeDocument data={resumeData} focusedFieldId={focusedFieldId} />
        </div>
      </div>

      <div
        ref={viewportRef}
        className={`pane-scroll flex-1 min-h-0 overflow-y-auto overflow-x-auto overscroll-contain touch-[pan-x_pan-y] ${
          isPanning || isHandTool ? 'pane-scroll--instant' : ''
        } ${cursorClass}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerEnter={(e) => trackPointer(e.clientX, e.clientY)}
        onAuxClick={(e) => {
          if (e.button === 1) e.preventDefault();
        }}
      >
        <div
          className="flex justify-center items-start pb-28"
          style={{
            width: `max(100%, ${stageWidth}px)`,
            minHeight: '100%',
            height: `max(100%, ${stageHeight + 112}px)`,
            userSelect: isPanning || isHandTool ? 'none' : undefined,
          }}
        >
          <div
            ref={stageRef}
            className="relative shrink-0"
            style={{
              width: stageWidth,
              height: stageHeight,
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: PAD,
                top: PAD,
                width: A4_WIDTH_PX,
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                pointerEvents: isHandTool ? 'none' : undefined,
              }}
            >
              {/* Stacked A4 sheets with inset content frame (margins on every page) */}
              <div className="flex flex-col" style={{ gap: PAGE_GAP_PX }}>
                {Array.from({ length: pageCount }).map((_, pageIndex) => (
                  <div
                    key={pageIndex}
                    className="relative bg-white shadow-paper rounded-sm overflow-hidden"
                    style={{
                      width: A4_WIDTH_PX,
                      height: pageHeightPx,
                    }}
                  >
                    <div
                      className="absolute overflow-hidden bg-white"
                      style={{
                        left: PAGE_MARGIN_PX,
                        top: PAGE_MARGIN_PX,
                        width: DOC_WIDTH_PX,
                        height: contentPageH,
                      }}
                    >
                      <div
                        style={{
                          transform: `translateY(-${pageIndex * contentPageH}px)`,
                          width: DOC_WIDTH_PX,
                          // @ts-ignore
                          '--accent-color': resumeData.accentColor,
                        }}
                      >
                        <div
                          data-resume-doc
                          className="a4-page"
                          style={{
                            width: DOC_WIDTH_PX,
                            minHeight: Math.max(contentHeightPx, contentPageH),
                            margin: 0,
                            boxShadow: 'none',
                          }}
                        >
                          <ResumeDocument data={resumeData} focusedFieldId={focusedFieldId} />
                        </div>
                      </div>
                    </div>

                    <div className="no-print absolute bottom-2 right-3 z-10 text-[10px] font-semibold text-slate-400 bg-white/90 px-1.5 py-0.5 rounded pointer-events-none shadow-sm">
                      Page {pageIndex + 1} / {pageCount}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ZoomControls
        isHandTool={isHandTool}
        onToggleHandTool={() => {
          setIsHandTool((v) => !v);
          endPan();
        }}
        fitScale={fitScale}
        onZoomIn={() => bumpZoom(1)}
        onZoomOut={() => bumpZoom(-1)}
        onZoomReset={() => zoomTo(100)}
        onZoomFit={() => zoomTo('fit')}
      />
    </div>
  );
};
