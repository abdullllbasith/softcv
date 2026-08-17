import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resume Builder',
  description:
    'Open the SoftCV workspace: pick a template, edit live with A4 pagination, use AI polish, and export a pixel-perfect PDF. Free, no account required.',
  alternates: {
    canonical: '/builder',
  },
  openGraph: {
    title: 'SoftCV Resume Builder — Live Preview & PDF Export',
    description:
      'Build your resume in SoftCV with live A4 preview, ATS-aware templates, and one-click PDF export.',
    url: '/builder',
  },
  twitter: {
    title: 'SoftCV Resume Builder — Live Preview & PDF Export',
    description:
      'Build your resume in SoftCV with live A4 preview, ATS-aware templates, and one-click PDF export.',
  },
};

export default function BuilderLayout({ children }: { children: React.ReactNode }) {
  return children;
}
