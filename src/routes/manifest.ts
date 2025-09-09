/**
 * Route Manifests
 * Defines all available game routes with their configurations
 */

import { type RouteManifest } from '../types/routes';

// Demo Route - 5-7 minute guided experience
export const demoRoute: RouteManifest = {
  id: 'demo',
  label: 'Demo Experience',
  targetMinutes: 10,
  description:
    'A guided 5-7 minute slice of Gorstan with strong hints and an artifact teaser. Perfect for newcomers.',
  hintPolicy: 'guided',
  difficulty: 'story',
  allowedSkips: 3,
  enableFastTravel: false,
  nodes: [
    {
      id: 'demo_welcome',
      type: 'cinematic',
      required: true,
      pauseOnModal: true,
    },
    {
      id: 'demo_basic_movement',
      type: 'travel',
      required: true,
    },
    {
      id: 'demo_first_puzzle',
      type: 'logicPuzzle',
      required: true,
      difficulty: 'easy',
      pauseOnModal: true,
    },
    {
      id: 'demo_npc_interaction',
      type: 'quest',
      required: true,
    },
    {
      id: 'demo_shadow_encounter',
      type: 'combat',
      required: false,
      difficulty: 'easy',
    },
    {
      id: 'demo_artifact_reveal',
      type: 'cinematic',
      required: true,
      pauseOnModal: true,
    },
  ],
};

// Short 10-minute Adventures
export const short10Routes: RouteManifest[] = [
  {
    id: 'short10_runesprint',
    label: 'Rune Sprint',
    targetMinutes: 10,
    description:
      'Race through ancient rune chambers, solving glyph puzzles and evading shadow guardians.',
    hintPolicy: 'timed',
    difficulty: 'normal',
    allowedSkips: 1,
    enableFastTravel: true,
    nodes: [
      {
        id: 'runesprint_entrance',
        type: 'travel',
        required: true,
      },
      {
        id: 'runesprint_glyph_puzzle_1',
        type: 'logicPuzzle',
        required: true,
        difficulty: 'easy',
        pauseOnModal: true,
      },
      {
        id: 'runesprint_shadow_chase',
        type: 'combat',
        required: true,
        difficulty: 'medium',
      },
      {
        id: 'runesprint_rune_chamber',
        type: 'quest',
        required: true,
      },
      {
        id: 'runesprint_final_puzzle',
        type: 'logicPuzzle',
        required: true,
        difficulty: 'medium',
        pauseOnModal: true,
      },
      {
        id: 'runesprint_escape',
        type: 'travel',
        required: true,
      },
    ],
  },
  {
    id: 'short10_catacombdash',
    label: 'Catacomb Dash',
    targetMinutes: 10,
    description:
      'Navigate winding catacombs using stealth and wit to avoid ancient traps and guardians.',
    hintPolicy: 'timed',
    difficulty: 'normal',
    allowedSkips: 1,
    enableFastTravel: true,
    nodes: [
      {
        id: 'catacomb_entry',
        type: 'travel',
        required: true,
      },
      {
        id: 'catacomb_stealth_section',
        type: 'quest',
        required: true,
      },
      {
        id: 'catacomb_trap_puzzle',
        type: 'logicPuzzle',
        required: true,
        difficulty: 'easy',
        pauseOnModal: true,
      },
      {
        id: 'catacomb_guardian_encounter',
        type: 'combat',
        required: true,
        difficulty: 'medium',
      },
      {
        id: 'catacomb_treasure_chamber',
        type: 'quest',
        required: true,
      },
      {
        id: 'catacomb_exit',
        type: 'travel',
        required: true,
      },
    ],
  },
  {
    id: 'short10_faegladerelay',
    label: 'Fae Glade Relay',
    targetMinutes: 10,
    description:
      'Complete a series of fae challenges in an enchanted glade, earning magical insights.',
    hintPolicy: 'timed',
    difficulty: 'normal',
    allowedSkips: 1,
    enableFastTravel: false,
    nodes: [
      {
        id: 'faeglade_entrance',
        type: 'cinematic',
        required: true,
        pauseOnModal: true,
      },
      {
        id: 'faeglade_riddle_challenge',
        type: 'logicPuzzle',
        required: true,
        difficulty: 'medium',
        pauseOnModal: true,
      },
      {
        id: 'faeglade_nature_trial',
        type: 'quest',
        required: true,
      },
      {
        id: 'faeglade_sprite_duel',
        type: 'combat',
        required: false,
        difficulty: 'easy',
      },
      {
        id: 'faeglade_blessing',
        type: 'cinematic',
        required: true,
        pauseOnModal: true,
      },
    ],
  },
  {
    id: 'short10_trialsofgorstan',
    label: 'Trials of Gorstan',
    targetMinutes: 10,
    description:
      'Navigate three perilous zones ending with a mystical cave maze to find the hidden artifact.',
    hintPolicy: 'timed',
    difficulty: 'normal',
    allowedSkips: 1,
    enableFastTravel: false,
    nodes: [
      {
        id: 'trials_rockfield',
        type: 'quest',
        required: true,
      },
      {
        id: 'trials_mushroomfield',
        type: 'quest',
        required: true,
      },
      {
        id: 'trials_streamreset',
        type: 'cinematic',
        required: true,
        pauseOnModal: true,
      },
      {
        id: 'trials_cavemaze',
        type: 'logicPuzzle',
        required: true,
        difficulty: 'medium',
        pauseOnModal: true,
      },
    ],
  },
];

