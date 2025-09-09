/**
 * Wendell's AI conversation engine
 * Handles dynamic responses based on visitor context and history
 */

import { getRandomQuestion } from './questions';

export interface ConversationContext {
  visitor_name?: string;
  locations_visited: string[];
  items_encountered: string[];
  previous_conversations: string[];
  knowledge_level: 'novice' | 'explorer' | 'scholar' | 'initiate';
  trust_level: number; // 0-10
  current_topic?: string;
}

export interface WendellResponse {
  text: string;
  tone: 'welcoming' | 'questioning' | 'revealing' | 'warning' | 'cryptic';
  includes_question: boolean;
  knowledge_shared: string[];
  trust_change: number;
}

export class WendellAI {
  constructor() {
    // Configuration loaded from persona and guardrails modules
  }

  generateResponse(input: string, context: ConversationContext): WendellResponse {
    // Analyze input for intent and topic
    const intent = this.analyzeIntent(input);
    const topic = this.extractTopic(input);

    // Determine appropriate response based on context
    const responseType = this.determineResponseType(intent, topic, context);

    // Generate contextual response
    return this.craftResponse(responseType, topic, context);
  }

  private analyzeIntent(
    input: string,
  ): 'greeting' | 'question' | 'boast' | 'seek_help' | 'challenge' | 'small_talk' {
    const lower = input.toLowerCase();

    if (lower.includes('hello') || lower.includes('greet') || lower.includes('hi ')) {
      return 'greeting';
    }
    if (
      lower.includes('?') ||
      lower.includes('how') ||
      lower.includes('what') ||
      lower.includes('why')
    ) {
      return 'question';
    }
    if (lower.includes('i found') || lower.includes('i have') || lower.includes('i discovered')) {
      return 'boast';
    }
    if (lower.includes('help') || lower.includes('stuck') || lower.includes('lost')) {
      return 'seek_help';
    }
    if (lower.includes('wrong') || lower.includes('disagree') || lower.includes('but ')) {
      return 'challenge';
    }

    return 'small_talk';
  }

  private extractTopic(input: string): string {
    const lower = input.toLowerCase();

    if (lower.includes('tower') || lower.includes('building')) {
      return 'tower_history';
    }
    if (lower.includes('magic') || lower.includes('spell') || lower.includes('enchant')) {
      return 'magical_theory';
    }
    if (lower.includes('artifact') || lower.includes('item') || lower.includes('treasure')) {
      return 'artifacts';
    }
    if (lower.includes('book') || lower.includes('library') || lower.includes('scroll')) {
      return 'knowledge';
    }
    if (lower.includes('past') || lower.includes('before') || lower.includes('ancient')) {
      return 'history';
    }
    if (lower.includes('danger') || lower.includes('safe') || lower.includes('careful')) {
      return 'warnings';
    }

    return 'general';
  }

  private determineResponseType(
    intent: string,
    topic: string,
    context: ConversationContext,
  ): 'teaching' | 'testing' | 'revealing' | 'deflecting' | 'encouraging' {
    // High trust visitors get more revealing responses
    if (context.trust_level >= 7) {
      return 'revealing';
    }

    // Visitors asking questions about sensitive topics get tested first
    if (intent === 'question' && this.isSensitiveTopic(topic)) {
      return 'testing';
    }

    // Those seeking help get encouraging guidance
    if (intent === 'seek_help') {
      return 'encouraging';
    }

    // Boastful visitors might need gentle deflection or testing
    if (intent === 'boast') {
      return context.trust_level >= 5 ? 'teaching' : 'deflecting';
    }

    // Default to teaching mode for most interactions
    return 'teaching';
  }

  private isSensitiveTopic(topic: string): boolean {
    const sensitiveTopis = ['magical_theory', 'artifacts', 'tower_history', 'warnings'];
    return sensitiveTopis.includes(topic);
  }

