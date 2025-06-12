// components/SEO.js

import Head from 'next/head';

export default function SEO({ seo }) {
  if (!seo) return null;

  return (
    <Head>
      <title>{seo.title}</title>
      <meta name="description" content={seo.metaDesc} />
      <link rel="canonical" href={seo.canonical} />
      <meta name="robots" content="index, follow" />

      {/* Open Graph */}
      <meta property="og:title" content={seo.opengraphTitle} />
      <meta property="og:description" content={seo.opengraphDescription} />
      <meta property="og:url" content={seo.opengraphUrl} />
      <meta property="og:site_name" content={seo.opengraphSiteName} />
      {seo.opengraphImage?.sourceUrl && (
        <meta property="og:image" content={seo.opengraphImage.sourceUrl} />
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.twitterTitle} />
      <meta name="twitter:description" content={seo.twitterDescription} />
      {seo.twitterImage?.sourceUrl && (
        <meta name="twitter:image" content={seo.twitterImage.sourceUrl} />
      )}
    </Head>
  );
}
