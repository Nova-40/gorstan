import React from 'react';
import manifest from '/public/images/_optimized.json';
import { pickOptimized } from '@/lib/optimized';

type Props = React.ImgHTMLAttributes<HTMLImageElement> & { src: string; alt?: string };

export default function SmartImage({ src, alt = '', ...rest }: Props) {
  const { avif, webp, fallback } = pickOptimized(src, manifest as any);
  return (
    <picture>
      {avif && <source srcSet={avif} type="image/avif" />}
      {webp && <source srcSet={webp} type="image/webp" />}
      <img src={fallback} alt={alt} loading="lazy" decoding="async" {...rest} />
    </picture>
  );
}