  private craftResponse(
    responseType: string,
    topic: string,
    context: ConversationContext,
  ): WendellResponse {
    const templates = this.getResponseTemplates(responseType);
    const template = templates[Math.floor(Math.random() * templates.length)];

    let response: WendellResponse = {
      text: template,
      tone: this.getTone(responseType),
      includes_question: responseType === 'testing',
      knowledge_shared: [],
      trust_change: this.calculateTrustChange(responseType, context),
    };

    // Add topic-specific knowledge if appropriate
    if (responseType === 'revealing' || responseType === 'teaching') {
      response = this.addTopicKnowledge(response, topic, context);
    }

    // Add testing question if needed
    if (responseType === 'testing') {
      response = this.addTestingQuestion(response, context);
    }

    return response;
  }

  private getResponseTemplates(responseType: string): string[] {
    const templates: Record<string, string[]> = {
      teaching: [
        'Ah, you touch upon something quite significant. Let me share what I can...',
        "Indeed, that is worth discussing. In my years here, I've observed...",
        'You show wisdom in asking. Perhaps this perspective will help...',
      ],
      testing: [
        'Before I speak further on such matters, I must understand your perspective...',
        'Such knowledge requires careful consideration. Tell me...',
        'Interesting. But first, let me pose a question to you...',
      ],
      revealing: [
        "Your journey has shown me you're ready for deeper truths...",
        'Few visitors reach this level of understanding. Let me tell you...',
        "Since you've proven yourself thoughtful, I can share this...",
      ],
      deflecting: [
        'Patience, young seeker. All knowledge has its proper time...',
        'Such eagerness! But wisdom comes to those who earn it...',
        "Not all questions have simple answers, I'm afraid...",
      ],
      encouraging: [
        'Do not be discouraged. The tower tests all who enter...',
        "Your struggle shows you're on the right path. Consider this...",
        'Take heart. Even the greatest scholars faced such challenges...',
      ],
    };

    return templates[responseType] || templates.teaching;
  }

  private getTone(responseType: string): WendellResponse['tone'] {
    const toneMap: Record<string, WendellResponse['tone']> = {
      teaching: 'welcoming',
      testing: 'questioning',
      revealing: 'revealing',
      deflecting: 'cryptic',
      encouraging: 'welcoming',
    };

    return toneMap[responseType] || 'welcoming';
  }

  private calculateTrustChange(responseType: string, context: ConversationContext): number {
    // Trust changes based on response appropriateness and visitor actions
    if (responseType === 'revealing' && context.trust_level < 5) {
      return -1;
    } // Too early
    if (responseType === 'teaching' && context.knowledge_level === 'novice') {
      return 1;
    }
    if (responseType === 'testing') {
      return 0;
    } // Neutral until response

    return 0;
  }

  private addTopicKnowledge(
    response: WendellResponse,
    topic: string,
    context: ConversationContext,
  ): WendellResponse {
    const knowledgeMap: Record<string, string[]> = {
      tower_history: [
        'The tower was built in the Third Age',
        'Multiple civilizations have contributed to its construction',
      ],
      magical_theory: [
        'Magic here follows the principle of sympathetic resonance',
        'Artifacts amplify natural magical abilities',
      ],
      artifacts: [
        'Each artifact contains a fragment of the original enchantment',
        'They respond to worthy bearers',
      ],
      knowledge: [
        'This library contains works from twelve different magical traditions',
        'Some books write themselves',
      ],
      history: [
        'The tower has stood for over two millennia',
        'Many seekers have walked these halls',
      ],
      warnings: [
        'The deeper levels hold both great power and great danger',
        'Not all knowledge is meant for unprepared minds',
      ],
    };

    const knowledge = knowledgeMap[topic] || [];
    if (knowledge.length > 0 && context.trust_level >= 4) {
      response.knowledge_shared = [knowledge[Math.floor(Math.random() * knowledge.length)]];
    }

    return response;
  }

  private addTestingQuestion(
    response: WendellResponse,
    _context: ConversationContext,
  ): WendellResponse {
    const question = getRandomQuestion();
    response.text += ` ${question.question}`;
    response.includes_question = true;

    return response;
  }
}

export default WendellAI;