// Short 30-minute Adventures
export const short30Routes: RouteManifest[] = [
  {
    id: 'short30_trentparkrecon',
    label: 'Trent Park Reconnaissance',
    targetMinutes: 30,
    description:
      'Investigate mysterious happenings in Trent Park, gathering intel and magical artifacts.',
    hintPolicy: 'timed',
    difficulty: 'normal',
    allowedSkips: 2,
    enableFastTravel: true,
    nodes: [
      {
        id: 'trentpark_briefing',
        type: 'cinematic',
        required: true,
        pauseOnModal: true,
      },
      {
        id: 'trentpark_initial_recon',
        type: 'travel',
        required: true,
      },
      {
        id: 'trentpark_witness_interview',
        type: 'quest',
        required: true,
      },
      {
        id: 'trentpark_logic_deduction',
        type: 'logicPuzzle',
        required: true,
        difficulty: 'medium',
        pauseOnModal: true,
      },
      {
        id: 'trentpark_shadow_patrol',
        type: 'combat',
        required: true,
        difficulty: 'medium',
      },
      {
        id: 'trentpark_artifact_search',
        type: 'quest',
        required: true,
      },
      {
        id: 'trentpark_complex_puzzle',
        type: 'logicPuzzle',
        required: true,
        difficulty: 'hard',
        pauseOnModal: true,
      },
      {
        id: 'trentpark_boss_encounter',
        type: 'combat',
        required: true,
        difficulty: 'hard',
      },
      {
        id: 'trentpark_intel_compilation',
        type: 'quest',
        required: true,
      },
      {
        id: 'trentpark_extraction',
        type: 'travel',
        required: true,
      },
    ],
  },
  {
    id: 'short30_controlnexusgauntlet',
    label: 'Control Nexus Gauntlet',
    targetMinutes: 30,
    description:
      'Infiltrate and neutralize a control nexus through stealth, puzzles, and tactical combat.',
    hintPolicy: 'off',
    difficulty: 'veteran',
    allowedSkips: 1,
    enableFastTravel: false,
    nodes: [
      {
        id: 'nexus_insertion',
        type: 'travel',
        required: true,
      },
      {
        id: 'nexus_security_bypass',
        type: 'logicPuzzle',
        required: true,
        difficulty: 'hard',
        pauseOnModal: true,
      },
      {
        id: 'nexus_stealth_infiltration',
        type: 'quest',
        required: true,
      },
      {
        id: 'nexus_guardian_combat',
        type: 'combat',
        required: true,
        difficulty: 'hard',
      },
      {
        id: 'nexus_core_puzzle',
        type: 'logicPuzzle',
        required: true,
        difficulty: 'expert',
        pauseOnModal: true,
      },
      {
        id: 'nexus_countermeasures',
        type: 'quest',
        required: true,
      },
      {
        id: 'nexus_final_confrontation',
        type: 'combat',
        required: true,
        difficulty: 'expert',
      },
      {
        id: 'nexus_shutdown_sequence',
        type: 'quest',
        required: true,
      },
      {
        id: 'nexus_extraction',
        type: 'travel',
        required: true,
      },
    ],
  },
  {
    id: 'short30_glitchrealmheist',
    label: 'Glitch Realm Heist',
    targetMinutes: 30,
    description:
      'Execute a daring heist in the unstable Glitch Realm, where reality bends and logic breaks.',
    hintPolicy: 'guided',
    difficulty: 'story',
    allowedSkips: 3,
    enableFastTravel: true,
    nodes: [
      {
        id: 'glitch_preparation',
        type: 'cinematic',
        required: true,
        pauseOnModal: true,
      },
      {
        id: 'glitch_realm_entry',
        type: 'travel',
        required: true,
      },
      {
        id: 'glitch_reality_puzzle_1',
        type: 'logicPuzzle',
        required: true,
        difficulty: 'medium',
        pauseOnModal: true,
      },
      {
        id: 'glitch_navigation_challenge',
        type: 'quest',
        required: true,
      },
      {
        id: 'glitch_entity_encounter',
        type: 'combat',
        required: false,
        difficulty: 'medium',
      },
      {
        id: 'glitch_vault_infiltration',
        type: 'quest',
        required: true,
      },
      {
        id: 'glitch_reality_puzzle_2',
        type: 'logicPuzzle',
        required: true,
        difficulty: 'hard',
        pauseOnModal: true,
      },
      {
        id: 'glitch_security_system',
        type: 'quest',
        required: true,
      },
      {
        id: 'glitch_guardian_boss',
        type: 'combat',
        required: true,
        difficulty: 'hard',
      },
      {
        id: 'glitch_escape_sequence',
        type: 'travel',
        required: true,
      },
    ],
  },
  {
    id: 'short30_faebargain',
    label: 'The Fae Bargain',
    targetMinutes: 30,
    description:
      'Navigate complex negotiations with the fae court, balancing wit, diplomacy, and magical power.',
    hintPolicy: 'timed',
    difficulty: 'normal',
    allowedSkips: 2,
    enableFastTravel: false,
    nodes: [
      {
        id: 'fae_court_arrival',
        type: 'cinematic',
        required: true,
        pauseOnModal: true,
      },
      {
        id: 'fae_court_etiquette',
        type: 'quest',
        required: true,
      },
      {
        id: 'fae_riddle_challenge',
        type: 'logicPuzzle',
        required: true,
        difficulty: 'medium',
        pauseOnModal: true,
      },
      {
        id: 'fae_negotiation_round_1',
        type: 'quest',
        required: true,
      },
      {
        id: 'fae_trial_by_combat',
        type: 'combat',
        required: false,
        difficulty: 'medium',
      },
      {
        id: 'fae_wisdom_test',
        type: 'logicPuzzle',
        required: true,
        difficulty: 'hard',
        pauseOnModal: true,
      },
      {
        id: 'fae_final_negotiation',
        type: 'quest',
        required: true,
      },
      {
        id: 'fae_bargain_consequences',
        type: 'cinematic',
        required: true,
        pauseOnModal: true,
      },
    ],
  },
];

