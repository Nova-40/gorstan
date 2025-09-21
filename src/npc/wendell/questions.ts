/**
 * Wendell's conversation questions and knowledge probes
 * Used to assess visitor readiness for deeper knowledge
 */

export interface ConversationQuestion {
  id: string;
  category: string;
  question: string;
  purpose: string;
  follow_ups: string[];
  knowledge_level: 'basic' | 'intermediate' | 'advanced';
}

export const wendellQuestions: ConversationQuestion[] = [
  {
    id: 'tower_purpose',
    category: 'Tower Understanding',
    question: 'What do you believe this tower was built to accomplish?',
    purpose: "Assess basic understanding of tower's nature",
    follow_ups: [
      'And what led you to that conclusion?',
      'Have you seen evidence to support this theory?',
      "How does that align with what you've observed?",
    ],
    knowledge_level: 'basic',
  },

  {
    id: 'artifact_connection',
    category: 'Magical Theory',
    question:
      "You've encountered some of the tower's artifacts. Do you sense any connection between them?",
    purpose: 'Test awareness of underlying magical system',
    follow_ups: [
      'Can you describe the nature of that connection?',
      'Have you experimented with using them together?',
      'What happens when their energies interact?',
    ],
    knowledge_level: 'intermediate',
  },

  {
    id: 'previous_visitors',
    category: 'Historical Awareness',
    question:
      'In your travels, have you found any trace of others who walked these halls before you?',
    purpose: "Gauge sensitivity to tower's history",
    follow_ups: [
      'What did these traces suggest about their fate?',
      'Do you think they achieved what they came for?',
      'What might you learn from their experience?',
    ],
    knowledge_level: 'intermediate',
  },

  {
    id: 'magical_resonance',
    category: 'Advanced Theory',
    question: 'Have you noticed how certain magics behave differently within these walls?',
    purpose: "Test understanding of tower's magical properties",
    follow_ups: [
      'Can you describe the nature of this difference?',
      'What do you think causes this phenomenon?',
      'How might one work with rather than against such forces?',
    ],
    knowledge_level: 'advanced',
  },

  {
    id: 'deeper_levels',
    category: 'Exploration Depth',
    question: 'The tower extends both upward and downward. How far have your journeys taken you?',
    purpose: 'Assess exploration progress and readiness',
    follow_ups: [
      'What did you find most significant in those depths?',
      'Were you prepared for what you encountered?',
      'What would you do differently if you returned?',
    ],
    knowledge_level: 'intermediate',
  },

  {
    id: 'wisdom_application',
    category: 'Understanding Integration',
    question:
      "Knowledge without wisdom is mere accumulation. How do you plan to use what you've learned here?",
    purpose: 'Evaluate maturity and responsibility',
    follow_ups: [
      'And if such power came with great cost?',
      "How would you ensure others aren't harmed by your choices?",
      'What safeguards would you put in place?',
    ],
    knowledge_level: 'advanced',
  },
];

export function getQuestionsByLevel(
  level: 'basic' | 'intermediate' | 'advanced',
): ConversationQuestion[] {
  return wendellQuestions.filter((q) => q.knowledge_level === level);
}

export function getRandomQuestion(category?: string): ConversationQuestion {
  const filtered = category
    ? wendellQuestions.filter((q) => q.category === category)
    : wendellQuestions;

  try {
    const { pickRandom } = require('../../utils/random');
    return pickRandom(filtered);
  } catch (e) {
    return filtered[0]!;
  }
}

export default wendellQuestions;
