import { ResumeData, ResumeProfile } from '@/types/resume';

export const ACCENT_COLOR_PRESETS = [
  { name: 'Softora', value: '#0D9488' },
  { name: 'Ink', value: '#0F172A' },
  { name: 'Emerald', value: '#10B981' },
  { name: 'Sky Blue', value: '#0284C7' },
  { name: 'Rose', value: '#F43F5E' },
  { name: 'Violet', value: '#7C3AED' },
  { name: 'Amber', value: '#D97706' },
  { name: 'Slate', value: '#475569' },
];

export const DEFAULT_SECTION_ORDER = [
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
];

export const DEFAULT_BLANK_RESUME: ResumeData = {
  templateId: 'modern',
  accentColor: '#0D9488',
  personalInfo: {
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    photoUrl: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  awards: [],
  customSections: [],
  sectionOrder: [...DEFAULT_SECTION_ORDER],
  sectionVisibility: {
    personalInfo: true,
    summary: true,
    experience: true,
    education: true,
    skills: true,
    projects: true,
    certifications: true,
    languages: true,
    awards: true,
    customSections: true,
  },
};

export const SAMPLE_RESUME_DATA: ResumeData = {
  templateId: 'modern',
  accentColor: '#0D9488',
  personalInfo: {
    fullName: 'Alex Morgan',
    title: 'Senior Full Stack Software Engineer',
    email: 'alex.morgan@example.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    website: 'https://alexmorgan.dev',
    linkedin: 'linkedin.com/in/alexmorgan-dev',
    github: 'github.com/alexmorgan',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  },
  summary: 'Results-driven Senior Full Stack Engineer with 7+ years of experience architecting high-scalability web applications and microservices. Proven track record of improving site performance by 40% and leading cross-functional teams to ship enterprise SaaS products.',
  experience: [
    {
      id: 'exp-1',
      company: 'TechCorp Solutions',
      role: 'Senior Full Stack Engineer',
      location: 'San Francisco, CA',
      startDate: '2022-03',
      endDate: 'Present',
      isCurrent: true,
      bullets: [
        'Architected real-time analytics dashboard serving 2M+ active daily users using Next.js 14, Node.js, and Redis, reducing latency by 45%.',
        'Spearheaded migration of legacy monolith to serverless microservices architecture, decreasing server operational costs by $120k annually.',
        'Mentored 6 junior/mid-level engineers through code reviews, pairing sessions, and quarterly technical workshops.',
      ],
    },
    {
      id: 'exp-2',
      company: 'CloudScale Systems',
      role: 'Full Stack Software Engineer',
      location: 'Austin, TX',
      startDate: '2019-06',
      endDate: '2022-02',
      isCurrent: false,
      bullets: [
        'Designed and implemented RESTful & GraphQL APIs integrated with PostgreSQL and ElasticSearch for fast multi-tenant query retrieval.',
        'Developed responsive UI components using React, Tailwind CSS, and TypeScript, achieving 99.8% crash-free session rate.',
        'Built automated CI/CD deployment pipelines using GitHub Actions, Docker, and AWS ECS.',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      startDate: '2015-08',
      endDate: '2019-05',
      gpa: '3.85 / 4.0',
    },
  ],
  skills: [
    {
      id: 'skill-1',
      category: 'Languages & Frameworks',
      skills: ['TypeScript', 'JavaScript (ES6+)', 'React.js', 'Next.js', 'Node.js', 'Python', 'Go', 'HTML5/CSS3'],
      displayStyle: 'tags',
    },
    {
      id: 'skill-2',
      category: 'Cloud & DevOps',
      skills: ['AWS (Lambda, S3, ECS)', 'Docker', 'Kubernetes', 'CI/CD Pipelines', 'Git', 'PostgreSQL', 'Redis'],
      displayStyle: 'tags',
    },
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'FlowSpace - Collaborative Whiteboard App',
      description: 'Real-time collaborative canvas with web sockets and CRDT data synchronization.',
      techStack: ['React', 'WebSockets', 'Canvas API', 'Node.js', 'Tailwind CSS'],
      link: 'https://github.com/alexmorgan/flowspace',
      bullets: [
        'Supported 100+ concurrent multi-user cursor updates with zero lag.',
        'Starred by 1,400+ developers on GitHub and featured in Weekly Web Dev Digest.',
      ],
    },
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Certified Solutions Architect – Associate',
      issuer: 'Amazon Web Services',
      date: '2023-04',
      credentialUrl: 'https://aws.amazon.com/verification',
    },
  ],
  languages: [
    { id: 'lang-1', language: 'English', proficiency: 'Native' },
    { id: 'lang-2', language: 'Spanish', proficiency: 'Conversational' },
  ],
  awards: [
    {
      id: 'award-1',
      title: 'Engineering Excellence Award',
      issuer: 'TechCorp Solutions',
      date: '2023-12',
      description: 'Awarded for outstanding contribution to core SaaS platform scalability.',
    },
  ],
  customSections: [
    {
      id: 'custom-1',
      title: 'Publications & Speaking',
      content: 'Keynote Speaker at React Summit 2023: "Optimizing Next.js App Router for Scale". Published article on dev.to with over 45,000 views.',
    },
  ],
  sectionOrder: [...DEFAULT_SECTION_ORDER],
  sectionVisibility: {
    personalInfo: true,
    summary: true,
    experience: true,
    education: true,
    skills: true,
    projects: true,
    certifications: true,
    languages: true,
    awards: true,
    customSections: true,
  },
};

export const INITIAL_PROFILES: ResumeProfile[] = [
  {
    id: 'profile-sample',
    name: 'Software Engineer Resume',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    data: SAMPLE_RESUME_DATA,
  },
];
