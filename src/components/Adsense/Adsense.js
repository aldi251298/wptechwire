// src/components/Adsense/Adsense.js

import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Adsense({
  client,
  slot,
  style,
  format = 'auto',
  responsive = 'true',
}) {
  const router = useRouter();

  useEffect(() => {
    // Jalankan skrip AdSense setiap kali path URL berubah
    // Ini akan me-refresh iklan saat navigasi antar halaman
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, [router.asPath]); // Kunci utamanya ada di sini: efek hanya berjalan saat URL berubah

  return (
    <ins
      className="adsbygoogle"
      style={style}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive}
    ></ins>
  );
}