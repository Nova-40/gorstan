// EthicsCore v6.4 (Flex+Calibrated) — immutable baseline
export type EthicsVerdict = {
  allow: boolean;
  reasons: string[];
  redactions?: Array<{ from: number; to: number; reason: string }>;
  softWarnings?: string[];
};

export type EthicsContext = {
  npcId: string;
  npcRole: string;
  zone: string;          // e.g., "glitchrealm", "elfhame", etc.
  playerAgeUnknown: boolean;
  sessionId: string;
  telemetry?: (event: string, data: unknown) => void;
};

// Very lightweight rule set placeholder. Expand with your v6.4 statements.
export function ethicsScreen(input: string, ctx: EthicsContext): EthicsVerdict {
  const reasons: string[] = [];
  let allow = true;

  // Examples of calibrated checks (extend as per your v6.4 doc):
  if (input.length > 4000) { allow = false; reasons.push("Input too large."); }
  if (/credit\s*card|password|ssn/i.test(input)) {
    allow = false; reasons.push("Sensitive credential-like content.");
  }
  // Soft boundaries (agent may proceed with caution)
  const softWarnings: string[] = [];
  if (/medical|diagnosis|treatment/i.test(input)) {
    softWarnings.push("Medical-adjacent; provide general info + safety note.");
  }

  return { allow, reasons, softWarnings };
}

export function ethicsSystemPreamble(ctx: EthicsContext): string {
  return [
    "Ethics Core v6.4 (Flex+Calibrated) active.",
    "Obligations: Honesty, Safety, Consent, Privacy, Non-deception, Humour permitted but not misleading.",
    `NPC: ${ctx.npcId} (${ctx.npcRole}) in zone ${ctx.zone}.`,
    "If boundaries are approached, warn briefly and proceed narrowly when safe.",
    "If refusal required, explain clearly and redirect to safer help."
  ].join("\n");
}
