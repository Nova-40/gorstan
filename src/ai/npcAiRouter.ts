import type { NPCPersona, NPCResponse, ConversationContext } from '../types/npc';
import { AIConfig, type AIProviderConfig } from './aiConfig';
import { ContentLoader } from './contentLoader';

interface AIResponse {
  content: string;
  tokens_used?: number;
  response_time_ms?: number;
}

export class NPCAiRouter {
  private personas: Map<string, NPCPersona> = new Map();
  private aiConfig: AIConfig | null = null;
  private conversationHistory: Map<string, ConversationContext[]> = new Map();
  private contentLoader: ContentLoader;

  constructor() {
    this.contentLoader = new ContentLoader();
    this.loadPersonas();
    // Try to configure AI from environment
    try {
      this.aiConfig = AIConfig.fromEnvironment();
    } catch (error) {
      console.warn('Failed to configure AI from environment:', error);
    }
  }

  /**
   * Load all NPC personas using the dynamic content loader
   */
  private async loadPersonas(): Promise<void> {
    try {
      const loadedPersonas = await this.contentLoader.loadAllPersonas();
      this.personas = loadedPersonas;
      
      console.log(`Loaded ${this.personas.size} NPC personas:`, Array.from(this.personas.keys()));
    } catch (error) {
      console.error('Failed to load personas:', error);
    }
  }

  /**
   * Configure AI service provider
   */
  configureAI(config: AIConfig): void {
    this.aiConfig = config;
  }

  /**
   * Set AI configuration from environment or manual setup
   */
  setAIProvider(provider: 'groq' | 'openai' | 'anthropic' | 'local', apiKey?: string, model?: string): void {
    this.aiConfig = new AIConfig();
    const config: Partial<AIProviderConfig> = {};
    if (apiKey !== undefined) {config.apiKey = apiKey;}
    if (model !== undefined) {config.model = model;}
    this.aiConfig.setPrimaryProvider(provider, config);
  }

  /**
   * Get response from NPC, using AI if available, falling back to persona defaults
   */
  async getNPCResponse(
    npcId: string,
    userInput: string,
    context?: Partial<ConversationContext>
  ): Promise<NPCResponse> {
    const persona = this.personas.get(npcId);
    if (!persona) {
      throw new Error(`NPC persona not found: ${npcId}`);
    }

    // Prepare conversation context
    const conversationContext: ConversationContext = {
      npc_id: npcId,
      user_input: userInput,
      timestamp: Date.now(),
      zone: context?.zone || 'unknown',
      session_id: context?.session_id || 'default',
      ...context
    };

    // Try AI response first if configured
    if (this.aiConfig && await this.isAIAvailable()) {
      try {
        const aiResponse = await this.getAIResponse(persona, conversationContext);
        if (aiResponse) {
          this.updateConversationHistory(npcId, conversationContext);
          return {
            content: aiResponse.content,
            npc_id: npcId,
            response_source: 'ai',
            metadata: {
              ...(aiResponse.tokens_used !== undefined && { tokens_used: aiResponse.tokens_used }),
              ...(aiResponse.response_time_ms !== undefined && { response_time_ms: aiResponse.response_time_ms }),
              model: this.aiConfig.getPrimaryProvider().model
            }
          };
        }
      } catch (error) {
        console.warn(`AI response failed for ${npcId}, falling back to persona:`, error);
      }
    }

    // Fallback to persona-based response
    const fallbackResponse = this.getFallbackResponse(persona, conversationContext);
    return {
      content: fallbackResponse,
      npc_id: npcId,
      response_source: 'fallback',
      metadata: {
        fallback_reason: this.aiConfig ? 'ai_unavailable' : 'ai_not_configured'
      }
    };
  }

  /**
   * Check if AI service is available
   */
  private async isAIAvailable(): Promise<boolean> {
    if (!this.aiConfig) {return false;}
    
    try {
      return this.aiConfig.isConfigured();
    } catch {
      return false;
    }
  }

  /**
   * Get AI-powered response using configured service
   */
  private async getAIResponse(
    persona: NPCPersona,
    context: ConversationContext
  ): Promise<AIResponse | null> {
    if (!this.aiConfig) {return null;}

    const history = this.getRecentHistory(context.npc_id, persona.memory_length || 10);
    const systemPrompt = this.buildSystemPrompt(persona, context, history);

    const startTime = Date.now();

    try {
      // This is where you'd integrate with actual AI services
      // For now, return null to trigger fallback
      const primaryProvider = this.aiConfig.getPrimaryProvider();
      
      switch (primaryProvider.provider) {
        case 'groq':
          return await this.callGroqAPI(systemPrompt, context.user_input);
        case 'openai':
          return await this.callOpenAIAPI(systemPrompt, context.user_input);
        case 'anthropic':
          return await this.callAnthropicAPI(systemPrompt, context.user_input);
        case 'local':
          return await this.callLocalAPI(systemPrompt, context.user_input);
        default:
          return null;
      }
    } catch (error) {
      console.error('AI API call failed:', error);
      return null;
    }
  }

