import React from 'react';
import { pickOptimized } from '../lib/optimized';

type Props = React.ImgHTMLAttributes<HTMLImageElement> & { src: string; alt?: string };

export default function SmartImage({ src, alt = '', ...rest }: Props) {
  const entry = pickOptimized(src) || {};
  const { avif, webp, fallback } = entry;
  return (
    <picture>
      {avif && <source srcSet={avif} type="image/avif" />}
      {webp && <source srcSet={webp} type="image/webp" />}
      <img src={fallback} alt={alt} loading="lazy" decoding="async" {...rest} />
    </picture>
  );
}
