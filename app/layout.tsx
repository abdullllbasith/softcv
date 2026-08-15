import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SoftCV — Live Resume Builder by Softora',
  description:
    'SoftCV by Softora: build portfolio-grade resumes with live split-screen preview, templates, accent colors, drag & drop sections, and pixel-perfect PDF export.',
  icons: {
    icon: '/softora-favicon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0d9488',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-surface text-ink min-h-full antialiased font-sans">{children}</body>
    </html>
  );
}
