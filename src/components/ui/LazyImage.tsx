import React from 'react';
import { useLazyImage } from '../../utils/assetOptimization';

interface Props {
  src: string;
  alt: string;
  fallback?: string;
  className?: string;
  width?: number;
  height?: number;
}

const LazyImage: React.FC<Props> = ({ src, alt, fallback, className, width, height }) => {
  const { image, isLoading, error } = useLazyImage(src);

  if (error) {
    const effective = fallback || '/images/fallback.png';
    return <img src={effective} alt={alt} className={className} width={width} height={height} />;
  }

  if (isLoading) {
    return <div className={`lazy-image-placeholder ${className || ''}`} style={{ width: width ? `${width}px` : undefined, height: height ? `${height}px` : undefined }}>Loading...</div>;
  }

  return <img src={image?.src || src} alt={alt} className={className} width={width} height={height} />;
};

export default LazyImage;
