import React from 'react';
import { ZoomIn, ZoomOut, Maximize2, Eye, EyeOff, Hand } from 'lucide-react';
import { useResumeStore } from '@/store/useResumeStore';

const ZOOM_MIN = 40;
const ZOOM_MAX = 200;
const ZOOM_STEP = 5;

interface ZoomControlsProps {
  isHandTool?: boolean;
  onToggleHandTool?: () => void;
  fitScale?: number;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onZoomReset?: () => void;
  onZoomFit?: () => void;
}

export const ZoomControls: React.FC<ZoomControlsProps> = ({
  isHandTool = false,
  onToggleHandTool,
  fitScale = 1,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onZoomFit,
}) => {
  const { zoomLevel, setIsPrintPreview, isPrintPreview } = useResumeStore();

  const displayPercent =
    zoomLevel === 'fit' ? Math.round(fitScale * 100) : Math.round(zoomLevel as number);

  return (
    <div
      className="absolute z-40 flex items-center bg-white/95 backdrop-blur-md border border-slate-200 shadow-xl rounded-full px-2 sm:px-3 py-1.5 gap-0.5 sm:gap-1 text-slate-700 text-xs no-print
        bottom-[4.75rem] left-1/2 -translate-x-1/2 max-w-[calc(100%-1rem)]
        lg:bottom-6"
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {onToggleHandTool && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleHandTool();
            }}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-full transition-colors touch-target ${
              isHandTool
                ? 'bg-teal-600 text-white shadow-sm'
                : 'hover:bg-slate-100 text-slate-600'
            }`}
            title={isHandTool ? 'Exit hand tool (or press Esc)' : 'Hand tool — drag to pan'}
            aria-pressed={isHandTool}
          >
            <Hand className="w-4 h-4" />
            {isHandTool && <span className="font-semibold pr-0.5 hidden sm:inline">On</span>}
          </button>
          <div className="h-4 w-px bg-slate-200 mx-0.5 sm:mx-1 shrink-0" />
        </>
      )}

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onZoomOut?.();
        }}
        disabled={displayPercent <= ZOOM_MIN && zoomLevel !== 'fit'}
        className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-600 disabled:opacity-40 disabled:pointer-events-none touch-target"
        title="Zoom Out"
      >
        <ZoomOut className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onZoomReset?.();
        }}
        className="min-w-[2.75rem] sm:min-w-[3.25rem] px-1.5 sm:px-2 py-1.5 rounded-md font-semibold tabular-nums bg-teal-50 text-teal-600 hover:bg-teal-100 transition-colors touch-target"
        title="Reset to 100%"
      >
        {displayPercent}%
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onZoomIn?.();
        }}
        disabled={displayPercent >= ZOOM_MAX}
        className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-600 disabled:opacity-40 disabled:pointer-events-none touch-target"
        title="Zoom In"
      >
        <ZoomIn className="w-4 h-4" />
      </button>

      <div className="h-4 w-px bg-slate-200 mx-0.5 sm:mx-1 shrink-0" />

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onZoomFit?.();
        }}
        className={`p-2 rounded-full hover:bg-slate-100 transition-colors touch-target ${zoomLevel === 'fit' ? 'bg-teal-50 text-teal-600' : 'text-slate-600'}`}
        title="Fit to Width"
      >
        <Maximize2 className="w-4 h-4" />
      </button>

      <div className="h-4 w-px bg-slate-200 mx-0.5 sm:mx-1 shrink-0 hidden sm:block" />

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsPrintPreview(!isPrintPreview);
        }}
        className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-full font-medium transition-all touch-target ${
          isPrintPreview
            ? 'bg-slate-900 text-white shadow-sm'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
        }`}
        title="Toggle Print View Chrome"
      >
        {isPrintPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
        <span className="hidden sm:inline">{isPrintPreview ? 'Exit' : 'Print'}</span>
      </button>
    </div>
  );
};

export { ZOOM_MIN, ZOOM_MAX, ZOOM_STEP };
