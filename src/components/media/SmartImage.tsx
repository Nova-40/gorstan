import React from 'react';
import manifest from '../../lib/optimized';

type Props = {
  src: string; // relative path under /images
  alt?: string;
  className?: string;
  sizes?: string;
};

export default function SmartImage({ src, alt = '', className, sizes = '100vw' }: Props) {
  if (/\.gif$/i.test(src)) {
    return <img src={src} alt={alt} className={className} loading="lazy" />;
  }

  const typedManifest: Record<string, any> = manifest as any;
  const keyWithExtension = src.replace(/^\//, '').replace(/^images\//, '');
  const key = keyWithExtension.replace(/\.[a-z0-9]+$/i, '');
  const info = typedManifest[keyWithExtension] ?? typedManifest[key];
  const fallback = info?.fallback ?? src;
  const variantBase = `variants/${key}`;
  const variant = typedManifest[variantBase];
  const variantWidths = [480, 768, 1200, 1920]
    .map((width) => ({ width, info: typedManifest[`${variantBase}-${width}`] }))
    .filter((candidate) => candidate.info?.webp || candidate.info?.avif);

  if (!variant && !variantWidths.length) {
    return <img src={src} alt={alt} className={className} />;
  }

  const avifSrcSet = variantWidths
    .filter((candidate) => candidate.info.avif)
    .map((candidate) => `${candidate.info.avif} ${candidate.width}w`)
    .join(', ');
  const webpSrcSet = variantWidths
    .filter((candidate) => candidate.info.webp)
    .map((candidate) => `${candidate.info.webp} ${candidate.width}w`)
    .join(', ');

  return (
    <picture>
      {avifSrcSet && <source type="image/avif" srcSet={avifSrcSet} sizes={sizes} />}
      {webpSrcSet && <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} />}
      {variant?.avif && <source type="image/avif" srcSet={variant.avif} />}
      {variant?.webp && <source type="image/webp" srcSet={variant.webp} />}
      <img src={fallback} alt={alt} className={className} loading="lazy" />
    </picture>
  );
}
