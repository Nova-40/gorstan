/**
 * Modal Dialog Component
 * Provides accessible modal dialogs with focus trapping and keyboard navigation
 */

import { 
  forwardRef, 
  useEffect, 
  useRef, 
  type HTMLAttributes, 
  type ReactNode,
  type KeyboardEvent
} from 'react';
import { cn } from '../../utils/cn';

export interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  children: ReactNode;
}

const modalSizes = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-full mx-4',
};

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      isOpen,
      onClose,
      title,
      description,
      size = 'md',
      closeOnOverlayClick = true,
      closeOnEscape = true,
      className,
      children,
      ...props
    },
    forwardedRef
  ) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const previousActiveElement = useRef<Element | null>(null);

    // Focus trap implementation
    useEffect(() => {
      if (!isOpen) return;

      // Store the currently focused element
      previousActiveElement.current = document.activeElement;

      // Focus the modal
      const modal = (forwardedRef as React.RefObject<HTMLDivElement>)?.current || modalRef.current;
      if (modal) {
        modal.focus();
      }

      // Setup focus trap
      const handleFocusTrap = (e: KeyboardEvent) => {
        if (!modal) return;

        const focusableElements = modal.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement.focus();
              e.preventDefault();
            }
          }
        }
      };

      // Add event listeners
      const handleKeyDown = (e: KeyboardEvent) => {
        if (closeOnEscape && e.key === 'Escape') {
          onClose();
        }
        handleFocusTrap(e);
      };

      document.addEventListener('keydown', handleKeyDown as any);

      return () => {
        document.removeEventListener('keydown', handleKeyDown as any);
        
        // Restore focus to previously active element
        if (previousActiveElement.current instanceof HTMLElement) {
          previousActiveElement.current.focus();
        }
      };
    }, [isOpen, onClose, closeOnEscape]);

    if (!isOpen) return null;

    const handleOverlayClick = (e: React.MouseEvent) => {
      if (closeOnOverlayClick && e.target === e.currentTarget) {
        onClose();
      }
    };

    return (
      <div
        className="fixed inset-0 z-modal-backdrop"
        style={{ zIndex: 1040 }}
        aria-hidden={!isOpen}
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-75 transition-opacity"
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
        
        {/* Modal */}
        <div
          className="fixed inset-0 z-modal overflow-y-auto"
          style={{ zIndex: 1050 }}
        >
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <div
              ref={forwardedRef || modalRef}
              className={cn(
                'relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all',
                'w-full',
                modalSizes[size],
                className
              )}
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? 'modal-title' : undefined}
              aria-describedby={description ? 'modal-description' : undefined}
              tabIndex={-1}
              {...props}
            >
              {/* Header */}
              {(title || description) && (
                <div className="px-6 py-4 border-b border-neutral-200">
                  {title && (
                    <h3 
                      id="modal-title" 
                      className="text-lg font-semibold text-neutral-900"
                    >
                      {title}
                    </h3>
                  )}
                  {description && (
                    <p 
                      id="modal-description" 
                      className="mt-1 text-sm text-neutral-600"
                    >
                      {description}
                    </p>
                  )}
                </div>
              )}
              
              {/* Content */}
              <div className="px-6 py-4">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

Modal.displayName = 'Modal';
