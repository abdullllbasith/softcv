import type { ChatToolDefinition } from '@/lib/nvidia';
import type { TemplateId } from '@/types/resume';

export const TEMPLATE_IDS: TemplateId[] = [
  'minimal',
  'modern',
  'professional',
  'creative',
  'compact',
  'ats',
];

export const SECTION_KEYS = [
  'personalInfo',
  'summary',
  'experience',
  'education',
  'skills',
  'projects',
  'certifications',
  'languages',
  'awards',
  'customSections',
] as const;

export type SectionKey = (typeof SECTION_KEYS)[number];

/** OpenAI-compatible tool definitions for the CV design agent */
export const AGENT_TOOLS: ChatToolDefinition[] = [
  {
    type: 'function',
    function: {
      name: 'set_template',
      description:
        'Change the resume visual template/layout. Use when the user asks for a theme style like modern, minimal, creative, ATS-friendly, corporate, compact.',
      parameters: {
        type: 'object',
        properties: {
          templateId: {
            type: 'string',
            enum: TEMPLATE_IDS,
            description: 'Template identifier',
          },
        },
        required: ['templateId'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'set_accent_color',
      description:
        'Set the resume accent/theme color as a hex code. Map imaginative requests (ocean, teal, corporate navy, warm sunset, etc.) to a suitable hex.',
      parameters: {
        type: 'object',
        properties: {
          color: {
            type: 'string',
            description: 'Hex color like #0D9488 or #1E3A5F',
          },
          label: {
            type: 'string',
            description: 'Short human label for the color choice',
          },
        },
        required: ['color'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'reorder_sections',
      description: 'Reorder resume content sections. Provide the full new order of section keys.',
      parameters: {
        type: 'object',
        properties: {
          sectionOrder: {
            type: 'array',
            items: { type: 'string', enum: [...SECTION_KEYS] },
            description: 'Complete ordered list of section keys',
          },
        },
        required: ['sectionOrder'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'set_section_visibility',
      description: 'Show or hide a resume section in the preview.',
      parameters: {
        type: 'object',
        properties: {
          sectionKey: { type: 'string', enum: [...SECTION_KEYS] },
          visible: { type: 'boolean' },
        },
        required: ['sectionKey', 'visible'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'update_summary',
      description:
        'Replace the professional summary with improved copy. Prefer ATS-friendly, specific language based on existing resume content. Do not invent fake employers or metrics unless the user asked for fictional sample content.',
      parameters: {
        type: 'object',
        properties: {
          summary: { type: 'string' },
        },
        required: ['summary'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'update_personal_info',
      description: 'Update one or more personal info fields (name, title, contact links, etc.).',
      parameters: {
        type: 'object',
        properties: {
          fields: {
            type: 'object',
            additionalProperties: { type: 'string' },
            description:
              'Partial personalInfo fields: fullName, title, email, phone, location, website, linkedin, github',
          },
        },
        required: ['fields'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'update_experience',
      description:
        'Update an existing work experience entry by id (role, company, dates, bullets). Prefer strengthening bullets with action verbs and impact when rewriting.',
      parameters: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          company: { type: 'string' },
          role: { type: 'string' },
          location: { type: 'string' },
          startDate: { type: 'string' },
          endDate: { type: 'string' },
          bullets: {
            type: 'array',
            items: { type: 'string' },
          },
        },
        required: ['id'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'update_education',
      description: 'Update an education entry by id.',
      parameters: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          institution: { type: 'string' },
          degree: { type: 'string' },
          field: { type: 'string' },
          startDate: { type: 'string' },
          endDate: { type: 'string' },
          gpa: { type: 'string' },
        },
        required: ['id'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'update_skill_group',
      description: 'Update a skill group by id (category name and/or skills list).',
      parameters: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          category: { type: 'string' },
          skills: { type: 'array', items: { type: 'string' } },
        },
        required: ['id'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'update_project',
      description: 'Update a project entry by id.',
      parameters: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string' },
          techStack: { type: 'array', items: { type: 'string' } },
          link: { type: 'string' },
          bullets: { type: 'array', items: { type: 'string' } },
        },
        required: ['id'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'advise_only',
      description:
        'Use when the user only wants advice and no live resume changes. Put the coaching in your final assistant message; this tool records that no mutations were needed.',
      parameters: {
        type: 'object',
        properties: {
          topic: {
            type: 'string',
            description: 'Short topic tag, e.g. ats, brevity, impact_bullets',
          },
        },
        required: [],
      },
    },
  },
];

export const AGENT_SYSTEM_PROMPT = `You are SoftCV Agent — an expert CV designer and professional resume coach inside SoftCV, Softora's live resume builder.

Your job:
1. Understand the user's intent (visual theme, template, layout, or writing quality).
2. Use TOOLS to apply live changes to their resume whenever they want design or copy updates.
3. Give concise, professional CV writing advice in your final reply (what you changed and why, plus 1–3 tips).

Rules:
- Always prefer tools for mutations (template, accent color, summary, bullets, section order/visibility, etc.).
- Map creative theme language to concrete template + hex accent (e.g. "ocean teal" → creative/modern + #0D9488; "corporate navy" → professional + #1E3A5F; "ATS plain" → ats template).
- Do NOT invent fake employers, degrees, or metrics unless the user explicitly asks for sample/demo content.
- Prefer ATS-friendly clarity: strong verbs, quantified impact when data exists, no fluff.
- When only advice is requested, call advise_only and put coaching in the final message.
- Keep the final assistant message short, helpful, and specific to their resume snapshot.
- You may call multiple tools in one turn when needed.`;