  /**
   * Build system prompt from persona and context
   */
  private buildSystemPrompt(
    persona: NPCPersona,
    context: ConversationContext,
    history: ConversationContext[]
  ): string {
    const recentHistory = history.length > 0 
      ? `\n\nRecent conversation:\n${history.map(h => `User: ${h.user_input}`).join('\n')}`
      : '';

    return `You are ${persona.name} (${persona.id}). 

${persona.personality}

Communication style: ${persona.style.tone}
Keep responses to ${persona.style.max_sentences} sentences maximum.
Voice: ${persona.style.voice || 'Natural and conversational'}

Constraints:
${persona.constraints.map((c: string) => `- ${c}`).join('\n')}

Current zone: ${context.zone}
Ethical stance: ${persona.ethical_stance}

Key traits: ${persona.traits.join(', ')}
Quirks: ${persona.quirks.join(', ')}

${recentHistory}

Respond as ${persona.name} would, staying true to their personality and constraints.`;
  }

  /**
   * Get fallback response from persona data
   */
  private getFallbackResponse(persona: NPCPersona, context: ConversationContext): string {
    const fallbacks = persona.fallbacks?.offline || [
      `${persona.name} seems distracted and doesn't respond clearly.`
    ];
    
    // Simple selection - in real implementation, might be more sophisticated
    const randomIndex = Math.floor(Math.random() * fallbacks.length);
    const selectedFallback = fallbacks[randomIndex];
    return selectedFallback || `${persona.name} seems distracted and doesn't respond clearly.`;
  }

  /**
   * Update conversation history for memory management
   */
  private updateConversationHistory(npcId: string, context: ConversationContext): void {
    if (!this.conversationHistory.has(npcId)) {
      this.conversationHistory.set(npcId, []);
    }
    
    const history = this.conversationHistory.get(npcId)!;
    history.push(context);
    
    // Trim history to memory length
    const persona = this.personas.get(npcId);
    const maxMemory = persona?.memory_length || 10;
    
    if (history.length > maxMemory) {
      history.splice(0, history.length - maxMemory);
    }
  }

  /**
   * Get recent conversation history for context
   */
  private getRecentHistory(npcId: string, limit: number): ConversationContext[] {
    const history = this.conversationHistory.get(npcId) || [];
    return history.slice(-limit);
  }

  // Groq AI service implementation
  private async callGroqAPI(systemPrompt: string, userInput: string): Promise<AIResponse | null> {
    const primaryProvider = this.aiConfig?.getPrimaryProvider();
    if (!primaryProvider?.apiKey) {
      throw new Error('Groq API key not configured');
    }

    try {
      // Dynamic import to avoid bundling issues if not used
      const { Groq } = await import('groq-sdk');
      
      const groq = new Groq({
        apiKey: primaryProvider.apiKey,
      });

      const startTime = Date.now();

      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userInput }
        ],
        model: primaryProvider.model || 'llama3-8b-8192',
        temperature: primaryProvider.temperature || 0.7,
        max_tokens: primaryProvider.maxTokens || 200,
        top_p: 0.9,
        stream: false
      });

      const responseTime = Date.now() - startTime;
      const content = completion.choices[0]?.message?.content;

      if (!content) {
        return null;
      }

      const result: any = {
        content: content.trim(),
        response_time_ms: responseTime
      };
      
      if (completion.usage?.total_tokens !== undefined) {
        result.tokens_used = completion.usage.total_tokens;
      }
      
      return result;

    } catch (error) {
      console.error('Groq API error:', error);
      return null;
    }
  }

  private async callOpenAIAPI(systemPrompt: string, userInput: string): Promise<AIResponse | null> {
    // TODO: Implement OpenAI API integration
    return null;
  }

  private async callAnthropicAPI(systemPrompt: string, userInput: string): Promise<AIResponse | null> {
    // TODO: Implement Anthropic API integration
    return null;
  }

  private async callLocalAPI(systemPrompt: string, userInput: string): Promise<AIResponse | null> {
    // TODO: Implement local model integration
    return null;
  }

  /**
   * Get available NPCs
   */
  getAvailableNPCs(): string[] {
    return Array.from(this.personas.keys());
  }

  /**
   * Get persona information
   */
  getPersona(npcId: string): NPCPersona | undefined {
    return this.personas.get(npcId);
  }

  /**
   * Clear conversation history for an NPC
   */
  clearHistory(npcId: string): void {
    this.conversationHistory.delete(npcId);
  }
}
