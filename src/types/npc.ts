export interface NPCPersona {
  id: string;
  name: string;
  style: {
    tone: string;
    max_sentences: number;
    voice?: string;
  };
  personality: string;
  constraints: string[];
  fallbacks?: {
    offline?: string[];
    error?: string[];
  };
  memory_length?: number;
  ethical_stance?: string;
  traits: string[];
  quirks: string[];
}

export interface ConversationContext {
  npc_id: string;
  user_input: string;
  timestamp: number;
  zone?: string;
  session_id?: string;
  user_id?: string;
  game_state?: Record<string, unknown>;
}

export interface NPCResponse {
  content: string;
  npc_id: string;
  response_source: 'ai' | 'fallback';
  metadata?: {
    tokens_used?: number;
    response_time_ms?: number;
    model?: string;
    fallback_reason?: string;
    confidence_score?: number;
  };
}

export interface NPCDialogue {
  id: string;
  npc_id: string;
  category: string;
  triggers?: string[];
  responses: string[];
  conditions?: Record<string, unknown>;
  weight?: number;
}

export interface LoreEntry {
  id: string;
  title: string;
  type: 'location' | 'phenomenon' | 'research' | 'character' | 'event';
  tags: string[];
  related?: string[];
  discovered_by?: string;
  classification?: string;
  content: string;
}

export interface NPCStats {
  total_interactions: number;
  ai_responses: number;
  fallback_responses: number;
  average_response_time: number;
  last_interaction: number;
  memory_usage: number;
}

export type NPCEventType = 
  | 'conversation_start'
  | 'conversation_end'
  | 'ai_response'
  | 'fallback_response'
  | 'memory_update'
  | 'error';

export interface NPCEvent {
  type: NPCEventType;
  npc_id: string;
  timestamp: number;
  data?: Record<string, unknown>;
}
