'use client';

import { useResumeStore } from '@/store/useResumeStore';
import type { AgentAction } from './actions';
import { actionLabel } from './actions';

const PERSONAL_FIELDS = new Set([
  'fullName',
  'title',
  'email',
  'phone',
  'location',
  'website',
  'linkedin',
  'github',
  'photoUrl',
]);

/**
 * Apply validated agent actions to the live Zustand resume store.
 * Returns human-readable changelog lines.
 */
export function applyAgentActions(actions: AgentAction[]): string[] {
  const store = useResumeStore.getState();
  const changelog: string[] = [];

  for (const action of actions) {
    if (action.type === 'advise_only') {
      changelog.push(actionLabel(action));
      continue;
    }

    switch (action.type) {
      case 'set_template':
        store.setTemplateId(action.templateId);
        break;
      case 'set_accent_color':
        store.setAccentColor(action.color);
        break;
      case 'reorder_sections':
        store.reorderSections(action.sectionOrder);
        break;
      case 'set_section_visibility': {
        const current = store.resumeData.sectionVisibility?.[action.sectionKey] !== false;
        if (current !== action.visible) {
          store.toggleSectionVisibility(action.sectionKey);
        }
        break;
      }
      case 'update_summary':
        store.updateSummary(action.summary);
        break;
      case 'update_personal_info':
        for (const [field, value] of Object.entries(action.fields)) {
          if (PERSONAL_FIELDS.has(field)) {
            store.updatePersonalInfo(field, value);
          }
        }
        break;
      case 'update_experience': {
        const { id, ...rest } = action;
        const patch = Object.fromEntries(
          Object.entries(rest).filter(([, v]) => v !== undefined)
        );
        if (Object.keys(patch).length) store.updateExperience(id, patch);
        break;
      }
      case 'update_education': {
        const { id, ...rest } = action;
        const patch = Object.fromEntries(
          Object.entries(rest).filter(([, v]) => v !== undefined)
        );
        if (Object.keys(patch).length) store.updateEducation(id, patch);
        break;
      }
      case 'update_skill_group': {
        const { id, ...rest } = action;
        const patch = Object.fromEntries(
          Object.entries(rest).filter(([, v]) => v !== undefined)
        );
        if (Object.keys(patch).length) store.updateSkillGroup(id, patch);
        break;
      }
      case 'update_project': {
        const { id, ...rest } = action;
        const patch = Object.fromEntries(
          Object.entries(rest).filter(([, v]) => v !== undefined)
        );
        if (Object.keys(patch).length) store.updateProject(id, patch);
        break;
      }
      default:
        break;
    }

    changelog.push(actionLabel(action));
  }

  return changelog;
}
