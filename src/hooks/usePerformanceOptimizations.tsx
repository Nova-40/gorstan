import { useEffect, useState } from 'react';

/**
 * Hook to preload images for better perceived performance
 */
export function useImagePreloader(imagePaths: string[]) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadImage = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        
        img.onload = () => {
          setLoadedImages(prev => new Set([...prev, src]));
          resolve();
        };
        
        img.onerror = () => {
          setFailedImages(prev => new Set([...prev, src]));
          reject(new Error(`Failed to load image: ${src}`));
        };
        
        img.src = src;
      });
    };

    // Preload images with a small delay to avoid blocking initial render
    const timeoutId = setTimeout(() => {
      imagePaths.forEach(path => {
        if (!loadedImages.has(path) && !failedImages.has(path)) {
          loadImage(path).catch(() => {
            // Error already handled in the promise
          });
        }
      });
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [imagePaths, loadedImages, failedImages]);

  return {
    loadedImages,
    failedImages,
    isLoaded: (path: string) => loadedImages.has(path),
    hasFailed: (path: string) => failedImages.has(path),
  };
}

/**
 * Component for lazy loading images with better UX
 */
interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'sync' | 'auto';
}

export function LazyImage({ 
  src, 
  alt, 
  className = '',
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23f0f0f0"/%3E%3C/svg%3E',
  loading = 'lazy',
  decoding = 'async'
}: LazyImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleLoad = () => {
    setImageLoaded(true);
  };

  const handleError = () => {
    setImageError(true);
    console.warn(`Failed to load image: ${src}`);
  };

  if (imageError) {
    return (
      <div className={`image-error ${className}`} style={{ 
        background: '#f0f0f0', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '100px'
      }}>
        <span style={{ color: '#666', fontSize: '14px' }}>Image unavailable</span>
      </div>
    );
  }

  return (
    <div className={`lazy-image-container ${className}`} style={{ position: 'relative' }}>
      {!imageLoaded && (
        <img
          src={placeholder}
          alt="Loading..."
          className="image-placeholder"
          style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'blur(5px)',
            opacity: 0.5
          }}
        />
      )}
      
      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding={decoding}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          opacity: imageLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />
    </div>
  );
}

/**
 * Component that respects reduced motion preferences
 */
interface MotionRespectiveProps {
  children: React.ReactNode;
  reducedVersion?: React.ReactNode;
  className?: string;
}

export function MotionRespective({ children, reducedVersion, className = '' }: MotionRespectiveProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <div className={className}>
      {prefersReducedMotion && reducedVersion ? reducedVersion : children}
    </div>
  );
}
