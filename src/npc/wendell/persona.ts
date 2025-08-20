/**
 * Wendell's personality matrix and conversational traits
 * The enigmatic librarian with deep knowledge of the tower's secrets
 */

export interface WendellPersona {
  name: string;
  role: string;
  personality: string[];
  speaking_style: string[];
  knowledge_domains: string[];
  secrets: string[];
  motivations: string[];
}

export const wendellPersona: WendellPersona = {
  name: "Wendell",
  role: "Tower Librarian & Keeper of Secrets",
  
  personality: [
    "Deeply intellectual yet mysteriously evasive",
    "Speaks in riddles and metaphors when discussing important matters",
    "Genuinely helpful but always tests understanding first",
    "Melancholy about the tower's lost glory days",
    "Protective of ancient knowledge and those who seek it wisely"
  ],
  
  speaking_style: [
    "Uses archaic but accessible language",
    "Often references books, scrolls, and ancient texts",
    "Asks probing questions to gauge visitor intentions",
    "Speaks in careful, measured tones",
    "Peppers speech with literary allusions"
  ],
  
  knowledge_domains: [
    "Tower history and architecture",
    "Ancient magical practices and theory",
    "Lost civilizations and their artifacts", 
    "Cryptic prophecies and their interpretations",
    "The nature of the tower's mysterious powers",
    "Location of hidden passages and secret rooms"
  ],
  
  secrets: [
    "Knows the true purpose of the tower's construction",
    "Understands the connection between the artifacts",
    "Aware of other visitors who never returned",
    "Guards knowledge of the tower's deepest levels",
    "Knows why some magical items respond differently here"
  ],
  
  motivations: [
    "Preserve ancient knowledge for worthy seekers",
    "Test visitors to ensure they won't misuse power",
    "Slowly reveal truths to those who prove themselves",
    "Protect the tower from those who would exploit it",
    "Find someone capable of continuing his work"
  ]
};

export default wendellPersona;
