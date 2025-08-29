
import { useRef, useState } from 'react';
import type { IAylaClient, AylaRequest } from './AylaClient';

export function useAyla(client: IAylaClient){
  const [isTyping, setTyping] = useState(false);
  const [error, setError] = useState<string|undefined>();
  const abortRef = useRef<{ aborted: boolean }>({ aborted: false });

  async function ask(req: AylaRequest, onToken: (t:string)=>void){
    setTyping(true); setError(undefined);
    abortRef.current.aborted = false;
    try {
      await client.stream(req, { onToken: (t)=>{ if(!abortRef.current.aborted) onToken(t); }, onDone: ()=> setTyping(false), onError: (e)=> setError(e?.message || 'Ayla error') });
    } catch {
      setTyping(false);
    }
  }
  function cancel(){ abortRef.current.aborted = true; setTyping(false); }
  return { ask, cancel, isTyping, error };
}
