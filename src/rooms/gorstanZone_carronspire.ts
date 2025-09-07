/*
  Gorstan – Interactive Game Framework
  Copyright © 2025 Geoff Webster. All Rights Reserved.

  This source code is proprietary and confidential.
  Unauthorised copying, distribution, modification, resale,
  reverse engineering, or use of this file, via any medium,
  is strictly prohibited without prior written consent
  from the copyright holder.

  Licensed access is granted only to authorised users who have
  purchased access to Gorstan through official channels.
  Such licence is strictly limited to running and playing the
  Gorstan game. No part of this source code may be used to
  create derivative works, other games, or redistributed in
  any form.

  Third-party libraries and assets are included under their
  respective licences as detailed in package.json and assets/.
*/

// Carron Spire - Ancient tower overlooking the Highland realm

import { Room } from '../types/Room';

const carronspire: Room = {
  id: 'carronspire',
  zone: 'gorstanZone',
  title: 'Carron Spire',
  description: [
    'You stand at the base of an ancient stone spire that rises majestically from the Highland moors. The weathered granite blocks tell stories of countless centuries, their surfaces carved with intricate Celtic knotwork and mystical symbols.',
    'The tower stretches impossibly high into the mist-shrouded sky, its peak lost among the swirling clouds. Narrow windows pierce the stone walls at regular intervals, some still glowing with an otherworldly light.',
    'Wild Highland heather grows in purple clusters around the spire\'s foundation, and the sound of distant pipes echoes from somewhere within the ancient structure. The air carries the scent of peat smoke and old magic.',
    'A heavy oak door, bound with iron and marked with protective runes, stands as the only visible entrance to this mysterious tower.',
  ],
  image: 'gorstanZone_carronspire.png',
  ambientAudio: 'highland_winds_mystical.mp3',

  consoleIntro: [
    '>> CARRON SPIRE - HIGHLAND ANCIENT MONUMENT',
    '>> Historical significance: MAXIMUM - Pre-Roman construction',
    '>> Magical resonance: DETECTED - Ancient ward network active',
    '>> Structural integrity: EXCELLENT - Mystical reinforcement present',
    '>> Access restrictions: MODERATE - Runic protection active',
    '>> Cultural value: SACRED - Highland clan heritage site',
    '>> Mystical energy: ELEVATED - Ley line convergence point',
    '>> Height: UNMEASURABLE - Extends beyond visible range',
    '>> Guardian presence: POSSIBLE - Celtic protector spirits',
    '>> Warning: Respect ancient traditions and customs',
  ],

  exits: {
    south: 'gorstanZone_gorstanhub',
    enter: 'gorstanZone_carronspire_interior',
    climb: 'gorstanZone_carronspire_upper',
    north: 'gorstanZone_heathermoors',
    west: 'gorstanZone_mistywaters',
  },

  items: [
    'ancient_stone_fragment',
    'highland_heather',
    'runic_inscription_rubbing',
    'carved_celtic_symbol',
    'mystical_moss',
    'weathered_granite_piece',
  ],

  interactables: {
    'oak_door': {
      description: 'A massive door made from ancient Highland oak, reinforced with iron bands and carved with protective runes.',
      actions: ['examine', 'knock', 'touch_runes', 'enter'],
      requires: [],
    },
    'celtic_carvings': {
      description: 'Intricate knotwork patterns and mystical symbols carved deep into the granite walls.',
      actions: ['examine', 'trace', 'copy', 'decipher'],
      requires: ['celtic_knowledge'],
    },
    'tower_windows': {
      description: 'Narrow openings in the stone walls, some glowing with mysterious inner light.',
      actions: ['examine', 'climb_to', 'peer_through'],
      requires: ['climbing_gear'],
    },
    'foundation_stones': {
      description: 'Massive granite blocks that form the base of the ancient spire.',
      actions: ['examine', 'search', 'feel_for_vibrations'],
      requires: [],
    },
    'heather_patches': {
      description: 'Wild Highland heather growing in colorful clusters around the tower base.',
      actions: ['examine', 'gather', 'smell'],
      requires: [],
    },
    'mystical_aura': {
      description: 'An almost tangible field of ancient magic that surrounds the entire spire.',
      actions: ['sense', 'attune', 'channel'],
      requires: ['magical_sensitivity'],
    },
  },

  npcs: [
    'highland_keeper',
    'mystical_guardian',
    'ancient_spirit',
  ],

  events: {
    onEnter: ['showSpireGrandeur', 'senseMysticalEnergy', 'hearDistantPipes'],
    onExit: ['recordSpireVisit', 'retainMysticalResonance'],
    onInteract: {
      oak_door: ['testRunicAccess', 'evaluateWorthy'],
      celtic_carvings: ['revealAncientKnowledge', 'activateMysticalResonance'],
      tower_windows: ['glimpseInteriorMysteries', 'senseWatchingPresence'],
      mystical_aura: ['attuneMagicalSenses', 'receiveAncientBlessings'],
    },
  },

  flags: {
    spireDiscovered: true,
    mysticalResonanceActive: true,
    ancientMagicPresent: true,
    celticRunesActive: true,
    guardianSpiritsAware: true,
    towerAccessEvaluated: false,
  },

  quests: {
    main: 'Gain Access to the Ancient Spire',
    optional: [
      'Decipher the Celtic Inscriptions',
      'Commune with Highland Spirits',
      'Gather Sacred Heather',
      'Understand the Mystical Aura',
      'Find the Tower Guardian',
    ],
  },

  environmental: {
    lighting: 'mystical_twilight_with_tower_glow',
    temperature: 'cool_highland_breeze',
    airQuality: 'crisp_mountain_air_with_magical_traces',
    soundscape: ['distant_bagpipes', 'wind_through_heather', 'mystical_humming', 'stone_resonance'],
    hazards: ['unstable_magic_surges', 'protective_ward_triggers', 'spiritual_challenges'],
  },

  security: {
    level: 'mystically_protected',
    accessRequirements: ['respect_for_ancient_ways', 'worthy_intentions'],
    alarmTriggers: ['disrespectful_behavior', 'malicious_intent', 'theft_attempts'],
    surveillanceActive: true,
    surveillanceType: 'spiritual_guardians',
  },

  metadata: {
    created: '2025-09-06',
    lastModified: '2025-09-06',
    author: 'Geoff',
    version: '1.0',
    playTested: false,
    difficulty: 'moderate',
    estimatedPlayTime: '10-15 minutes',
    keyFeatures: [
      'Ancient Highland atmosphere',
      'Celtic mysticism and lore',
      'Vertical exploration potential',
      'Mystical guardian interactions',
      'Sacred knowledge discovery',
    ],
  },

  secrets: {
    spireEntrance: {
      description: 'The proper way to gain respectful entry to the ancient tower',
      requirements: ['decipher celtic_carvings', 'commune with ancient_spirit', 'gather highland_heather'],
      rewards: ['tower_access', 'guardian_blessing'],
    },
    ancientKnowledge: {
      description: 'Celtic wisdom encoded in the tower\'s stone carvings',
      requirements: ['trace celtic_carvings', 'attune mystical_aura', 'highland_keeper trust'],
      rewards: ['celtic_language_skill', 'ancient_lore_knowledge'],
    },
    spiritCommunion: {
      description: 'Direct communication with the Highland guardian spirits',
      requirements: ['sense mystical_aura', 'respectful_behavior', 'sacred_offering'],
      rewards: ['spirit_ally', 'mystical_protection'],
    },
  },

  customActions: {
    'offering_ceremony': {
      description: 'Perform a traditional Highland offering to honor the ancient spirits',
      requirements: ['highland_heather', 'carved_celtic_symbol', 'respect_ancient_ways'],
      effects: ['gain_spirit_favor', 'unlock_tower_mysteries'],
    },
    'runic_meditation': {
      description: 'Study and meditate upon the protective runes carved into the door',
      requirements: ['celtic_knowledge', 'mystical_sensitivity', 'patient_contemplation'],
      effects: ['understand_ward_system', 'gain_runic_insights'],
    },
    'highland_song': {
      description: 'Join your voice with the distant pipes in ancient Highland melody',
      requirements: ['musical_ability', 'respect_for_traditions', 'highland_heritage'],
      effects: ['harmonize_with_spirits', 'unlock_musical_passages'],
    },
  },

  // Highland clan mechanics
  clanSystem: {
    affiliatedClan: 'Clan MacCarron',
    clanStanding: 'neutral',
    territorialRights: 'sacred_ground',
    clanQuests: ['prove_worthiness', 'honor_ancestors', 'protect_sacred_sites'],
  },

  // Celtic mysticism
  mysticalElements: {
    leyLineNode: true,
    sacredGeometry: 'spiral_patterns',
    seasonalEffects: ['samhain_enhancement', 'beltane_awakening'],
    druidicResonance: 'strong',
  },
};

export default carronspire;
