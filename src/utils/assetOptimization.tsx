import React from 'react';

/**
 * Asset optimization utilities for lazy loading images and audio
 * Helps improve initial load time by only loading assets when needed
 */

// Cache for loaded images to prevent re-loading
const imageCache = new Map<string, HTMLImageElement>();

/**
 * Lazy loads an image and returns a promise that resolves when loaded
 */
export const preloadImage = (src: string): Promise<HTMLImageElement> => {
  // Check cache first
  if (imageCache.has(src)) {
    return Promise.resolve(imageCache.get(src)!);
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      imageCache.set(src, img);
      resolve(img);
    };
    img.onerror = () => {
      // If the failed src is a room image, attempt to load the placeholder room image
      try {
        const base = (src || '').toString();
        if (base.includes('/images/rooms/') && !base.endsWith('placeholder-room.png')) {
          const placeholder = base.replace(/[^/]+$/, 'placeholder-room.png');
          // Try to load placeholder and resolve to it if successful
          const pimg = new Image();
          pimg.onload = () => {
            imageCache.set(placeholder, pimg);
            resolve(pimg);
          };
          pimg.onerror = () => reject(new Error(`Failed to load image and fallback: ${src}`));
          pimg.src = placeholder;
          return;
        }
      } catch (e) {
        // ignore and fall through to generic reject
      }

      reject(new Error(`Failed to load image: ${src}`));
    };
    img.src = src;
  });
};

/**
 * Lazy loads multiple images in parallel
 */
export const preloadImages = (srcs: string[]): Promise<HTMLImageElement[]> => {
  return Promise.all(srcs.map(preloadImage));
};

/**
 * Hook for lazy loading images in React components
 */
export const useLazyImage = (src: string) => {
  const [image, setImage] = React.useState<HTMLImageElement | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setIsLoading(true);
    setError(null);

    preloadImage(src)
      .then((img) => {
        setImage(img);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, [src]);

  return { image, isLoading, error };
};

/**
 * Audio cache and lazy loading
 */
const audioCache = new Map<string, HTMLAudioElement>();

export const preloadAudio = (src: string): Promise<HTMLAudioElement> => {
  if (audioCache.has(src)) {
    return Promise.resolve(audioCache.get(src)!);
  }

  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.addEventListener('canplaythrough', () => {
      audioCache.set(src, audio);
      resolve(audio);
    });
    audio.addEventListener('error', () => reject(new Error(`Failed to load audio: ${src}`)));
    audio.src = src;
    // Don't preload the entire file, just metadata
    audio.preload = 'metadata';
  });
};

/**
 * Component for lazy loading images with fallback
 */
interface LazyImageProps {
  src: string;
  alt: string;
  fallback?: string;
  className?: string;
  width?: number;
  height?: number;
  onLoad?: () => void;
  onError?: (error: string) => void;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  fallback = '/images/fallback.png',
  className,
  width,
  height,
  onLoad,
  onError,
}) => {
  const { isLoading, error } = useLazyImage(src);

  React.useEffect(() => {
    if (!isLoading && !error && onLoad) {
      onLoad();
    }
    if (error && onError) {
      onError(error);
    }
  }, [isLoading, error, onLoad, onError]);

  if (error) {
    // If the failed src was a room image but the fallback is not the placeholder, prefer the room placeholder
    try {
      const srcStr = (error || '').toString();
    } catch (e) {}
    const effectiveFallback = fallback || '/images/fallback.png';
    return <img src={effectiveFallback} alt={alt} className={className} width={width} height={height} />;
  }

  if (isLoading) {
    return (
      <div
        className={`lazy-image-placeholder ${className || ''}`}
        style={{
          width: width ? `${width}px` : undefined,
          height: height ? `${height}px` : undefined,
          backgroundColor: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Loading...
      </div>
    );
  }

  return <img src={src} alt={alt} className={className} width={width} height={height} />;
};

/**
 * Intersection Observer for loading images when they come into view
 */
export const useIntersectionObserver = (
  callback: (isIntersecting: boolean) => void,
  options?: IntersectionObserverInit,
) => {
  const targetRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    const target = targetRef.current;
    if (!target) {
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry) return;
      callback(entry.isIntersecting);
    }, {
      threshold: 0.1,
      rootMargin: '50px',
      ...options,
    });

    observer.observe(target);
    return () => {
      try {
        observer.unobserve(target);
      } catch (e) {
        // ignore cleanup errors
      }
      try {
        observer.disconnect();
      } catch (e) {
        // ignore
      }
    };
  }, [callback, options]);

  return targetRef;
};

/**
 * Preload critical images based on current game state
 */
export const preloadCriticalAssets = async (roomId: string, npcs: string[] = []) => {
  const criticalImages: string[] = [];

  // Add room background if exists
  if (roomId) {
    // Derive zone and room image patterns from roomId
    const roomImagePatterns = [
  // Prefer the central rooms folder (png then gif) and fallback to legacy paths
  `/images/rooms/${roomId}.png`,
  `/images/rooms/${roomId}.gif`,
  `/images/${roomId}.png`,
  `/images/${roomId}.gif`,
  // Zone-based patterns commonly used in the app (legacy)
  `/images/introZone_${roomId}.png`,
  `/images/gorstanZone_${roomId}.png`,
  `/images/londonZone_${roomId}.png`,
  `/images/latticeZone_${roomId}.png`,
  `/images/mazeZone_${roomId}.png`,
    ];

    criticalImages.push(...roomImagePatterns);
  }

  // Add NPC portraits
  npcs.forEach((npc) => {
    criticalImages.push(`/images/${npc}.png`);
  });

  // Filter to only attempt loading images that are likely to exist
  const validImages = criticalImages.filter(
    (img) => !img.includes('undefined') && !img.includes('null'),
  );

  try {
    await preloadImages(validImages);
    console.log('[AssetOptimization] Preloaded critical assets:', validImages.length);
  } catch (error) {
    console.warn('[AssetOptimization] Some assets failed to preload:', error);
  }
};
