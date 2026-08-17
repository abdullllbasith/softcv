import type { MetadataRoute } from 'next';
import { DEFAULT_DESCRIPTION, SITE_NAME } from '@/lib/seo';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — Live Resume Builder by Softora`,
    short_name: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    start_url: '/',
    display: 'standalone',
    background_color: '#f7f8fa',
    theme_color: '#0d9488',
    icons: [
      {
        src: '/softora-favicon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/softora-favicon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