// Full Game Route - unchanged solvability
export const fullRoute: RouteManifest = {
  id: 'full',
  label: 'Full Game Experience',
  targetMinutes: 999, // No time limit
  description:
    'The complete Gorstan adventure with all original puzzles, quests, and story elements.',
  hintPolicy: 'timed',
  difficulty: 'normal',
  allowedSkips: 0,
  enableFastTravel: true,
  nodes: [
    // This would contain all the existing game nodes
    // Preserving the canonical route with unchanged solvability
    {
      id: 'game_start',
      type: 'cinematic',
      required: true,
      pauseOnModal: true,
    },
    {
      id: 'tutorial_introduction',
      type: 'quest',
      required: true,
    },
    {
      id: 'first_room_exploration',
      type: 'travel',
      required: true,
    },
    // ... (all existing game content would be mapped here)
    {
      id: 'artifact_progression',
      type: 'quest',
      required: true,
    },
    {
      id: 'entity_encounter',
      type: 'combat',
      required: true,
      difficulty: 'expert',
    },
    {
      id: 'stanton_harcourt_epilogue',
      type: 'cinematic',
      required: true,
      pauseOnModal: true,
    },
  ],
};

// Export all routes
export const allRoutes: RouteManifest[] = [
  demoRoute,
  ...short10Routes,
  ...short30Routes,
  fullRoute,
];

// Helper functions
export function getRouteById(id: string): RouteManifest | undefined {
  return allRoutes.find((route) => route.id === id);
}

export function getRoutesByCategory() {
  return {
    demo: [demoRoute],
    short10: short10Routes,
    short30: short30Routes,
    full: [fullRoute],
  };
}
