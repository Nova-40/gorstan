import * as React from 'react';

export type TeletypeInput = string | readonly string[];

export type TeletypeChunk = {
  readonly text: string;
  readonly onComplete?: () => void;
};

type TeletypeToken =
  | { readonly kind: 'text'; readonly text: string }
  | { readonly kind: 'pause'; readonly ms: number };

export type UseTeletypeOptions = {
  readonly msPerChar?: number;
  readonly autoStart?: boolean;
};

function normalizeText(input: TeletypeInput): string {
  if (typeof input === 'string') {
    return input as string;
  }
  return input.join('\n');
}

function stripPauseMarkers(text: string): string {
  return text.replace(/\[pause:[^\]]+\]/gi, '');
}

function parsePauseMs(raw: string): number {
  const cleaned = raw.trim().toLowerCase();
  if (!cleaned) {
    return 0;
  }

  // Support numeric millis: [pause:750]
  if (/^\d+$/.test(cleaned)) {
    const ms = Number.parseInt(cleaned, 10);
    return Number.isFinite(ms) ? Math.max(0, Math.min(60_000, ms)) : 0;
  }

  // Named pauses
  switch (cleaned) {
    case 'micro':
      return 150;
    case 'short':
      return 350;
    case 'medium':
      return 700;
    case 'long':
      return 1200;
    default:
      return 0;
  }
}

function tokenizeText(text: string): TeletypeToken[] {
  const tokens: TeletypeToken[] = [];
  const re = /\[pause:([^\]]+)\]/gi;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    const start = match.index;
    const end = re.lastIndex;
    if (start > lastIndex) {
      tokens.push({ kind: 'text', text: text.slice(lastIndex, start) });
    }
    const ms = parsePauseMs(match[1] ?? '');
    if (ms > 0) {
      tokens.push({ kind: 'pause', ms });
    }
    lastIndex = end;
  }
  if (lastIndex < text.length) {
    tokens.push({ kind: 'text', text: text.slice(lastIndex) });
  }
  return tokens;
}

/**
 * Shared teletype/typewriter engine.
 *
 * Core behavior: character-by-character emission using a timer.
 * Supports queueing/append (enqueue more chunks) without restarting already-rendered text.
 */
