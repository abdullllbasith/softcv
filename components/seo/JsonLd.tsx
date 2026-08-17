import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, SITE_NAME, SITE_ORG, SITE_URL } from '@/lib/seo';

const graph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://softora.lk/#organization',
      name: SITE_ORG,
      alternateName: 'Softora',
      url: 'https://softora.lk/',
      logo: `${SITE_URL}/site-icon-softora.png`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Dharga Town',
        addressCountry: 'LK',
      },
      sameAs: ['https://softora.lk/'],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: DEFAULT_DESCRIPTION,
      publisher: { '@id': 'https://softora.lk/#organization' },
      inLanguage: 'en',
    },
    {
      '@type': 'SoftwareApplication',
      '@id': `${SITE_URL}/#app`,
      name: SITE_NAME,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      description: DEFAULT_DESCRIPTION,
      url: SITE_URL,
      image: `${SITE_URL}/SoftCV.png`,
      author: { '@id': 'https://softora.lk/#organization' },
      publisher: { '@id': 'https://softora.lk/#organization' },
      featureList: [
        'Live A4 resume preview',
        'ATS-friendly templates',
        'AI writing assistant',
        'Pixel-perfect PDF export',
        'No login required',
      ],
    },
    {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/#webpage`,
      url: SITE_URL,
      name: DEFAULT_TITLE,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      about: { '@id': `${SITE_URL}/#app` },
      description: DEFAULT_DESCRIPTION,
      inLanguage: 'en',
    },
  ],
};

export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
