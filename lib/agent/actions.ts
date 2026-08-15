import { SECTION_KEYS, TEMPLATE_IDS, type SectionKey } from './tools';
import type { TemplateId } from '@/types/resume';

export type AgentAction =
  | { type: 'set_template'; templateId: TemplateId }
  | { type: 'set_accent_color'; color: string; label?: string }
  | { type: 'reorder_sections'; sectionOrder: string[] }
  | { type: 'set_section_visibility'; sectionKey: SectionKey; visible: boolean }
  | { type: 'update_summary'; summary: string }
  | { type: 'update_personal_info'; fields: Record<string, string> }
  | {
      type: 'update_experience';
      id: string;
      company?: string;
      role?: string;
      location?: string;
      startDate?: string;
      endDate?: string;
      bullets?: string[];
    }
  | {
      type: 'update_education';
      id: string;
      institution?: string;
      degree?: string;
      field?: string;
      startDate?: string;
      endDate?: string;
      gpa?: string;
    }
  | {
      type: 'update_skill_group';
      id: string;
      category?: string;
      skills?: string[];
    }
  | {
      type: 'update_project';
      id: string;
      name?: string;
      description?: string;
      techStack?: string[];
      link?: string;
      bullets?: string[];
    }
  | { type: 'advise_only'; topic?: string };

const HEX_RE = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

export function normalizeHex(color: string): string | null {
  const raw = color.trim();
  if (!HEX_RE.test(raw)) {
    // try without # or expand
    const withHash = raw.startsWith('#') ? raw : `#${raw}`;
    if (HEX_RE.test(withHash)) {
      if (withHash.length === 4) {
        const r = withHash[1];
        const g = withHash[2];
        const b = withHash[3];
        return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
      }
      return withHash.toUpperCase();
    }
    return null;
  }
  if (raw.length === 4) {
    const r = raw[1];
    const g = raw[2];
    const b = raw[3];
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
  }
  return raw.toUpperCase();
}

function isTemplateId(v: unknown): v is TemplateId {
  return typeof v === 'string' && (TEMPLATE_IDS as string[]).includes(v);
}

function isSectionKey(v: unknown): v is SectionKey {
  return typeof v === 'string' && (SECTION_KEYS as readonly string[]).includes(v);
}

/** Convert a tool name + parsed args into a validated AgentAction (or null). */
export function toolCallToAction(name: string, args: Record<string, unknown>): AgentAction | null {
  switch (name) {
    case 'set_template': {
      if (!isTemplateId(args.templateId)) return null;
      return { type: 'set_template', templateId: args.templateId };
    }
    case 'set_accent_color': {
      if (typeof args.color !== 'string') return null;
      const color = normalizeHex(args.color);
      if (!color) return null;
      return {
        type: 'set_accent_color',
        color,
        label: typeof args.label === 'string' ? args.label : undefined,
      };
    }
    case 'reorder_sections': {
      if (!Array.isArray(args.sectionOrder)) return null;
      const sectionOrder = args.sectionOrder.filter((k) => isSectionKey(k)) as string[];
      if (sectionOrder.length === 0) return null;
      return { type: 'reorder_sections', sectionOrder };
    }
    case 'set_section_visibility': {
      if (!isSectionKey(args.sectionKey) || typeof args.visible !== 'boolean') return null;
      return {
        type: 'set_section_visibility',
        sectionKey: args.sectionKey,
        visible: args.visible,
      };
    }
    case 'update_summary': {
      if (typeof args.summary !== 'string') return null;
      return { type: 'update_summary', summary: args.summary };
    }
    case 'update_personal_info': {
      if (!args.fields || typeof args.fields !== 'object') return null;
      const fields: Record<string, string> = {};
      for (const [k, v] of Object.entries(args.fields as Record<string, unknown>)) {
        if (typeof v === 'string') fields[k] = v;
      }
      if (Object.keys(fields).length === 0) return null;
      return { type: 'update_personal_info', fields };
    }
    case 'update_experience': {
      if (typeof args.id !== 'string') return null;
      return {
        type: 'update_experience',
        id: args.id,
        company: typeof args.company === 'string' ? args.company : undefined,
        role: typeof args.role === 'string' ? args.role : undefined,
        location: typeof args.location === 'string' ? args.location : undefined,
        startDate: typeof args.startDate === 'string' ? args.startDate : undefined,
        endDate: typeof args.endDate === 'string' ? args.endDate : undefined,
        bullets: Array.isArray(args.bullets)
          ? args.bullets.filter((b): b is string => typeof b === 'string')
          : undefined,
      };
    }
    case 'update_education': {
      if (typeof args.id !== 'string') return null;
      return {
        type: 'update_education',
        id: args.id,
        institution: typeof args.institution === 'string' ? args.institution : undefined,
        degree: typeof args.degree === 'string' ? args.degree : undefined,
        field: typeof args.field === 'string' ? args.field : undefined,
        startDate: typeof args.startDate === 'string' ? args.startDate : undefined,
        endDate: typeof args.endDate === 'string' ? args.endDate : undefined,
        gpa: typeof args.gpa === 'string' ? args.gpa : undefined,
      };
    }
    case 'update_skill_group': {
      if (typeof args.id !== 'string') return null;
      return {
        type: 'update_skill_group',
        id: args.id,
        category: typeof args.category === 'string' ? args.category : undefined,
        skills: Array.isArray(args.skills)
          ? args.skills.filter((s): s is string => typeof s === 'string')
          : undefined,
      };
    }
    case 'update_project': {
      if (typeof args.id !== 'string') return null;
      return {
        type: 'update_project',
        id: args.id,
        name: typeof args.name === 'string' ? args.name : undefined,
        description: typeof args.description === 'string' ? args.description : undefined,
        techStack: Array.isArray(args.techStack)
          ? args.techStack.filter((s): s is string => typeof s === 'string')
          : undefined,
        link: typeof args.link === 'string' ? args.link : undefined,
        bullets: Array.isArray(args.bullets)
          ? args.bullets.filter((b): b is string => typeof b === 'string')
          : undefined,
      };
    }
    case 'advise_only': {
      return {
        type: 'advise_only',
        topic: typeof args.topic === 'string' ? args.topic : undefined,
      };
    }
    default:
      return null;
  }
}

export function parseToolArguments(raw: string): Record<string, unknown> {
  try {
    const parsed = JSON.parse(raw || '{}');
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    /* ignore */
  }
  return {};
}

export function actionLabel(action: AgentAction): string {
  switch (action.type) {
    case 'set_template':
      return `Template → ${action.templateId}`;
    case 'set_accent_color':
      return `Accent → ${action.label || action.color}`;
    case 'reorder_sections':
      return 'Reordered sections';
    case 'set_section_visibility':
      return `${action.visible ? 'Show' : 'Hide'} ${action.sectionKey}`;
    case 'update_summary':
      return 'Updated summary';
    case 'update_personal_info':
      return `Updated profile (${Object.keys(action.fields).join(', ')})`;
    case 'update_experience':
      return 'Updated experience';
    case 'update_education':
      return 'Updated education';
    case 'update_skill_group':
      return 'Updated skills';
    case 'update_project':
      return 'Updated project';
    case 'advise_only':
      return action.topic ? `Advice: ${action.topic}` : 'Advice only';
    default:
      return 'Change applied';
  }
}
