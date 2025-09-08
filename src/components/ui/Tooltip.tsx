/**
 * Tooltip Component
 * Provides accessible tooltips with keyboard support
 */

import { 
  useState, 
  useRef, 
  useEffect,
  type ReactNode
} from 'react';
import { cn } from '../../utils/cn';

export interface TooltipProps {
  content: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}

const tooltipPositions = {
  top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-1',
  bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-1',
  left: 'right-full top-1/2 transform -translate-y-1/2 mr-1',
  right: 'left-full top-1/2 transform -translate-y-1/2 ml-1',
};

const arrowPositions = {
  top: 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-neutral-900',
  bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-neutral-900',
  left: 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-neutral-900',
  right: 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-neutral-900',
};

export function Tooltip({
  content,
  position = 'top',
  delay = 200,
  disabled = false,
  className,
  children,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const showTooltip = () => {
    if (disabled) {return;}
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
  };

  const hideTooltip = () => {
    clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className={cn('relative inline-block', className)}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      
      {isVisible && !disabled && (
        <div
          className={cn(
            'absolute z-tooltip px-2 py-1 text-sm text-white bg-neutral-900 rounded shadow-lg',
            'whitespace-nowrap pointer-events-none',
            tooltipPositions[position]
          )}
          style={{ zIndex: 1070 }}
          role="tooltip"
          aria-hidden="false"
        >
          {content}
          
          {/* Arrow */}
          <div
            className={cn(
              'absolute w-0 h-0 border-4',
              arrowPositions[position]
            )}
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );
}
