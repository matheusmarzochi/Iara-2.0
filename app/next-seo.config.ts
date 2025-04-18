// next-seo.config.ts
import type { DefaultSeoProps } from 'next-seo';

const baseUrl = 'https://iara.one';

const SEO: DefaultSeoProps = {
  /* ───────── Metadados básicos ───────── */
  defaultTitle: 'Iara • Fit for Purpose (F4P) para UX Research',
  titleTemplate: '%s | Iara',
  description:
    'Iara aplica o método Fit for Purpose (F4P) para revelar o que realmente motiva seus usuários, ajudando a construir produtos alinhados a necessidades reais.',
  canonical: baseUrl,

  /* ───────── Open Graph ───────── */
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: baseUrl,
    site_name: 'Iara',
    title: 'Iara • Plataforma F4P para entender o propósito do usuário',
    description:
      'Colete feedback com o F4P Card, analise via Fitness Box Score e segmente usuários por propósito — tudo em um único dashboard.',
    images: [
      {
        url: `${baseUrl}/og/iara-f4p-dashboard.png`,
        width: 1200,
        height: 630,
        alt: 'Dashboard da Iara exibindo Fitness Box Score',
      },
    ],
  },

  /* ───────── Twitter Cards ───────── */
  twitter: {
    cardType: 'summary_large_image',
    site: '@IaraOne',
    handle: '@IaraOne',
  },

  /* ───────── Tags extras ───────── */
  additionalMetaTags: [
    {
      name: 'keywords',
      content:
        'Iara,Fit for Purpose,F4P,UX Research,Product Discovery,Product‑Market Fit,Customer Experience,segmentação por propósito,SaaS',
    },
    { httpEquiv: 'x-ua-compatible', content: 'IE=edge; chrome=1' },
  ],

  additionalLinkTags: [
    { rel: 'alternate', hrefLang: 'en', href: `${baseUrl}/en` },
    { rel: 'alternate', hrefLang: 'pt-BR', href: `${baseUrl}/` },
    { rel: 'alternate', hrefLang: 'x-default', href: `${baseUrl}/` },
    { rel: 'icon', href: '/favicon.ico' },
    { rel: 'manifest', href: '/site.webmanifest' },
  ],
};

export default SEO;
