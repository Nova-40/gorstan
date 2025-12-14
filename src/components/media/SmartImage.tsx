import React from 'react';
import manifest from '../../../public/images/_optimized.json';

type Props = {
  src: string; // relative path under /images
  alt?: string;
  className?: string;
  sizes?: string;
};

export default function SmartImage({ src, alt = '', className, sizes = '100vw' }: Props) {
  const typedManifest: Record<string, any> = manifest as any;
  const key = src.replace(/^\//, '').replace(/^images\//, '');
  const info = typedManifest[key];

  if (!info) {
    // Fallback to plain img
    return <img src={src} alt={alt} className={className} />;
  }

  const sources = (info.variants || []).map((v: any) => ({ width: v.width || null, webp: `/${v.webp}`, avif: `/${v.avif}` }));
  // Build srcset strings
  const avifSrcSet = sources.map((s: any) => `${s.avif} ${s.width}w`).join(', ');
  const webpSrcSet = sources.map((s: any) => `${s.webp} ${s.width}w`).join(', ');
  const imgSrc = `/${info.variants[0].webp}`;

  return (
    <picture>
      <source type="image/avif" srcSet={avifSrcSet} sizes={sizes} />
      <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} />
      <img src={imgSrc} alt={alt} className={className} loading="lazy" />
    </picture>
  );
}
