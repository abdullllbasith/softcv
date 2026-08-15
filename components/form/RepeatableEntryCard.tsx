import React, { useState } from 'react';
import { ChevronDown, GripVertical, Trash2, Copy } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface RepeatableEntryCardProps {
  id: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onDelete: () => void;
  onDuplicate?: () => void;
  defaultOpen?: boolean;
}

export const RepeatableEntryCard: React.FC<RepeatableEntryCardProps> = ({
  id,
  title,
  subtitle,
  children,
  onDelete,
  onDuplicate,
  defaultOpen = true,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

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
      className={`border rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors ${
        isOpen ? 'border-slate-300' : 'border-slate-200'
      }`}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between px-3 py-2.5 select-none">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-200/60 transition-colors"
            title="Drag to reorder entry"
            type="button"
          >
            <GripVertical className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex-1 text-left font-medium text-slate-800 text-xs truncate"
            type="button"
          >
            <span className="font-semibold text-slate-900">{title || 'Untitled Entry'}</span>
            {subtitle && <span className="text-slate-500 ml-2 font-normal">({subtitle})</span>}
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {onDuplicate && (
            <button
              onClick={onDuplicate}
              className="p-1 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded transition-colors"
              title="Duplicate entry"
              type="button"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          )}

          {showConfirmDelete ? (
            <div className="flex items-center gap-1 bg-red-50 px-2 py-0.5 rounded border border-red-200 text-xs">
              <span className="text-[11px] font-semibold text-red-700">Delete?</span>
              <button
                onClick={onDelete}
                className="text-red-700 font-bold hover:underline"
                type="button"
              >
                Yes
              </button>
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="text-slate-600 hover:underline ml-1"
                type="button"
              >
                No
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirmDelete(true)}
              className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Delete entry"
              type="button"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
            type="button"
          >
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isOpen && <div className="p-3 border-t border-slate-200/80 space-y-3 bg-white">{children}</div>}
    </div>
  );
};
