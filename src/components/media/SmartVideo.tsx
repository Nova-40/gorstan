import React from 'react';
import manifest from '../../lib/optimized';

type Props = {
  src: string; // relative path under /images
  className?: string;
  poster?: string;
  autoPlay?: boolean;
};

export default function SmartVideo({ src, className, poster, autoPlay = true }: Props) {
  const typedManifest: Record<string, any> = manifest as any;
  const key = src.replace(/^\//, '').replace(/^images\//, '');
  const info = typedManifest[key];
  const prefersReduced = typeof window !== 'undefined' && (window as any).matchMedia && (window as any).matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!info) return <img src={src} alt="" className={className} />;

  const v = info.variants && info.variants[0];
  if (!v) return <img src={src} alt="" className={className} />;

  // if reduced motion is preferred, show poster only
  if (prefersReduced) return <img src={`/${v.poster}`} alt="" className={className} />;

  return (
    <video
      className={className}
      autoPlay={autoPlay}
      muted
      loop
      playsInline
      poster={`/${v.poster}`}
      preload="metadata"
    >
      <source src={`/${v.webm}`} type="video/webm" />
      <source src={`/${v.mp4}`} type="video/mp4" />
      <img src={`/${v.poster}`} alt="" />
    </video>
  );
}
