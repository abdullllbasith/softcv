import { TemplateId } from '@/types/resume';

export const RESUME_TEMPLATES: {
  id: TemplateId;
  name: string;
  desc: string;
  blurb: string;
}[] = [
  {
    id: 'modern',
    name: 'Modern',
    desc: 'Two-column sidebar',
    blurb: 'Accent sidebar with skills and contact — strong visual presence.',
  },
  {
    id: 'professional',
    name: 'Professional',
    desc: 'Classic corporate',
    blurb: 'Serif headings and clean hierarchy for traditional applications.',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    desc: 'Clean single column',
    blurb: 'Quiet typography and whitespace — easy to scan and edit.',
  },
  {
    id: 'ats',
    name: 'ATS-Friendly',
    desc: 'Parser-safe layout',
    blurb: 'Plain structure that travels cleanly through applicant tracking systems.',
  },
  {
    id: 'compact',
    name: 'Compact',
    desc: 'Dense one-pager',
    blurb: 'Tight spacing when you need more content on a single page.',
  },
  {
    id: 'creative',
    name: 'Creative',
    desc: 'Bold banner',
    blurb: 'Banner header and accent marks for design-forward roles.',
  },
];
