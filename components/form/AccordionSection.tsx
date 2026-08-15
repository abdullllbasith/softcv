import React from 'react';
import { ChevronDown, GripVertical, Eye, EyeOff } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useResumeStore } from '@/store/useResumeStore';

interface AccordionSectionProps {
  id: string;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  badgeCount?: number;
  defaultOpen?: boolean;
}

export const AccordionSection: React.FC<AccordionSectionProps> = ({
  id,
  title,
  icon,
  children,
  badgeCount,
}) => {
  const { resumeData, toggleSectionVisibility, openSections, toggleSectionOpen } = useResumeStore();

  const isOpen = openSections[id] ?? false;
  const isVisible = resumeData.sectionVisibility?.[id] !== false;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      id={`section-accordion-${id}`}
      className={`border rounded-xl bg-white shadow-xs overflow-hidden transition-colors ${
        isOpen ? 'border-teal-300 shadow-sm ring-1 ring-teal-100' : 'border-slate-200 hover:border-slate-300'
      } ${!isVisible ? 'bg-slate-50/70 opacity-75' : ''}`}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 select-none gap-1">
        {/* Left Drag Handle & Title */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors touch-target shrink-0"
            title="Drag to reorder section"
            type="button"
          >
            <GripVertical className="w-4 h-4" />
          </button>

          {icon && <span className="text-teal-600 shrink-0">{icon}</span>}

          <button
            onClick={() => toggleSectionOpen(id)}
            className="flex items-center gap-2 flex-1 text-left font-semibold text-slate-800 text-sm hover:text-slate-900 truncate min-h-[44px] sm:min-h-0"
            type="button"
          >
            <span className="truncate">{title}</span>
            {badgeCount !== undefined && badgeCount > 0 && (
              <span className="bg-teal-50 text-teal-700 text-xs px-2 py-0.5 rounded-full font-medium shrink-0">
                {badgeCount}
              </span>
            )}
          </button>
        </div>

        {/* Right Actions: Visibility Toggle & Expand Chevron */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => toggleSectionVisibility(id)}
            className={`p-1.5 rounded-lg transition-colors ${
              isVisible
                ? 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                : 'text-amber-600 bg-amber-50 hover:bg-amber-100'
            }`}
            title={isVisible ? 'Hide from preview' : 'Show in preview'}
            type="button"
          >
            {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>

          <button
            onClick={() => toggleSectionOpen(id)}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            type="button"
          >
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Expandable Section Content */}
      {isOpen && (
        <div className="px-4 pb-4 pt-1 border-t border-slate-100 space-y-4">
          {!isVisible && (
            <div className="p-2 rounded-md bg-amber-50 text-amber-800 text-xs font-medium flex items-center justify-between">
              <span>This section is currently hidden from the live preview canvas.</span>
              <button
                onClick={() => toggleSectionVisibility(id)}
                className="underline font-bold"
              >
                Unhide
              </button>
            </div>
          )}
          {children}
        </div>
      )}
    </div>
  );
};
