
export type AylaModel = 'fast' | 'smart';

export interface AylaRequest {
  model: AylaModel;
  user: string;
  prompt: string;
  system?: string;
  context?: Record<string, any>;
}

export interface AylaStreamCallbacks {
  onToken?: (t: string) => void;
  onDone?: (full: string) => void;
  onError?: (err: Error) => void;
}

export interface IAylaClient {
  stream(req: AylaRequest, cb: AylaStreamCallbacks): Promise<void>;
}

// Simple HTTP client that streams plain text; falls back to buffered if stream unsupported
export class HttpAylaClient implements IAylaClient {
  constructor(private baseUrl: string = '/api/ayla') {}
  async stream(req: AylaRequest, cb: AylaStreamCallbacks): Promise<void> {
    try {
      const res = await fetch(this.baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req)
      });
      if (!res.ok) {throw new Error('Ayla HTTP ' + res.status);}
      if (!res.body) {
        const text = await res.text();
        cb.onToken?.(text);
        cb.onDone?.(text);
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) {break;}
        const chunk = decoder.decode(value, { stream: true });
        full += chunk;
        cb.onToken?.(chunk);
      }
      cb.onDone?.(full);
    } catch (e: any) {
      cb.onError?.(e);
      throw e;
    }
  }
}

// Mock provider so the game never blocks without a backend
export class MockAylaClient implements IAylaClient {
  async stream(req: AylaRequest, cb: AylaStreamCallbacks): Promise<void> {
    const base = 'Ayla (offline): ';
    const msg = (req.prompt || '').toLowerCase();
    const reply = msg.includes('redacted')
      ? base + 'Beware those who catalogue the living.'
      : base + 'Proceed. Small actions unlock large doors.';
    const tokens = reply.split(' ');
    let acc = '';
    for (const t of tokens) {
      acc += (acc ? ' ' : '') + t;
      cb.onToken?.(' ' + t);
      await new Promise(r => setTimeout(r, 25));
    }
    cb.onDone?.(acc);
  }
}
