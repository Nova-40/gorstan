/**
 * ConsoleTerminal Component - Beta3 Design System
 * Features teletype animation, braille cursor, skip-to-reveal, accessibility
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '../../utils/cn';
import { ANIMATION, PUNCTUATION_DELAYS } from '../../domain/constants';
import type { ConsoleMessage, ConsoleTerminalProps } from '../../domain/types';

// Ephemeral Ayla message shape (non-typed in domain to keep domain core lean)
interface EphemeralAylaMessage { id: string; content: string; expiresAt: number }

const BRAILLE_CURSOR = '⣿';

interface TypingState {
  messageIndex: number;
  charIndex: number;
  isTyping: boolean;
  skipTyping: boolean;
}

export function ConsoleTerminal({ 
  messages, 
  onSkipTyping, 
  onComplete, 
  className,
  ephemeralAylaMessages = []
}: ConsoleTerminalProps & { ephemeralAylaMessages?: EphemeralAylaMessage[] }) {
  const [typingState, setTypingState] = useState<TypingState>({
    messageIndex: 0,
    charIndex: 0,
    isTyping: false,
    skipTyping: false,
  });
  
  const [displayedMessages, setDisplayedMessages] = useState<string[]>([]);
  const [showCursor, setShowCursor] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Skip typing handler
  const handleSkipTyping = useCallback(() => {
    setTypingState(prev => ({ ...prev, skipTyping: true }));
    onSkipTyping?.();
  }, [onSkipTyping]);

  // Keyboard event handler for skip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleSkipTyping();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleSkipTyping]);

  // Get delay for character based on punctuation
  const getCharDelay = (char: string, nextChar?: string): number => {
    if (prefersReducedMotion) return 0;
    
    // Check for ellipsis
    if (char === '.' && nextChar === '.' && messages[typingState.messageIndex]?.content[typingState.charIndex + 2] === '.') {
      return PUNCTUATION_DELAYS.ellipsis;
    }
    
    // Individual punctuation
    switch (char) {
      case ',': return PUNCTUATION_DELAYS.comma;
      case '.': 
      case '!': 
      case '?': 
      case ':': 
      case ';': return PUNCTUATION_DELAYS.period;
      default: return ANIMATION.typeSpeed;
    }
  };

  // Typing animation effect
  useEffect(() => {
    if (messages.length === 0) return;
    
    const currentMessage = messages[typingState.messageIndex];
    if (!currentMessage) {
      onComplete?.();
      return;
    }

    // Skip typing for system messages or if reduced motion
    if (currentMessage.skipTyping || prefersReducedMotion || typingState.skipTyping) {
      // Show full message immediately
      setDisplayedMessages(prev => {
        const newMessages = [...prev];
        newMessages[typingState.messageIndex] = currentMessage.content;
        return newMessages;
      });
      
      // Move to next message
      if (typingState.messageIndex < messages.length - 1) {
        setTypingState(prev => ({
          ...prev,
          messageIndex: prev.messageIndex + 1,
          charIndex: 0,
          isTyping: false,
        }));
      } else {
        setTypingState(prev => ({ ...prev, isTyping: false }));
        onComplete?.();
      }
      return;
    }

    setTypingState(prev => ({ ...prev, isTyping: true }));

    const typeNextChar = () => {
      const message = messages[typingState.messageIndex];
      if (!message) return;

      if (typingState.charIndex >= message.content.length) {
        // Message complete, move to next
        if (typingState.messageIndex < messages.length - 1) {
          setTypingState(prev => ({
            ...prev,
            messageIndex: prev.messageIndex + 1,
            charIndex: 0,
            isTyping: false,
          }));
        } else {
          setTypingState(prev => ({ ...prev, isTyping: false }));
          onComplete?.();
        }
        return;
      }

      // Add character to display
      const char = message.content[typingState.charIndex];
      const nextChar = message.content[typingState.charIndex + 1];
      
      setDisplayedMessages(prev => {
        const newMessages = [...prev];
        const currentText = newMessages[typingState.messageIndex] || '';
        newMessages[typingState.messageIndex] = currentText + char;
        return newMessages;
      });

      setTypingState(prev => ({ ...prev, charIndex: prev.charIndex + 1 }));

      // Schedule next character
  const delay = getCharDelay(char ?? '', nextChar ?? '');
      timeoutRef.current = setTimeout(typeNextChar, delay);
    };

    timeoutRef.current = setTimeout(typeNextChar, ANIMATION.typeSpeed);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [messages, typingState.messageIndex, typingState.charIndex, typingState.skipTyping, prefersReducedMotion, onComplete]);

  // Cursor blinking effect
  useEffect(() => {
    if (prefersReducedMotion) {
      setShowCursor(true);
      return;
    }

    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, ANIMATION.blinkDuration);

    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [displayedMessages]);

  const now = Date.now();
  const activeEphemeral = ephemeralAylaMessages.filter(m => m.expiresAt > now);

  return (
    <div
      ref={containerRef}
      className={cn(
        'font-mono text-sm bg-background border border-surface rounded-sm',
        'p-4 h-full overflow-y-auto scroll-smooth',
        'focus:outline-none focus:ring-2 focus:ring-console',
        className
      )}
      onClick={handleSkipTyping}
      tabIndex={0}
      role="log"
      aria-live="polite"
      aria-label="Game console output"
    >
      <div className="space-y-1">
  {displayedMessages.map((text, index) => {
          const message = messages[index];
          if (!message) return null;

          return (
            <div key={message.id} className={cn(
              'leading-relaxed transition-opacity',
              message.type === 'system' && 'text-console',
              message.type === 'player' && 'text-text',
              message.type === 'npc' && 'text-info',
              message.type === 'narration' && 'text-text/80',
              message.type === 'error' && 'text-error',
            )}>
              {text}
              {index === typingState.messageIndex && typingState.isTyping && (
                <span 
                  className={cn(
                    'inline-block ml-1 text-console',
                    !prefersReducedMotion && 'animate-blink'
                  )}
                  aria-hidden="true"
                >
                  {showCursor ? BRAILLE_CURSOR : ' '}
                </span>
              )}
            </div>
          );
        })}
        {activeEphemeral.map(m => {
          const remaining = m.expiresAt - now;
          return (
            <div
              key={m.id}
              className={cn(
                'leading-relaxed text-amber-400/90 italic transition-opacity duration-700',
                remaining < 1200 && 'opacity-0'
              )}
            >
              {m.content}
            </div>
          );
        })}
      </div>
      
      {/* Skip hint for screen readers */}
      <div className="sr-only">
        Press Space or Enter to skip typing animation
      </div>
    </div>
  );
}

// Helper function for Gorstan snark
export function withGorstanSnark(message: string): string {
  const snarks = [
    " (Filed in triplicate, naturally.)",
    " (Bureaucracy pending approval.)",
    " (Forms 27-B through 94-X completed.)",
    " (Administrative satisfaction achieved.)",
    " (Properly documented, as required.)",
    " (Your compliance is noted.)",
    " (Efficiency metrics updated.)"
  ];
  
  const randomSnark = snarks[Math.floor(Math.random() * snarks.length)];
  return message + randomSnark;
}
