// app/components/SeoJsonLd.tsx  <-- Client Component
'use client';

import { SoftwareAppJsonLd } from 'next-seo';

export function SeoJsonLd() {
  return (
    <SoftwareAppJsonLd
      name="Iara"
      operatingSystem="Web"
      applicationCategory="BusinessApplication"
      url="https://iara.one"
      price="0.00"
      priceCurrency="USD"
      aggregateRating={{ ratingValue: '4.8', ratingCount: '137' }}
    />
  );
}
