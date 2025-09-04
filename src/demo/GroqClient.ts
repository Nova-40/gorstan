import { DEMO_COMMAND_WHITELIST } from "./CommandWhitelist";
import { DEMO } from "@/config";

type GroqRequest = {
  roomId: string;
  recentTranscript: string[];
  inventory: string[];
  visible: string[];
  goals?: string[];
  allowed: string[];
};

function sanitize(cmd: string) {
  const c = (cmd || "").toLowerCase().trim();
  if (!DEMO.STRICT_WHITELIST) return c || "look";
  return (DEMO_COMMAND_WHITELIST as readonly string[]).includes(c) ? c : "look";
}

// MOCK fallback so demo works before wiring real Groq:
function mockSuggest(allowed: string[]) {
  const pool = allowed.filter(a => a.startsWith("play ")) ?? allowed;
  const src = pool.length ? pool : allowed;
  return sanitize(src[Math.floor(Math.random() * src.length)] || "look");
}

export async function groqSuggestCommand(req: GroqRequest, _signal?: AbortSignal): Promise<string> {
  try {
    // TODO: replace with real Groq call via server proxy; never store keys client-side.
    await new Promise(r => setTimeout(r, Math.min(500, DEMO.GROQ_TIMEOUT_MS)));
    return mockSuggest(req.allowed);
  } catch {
    return "look";
  }
}