export function useTeletype(options: UseTeletypeOptions = {}) {
  const msPerChar = options.msPerChar ?? 75;
  const autoStart = options.autoStart ?? true;

  const [displayedText, setDisplayedText] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);
  const [tick, setTick] = React.useState(0);

  const queueRef = React.useRef<TeletypeChunk[]>([]);
  const activeChunkRef = React.useRef<TeletypeChunk | null>(null);
  const activeTokensRef = React.useRef<TeletypeToken[]>([]);
  const tokenIndexRef = React.useRef(0);
  const charIndexRef = React.useRef(0);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const clear = React.useCallback(() => {
    clearTimer();
    queueRef.current = [];
    activeChunkRef.current = null;
    activeTokensRef.current = [];
    tokenIndexRef.current = 0;
    charIndexRef.current = 0;
    setDisplayedText('');
    setIsTyping(false);
  }, [clearTimer]);

  const finish = React.useCallback(() => {
    clearTimer();

    const activeTokens = activeTokensRef.current;
    const queued = queueRef.current;

    let activeRemainder = '';
    for (let i = tokenIndexRef.current; i < activeTokens.length; i += 1) {
      const t = activeTokens[i];
      if (!t) {
        continue;
      }
      if (t.kind !== 'text') {
        continue;
      }
      if (i === tokenIndexRef.current) {
        activeRemainder += t.text.slice(charIndexRef.current);
      } else {
        activeRemainder += t.text;
      }
    }

    const queuedRemainder = queued.map((c) => stripPauseMarkers(c.text)).join('');
    const allRemainder = activeRemainder + queuedRemainder;

    if (allRemainder.length > 0) {
      setDisplayedText((prev) => prev + allRemainder);
    }

    const callbacks: Array<(() => void) | undefined> = [activeChunkRef.current?.onComplete, ...queued.map((c) => c.onComplete)];

    queueRef.current = [];
    activeChunkRef.current = null;
    activeTokensRef.current = [];
    tokenIndexRef.current = 0;
    charIndexRef.current = 0;
    setIsTyping(false);

    callbacks.forEach((cb) => {
      try {
        cb?.();
      } catch {
        // no-op
      }
    });
  }, [clearTimer]);

  const enqueue = React.useCallback((chunk: { text: TeletypeInput; onComplete?: () => void }) => {
    const normalizedText = normalizeText(chunk.text);
    const onComplete = chunk.onComplete;
    const normalizedChunk: TeletypeChunk = onComplete ? { text: normalizedText, onComplete } : { text: normalizedText };
    queueRef.current.push(normalizedChunk);
  }, []);

  const setText = React.useCallback(
    (text: TeletypeInput, onComplete?: () => void) => {
      clearTimer();
      const firstChunk: TeletypeChunk = onComplete
        ? { text: normalizeText(text), onComplete }
        : { text: normalizeText(text) };
      queueRef.current = [firstChunk];
      activeChunkRef.current = null;
      activeTokensRef.current = [];
      tokenIndexRef.current = 0;
      charIndexRef.current = 0;
      setDisplayedText('');
      if (autoStart) {
        setIsTyping(true);
      }
    },
    [autoStart, clearTimer],
  );

  const append = React.useCallback(
    (text: TeletypeInput, onComplete?: () => void) => {
      enqueue(onComplete ? { text, onComplete } : { text });
      if (autoStart) {
        setIsTyping(true);
      }
    },
    [autoStart, enqueue],
  );

  // Drive the typing loop.
  React.useEffect(() => {
    if (!isTyping) {
      return;
    }

    // In tests or special modes, callers may set msPerChar to 0 to flush immediately.
    if (msPerChar <= 0) {
      finish();
      return;
    }

    // Load next chunk if needed.
    if (!activeChunkRef.current) {
      const next = queueRef.current.shift() ?? null;
      activeChunkRef.current = next;
      activeTokensRef.current = next ? tokenizeText(next.text) : [];
      tokenIndexRef.current = 0;
      charIndexRef.current = 0;

      if (!next) {
        setIsTyping(false);
        return;
      }
    }

    const tokens = activeTokensRef.current;
    const tokenIdx = tokenIndexRef.current;
    const token = tokens[tokenIdx];

    // Finished current chunk: fire callback, move to next.
    if (!token) {
      const doneChunk = activeChunkRef.current;
      activeChunkRef.current = null;
      activeTokensRef.current = [];
      tokenIndexRef.current = 0;
      charIndexRef.current = 0;

      try {
        doneChunk?.onComplete?.();
      } catch {
        // Avoid crashing UI if a callback throws.
      }

      // Continue immediately with next chunk.
      setTick((t) => t + 1);
      return;
    }

    if (token.kind === 'pause') {
      clearTimer();
      setIsTyping(false);
      timeoutRef.current = setTimeout(() => {
        tokenIndexRef.current += 1;
        charIndexRef.current = 0;
        setIsTyping(true);
      }, token.ms);
      return clearTimer;
    }

    const activeText = token.text;

    // Finished current token: advance to next.
    if (charIndexRef.current >= activeText.length) {
      tokenIndexRef.current += 1;
      charIndexRef.current = 0;
      setTick((t) => t + 1);
      return;
    }

    clearTimer();
    timeoutRef.current = setTimeout(() => {
      const nextChar = activeText.charAt(charIndexRef.current);
      charIndexRef.current += 1;
      setDisplayedText((prev) => prev + nextChar);
    }, msPerChar);

    return clearTimer;
  }, [clearTimer, displayedText, finish, isTyping, msPerChar, tick]);

  React.useEffect(() => clearTimer, [clearTimer]);

  return {
    displayedText,
    isTyping,
    clear,
    finish,
    setText,
    append,
  };
}
