/**
 * Configuration for AI services in Gorstan Beta3
 * Handles API keys, model selection, and fallback strategies
 */

export interface AIProviderConfig {
  provider: 'groq' | 'openai' | 'anthropic' | 'local';
  apiKey?: string;
  model: string;
  endpoint?: string;
  maxTokens?: number;
  temperature?: number;
  enabled: boolean;
}

interface AIConfigOptions {
  primary: AIProviderConfig;
  fallback?: AIProviderConfig;
  globalSettings: {
    maxRetries: number;
    timeoutMs: number;
    enableLogging: boolean;
    rateLimitDelay: number;
  };
}

// Default configurations for different providers
const DEFAULT_CONFIGS: Record<string, Partial<AIProviderConfig>> = {
  groq: {
    provider: 'groq',
    model: 'llama3-8b-8192',
    maxTokens: 200,
    temperature: 0.7,
    enabled: true
  },
  openai: {
    provider: 'openai',
    model: 'gpt-3.5-turbo',
    maxTokens: 200,
    temperature: 0.7,
    enabled: false
  },
  anthropic: {
    provider: 'anthropic',
    model: 'claude-3-haiku-20240307',
    maxTokens: 200,
    temperature: 0.7,
    enabled: false
  },
  local: {
    provider: 'local',
    model: 'local-llm',
    endpoint: 'http://localhost:11434',
    maxTokens: 200,
    temperature: 0.7,
    enabled: false
  }
};

export class AIConfig {
  private config: AIConfigOptions;

  constructor(options?: Partial<AIConfigOptions>) {
    this.config = {
      primary: {
        ...DEFAULT_CONFIGS.groq,
        ...options?.primary
      } as AIProviderConfig,
      ...(options?.fallback && { fallback: options.fallback }),
      globalSettings: {
        maxRetries: 3,
        timeoutMs: 10000,
        enableLogging: false,
        rateLimitDelay: 1000,
        ...options?.globalSettings
      }
    };
  }

  /**
   * Configure from environment variables
   */
  static fromEnvironment(): AIConfig {
    const config = new AIConfig();
    
    // Check for Groq configuration
    const groqKey = process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY;
    if (groqKey) {
      config.setPrimaryProvider('groq', {
        apiKey: groqKey,
        model: process.env.GROQ_MODEL || 'llama3-8b-8192'
      });
    }

    // Check for OpenAI configuration
    const openaiKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;
    if (openaiKey && !groqKey) {
      config.setPrimaryProvider('openai', {
        apiKey: openaiKey,
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo'
      });
    }

    // Enable logging in development
    if (process.env.NODE_ENV === 'development') {
      config.setGlobalSetting('enableLogging', true);
    }

    return config;
  }

  /**
   * Set primary AI provider
   */
  setPrimaryProvider(provider: AIProviderConfig['provider'], overrides: Partial<AIProviderConfig> = {}) {
    this.config.primary = {
      ...DEFAULT_CONFIGS[provider],
      provider,
      enabled: true,
      ...overrides
    } as AIProviderConfig;
  }

  /**
   * Set fallback AI provider
   */
  setFallbackProvider(provider: AIProviderConfig['provider'], overrides: Partial<AIProviderConfig> = {}) {
    this.config.fallback = {
      ...DEFAULT_CONFIGS[provider],
      provider,
      enabled: true,
      ...overrides
    } as AIProviderConfig;
  }

  /**
   * Update global settings
   */
  setGlobalSetting<K extends keyof AIConfigOptions['globalSettings']>(
    key: K, 
    value: AIConfigOptions['globalSettings'][K]
  ) {
    this.config.globalSettings[key] = value;
  }

  /**
   * Get current configuration
   */
  getConfig(): AIConfigOptions {
    return this.config;
  }

  /**
   * Get primary provider config
   */
  getPrimaryProvider(): AIProviderConfig {
    return this.config.primary;
  }

  /**
   * Get fallback provider config
   */
  getFallbackProvider(): AIProviderConfig | undefined {
    return this.config.fallback;
  }

  /**
   * Check if AI is properly configured
   */
  isConfigured(): boolean {
    return this.config.primary.enabled && Boolean(this.config.primary.apiKey);
  }

  /**
   * Validate configuration
   */
  validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.config.primary.enabled) {
      errors.push('No primary AI provider enabled');
    }

    if (this.config.primary.enabled && !this.config.primary.apiKey && this.config.primary.provider !== 'local') {
      errors.push(`API key required for ${this.config.primary.provider} provider`);
    }

    if (this.config.primary.provider === 'local' && !this.config.primary.endpoint) {
      errors.push('Endpoint required for local provider');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Get safe config for logging (without API keys)
   */
  getSafeConfig() {
    const safe = JSON.parse(JSON.stringify(this.config));
    if (safe.primary?.apiKey) {safe.primary.apiKey = '[REDACTED]';}
    if (safe.fallback?.apiKey) {safe.fallback.apiKey = '[REDACTED]';}
    return safe;
  }
}
