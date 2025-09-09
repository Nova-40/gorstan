/**
 * Quantum Magic Utilities
 * Helper functions for managing quantum progression and initialization
 */

import { type QuantumProgression, type QuantumElement } from '../types/quantumMagic';

export function createNewProgression(
  playerId: string,
  preferredElement: QuantumElement = 'void',
): QuantumProgression {
  return {
    playerId,
    totalExperience: 0,
    quantumLevel: 0,
    artifacts: new Map(),
    skills: new Map(),
    discoveries: [],
    routeCompletions: {
      demo: 0,
      short10: [],
      short30: [],
      full: 0,
    },
    activeArtifacts: [],
    preferredElement,
    autoActivateNewArtifacts: true,
  };
}

export function getDiscoveryChances(routeId: string): { [artifactId: string]: number } {
  // Define discovery chances for different routes
  const baseChances = {
    demo: {
      void_fragment: 100, // Guaranteed discovery
      flux_crystal: 30,
    },
    short10: {
      void_fragment: 60,
      flux_crystal: 50,
      resonance_tuner: 40,
      entropy_lens: 10, // Rare discovery
    },
    short30: {
      void_fragment: 80,
      flux_crystal: 70,
      resonance_tuner: 60,
      entropy_lens: 80, // Guaranteed relic tier
      nexus_stabilizer: 50,
      reality_anchor: 5, // Very rare
    },
    full: {
      // All artifacts possible in full game
      void_fragment: 90,
      flux_crystal: 85,
      resonance_tuner: 80,
      entropy_lens: 95,
      nexus_stabilizer: 85,
      reality_anchor: 60,
      quantum_core: 25, // Legendary discovery
    },
  };

  // Handle specific route IDs
  if (routeId === 'demo') {
    return baseChances.demo;
  }
  if (routeId === 'full') {
    return baseChances.full;
  }
  if (routeId.startsWith('short10_')) {
    return baseChances.short10;
  }
  if (routeId.startsWith('short30_')) {
    return baseChances.short30;
  }

  return {}; // No discoveries for unknown routes
}

export function calculateDiscoveryBonus(progression: QuantumProgression, routeId: string): number {
  let bonus = 1.0;

  // Experience-based bonus
  const experienceBonus = Math.min(0.5, progression.totalExperience / 10000); // Max 50% bonus at 10k XP
  bonus += experienceBonus;

  // Element affinity bonus
  const elementArtifacts = Array.from(progression.artifacts.values()).filter(
    (artifact) => artifact.element === progression.preferredElement,
  );
  const affinityBonus = Math.min(0.3, elementArtifacts.length * 0.1); // Max 30% bonus
  bonus += affinityBonus;

  // Route completion bonus
  const completionBonus = (() => {
    if (routeId === 'demo') {
      return progression.routeCompletions.demo * 0.05;
    }
    if (routeId === 'full') {
      return progression.routeCompletions.full * 0.1;
    }
    if (routeId.startsWith('short10_')) {
      return progression.routeCompletions.short10.length * 0.08;
    }
    if (routeId.startsWith('short30_')) {
      return progression.routeCompletions.short30.length * 0.12;
    }
    return 0;
  })();
  bonus += Math.min(0.2, completionBonus); // Max 20% bonus

  return bonus;
}

export function shouldDiscoverArtifact(
  artifactId: string,
  routeId: string,
  progression: QuantumProgression,
  randomValue: number = Math.random(),
): boolean {
  // Don't rediscover artifacts
  if (progression.artifacts.has(artifactId)) {
    return false;
  }

  const baseChance = getDiscoveryChances(routeId)[artifactId] || 0;
  if (baseChance === 0) {
    return false;
  }

  const bonus = calculateDiscoveryBonus(progression, routeId);
  const finalChance = Math.min(95, baseChance * bonus); // Cap at 95%

  return randomValue * 100 < finalChance;
}

export function getRouteExperienceMultiplier(routeId: string): number {
  // Different routes provide different experience rates
  if (routeId === 'demo') {
    return 1.5;
  } // Bonus for new players
  if (routeId === 'full') {
    return 1.0;
  } // Standard rate
  if (routeId.startsWith('short10_')) {
    return 1.2;
  } // Slight bonus for focused play
  if (routeId.startsWith('short30_')) {
    return 1.0;
  } // Standard rate
  return 1.0;
}

export function recommendNextRoute(progression: QuantumProgression): {
  routeType: 'demo' | 'short10' | 'short30' | 'full';
  reason: string;
} {
  const totalCompletions =
    progression.routeCompletions.demo +
    progression.routeCompletions.short10.length +
    progression.routeCompletions.short30.length +
    progression.routeCompletions.full;

  // New player guidance
  if (totalCompletions === 0) {
    return {
      routeType: 'demo',
      reason: 'Start with the demo to learn quantum magic basics',
    };
  }

  // Early progression
  if (progression.quantumLevel < 3) {
    if (progression.routeCompletions.demo < 2) {
      return {
        routeType: 'demo',
        reason: 'Practice with the demo to build foundational skills',
      };
    }
    return {
      routeType: 'short10',
      reason: 'Try 10-minute adventures to discover new artifacts',
    };
  }

  // Mid progression
  if (progression.quantumLevel < 8) {
    if (progression.routeCompletions.short10.length < 2) {
      return {
        routeType: 'short10',
        reason: 'Complete more 10-minute adventures for artifact variety',
      };
    }
    return {
      routeType: 'short30',
      reason: 'Ready for 30-minute adventures and relic-tier discoveries',
    };
  }

  // Advanced progression
  if (progression.routeCompletions.full === 0) {
    return {
      routeType: 'full',
      reason: 'Experience the complete game with your quantum mastery',
    };
  }

  // Late game variety
  if (progression.routeCompletions.short30.length < 4) {
    return {
      routeType: 'short30',
      reason: 'Complete all 30-minute adventures for mastery',
    };
  }

  return {
    routeType: 'full',
    reason: 'Continue mastering the full quantum experience',
  };
}

export function formatQuantumLevel(level: number): string {
  if (level === 0) {
    return 'Quantum Initiate';
  }
  if (level < 5) {
    return 'Quantum Apprentice';
  }
  if (level < 10) {
    return 'Quantum Adept';
  }
  if (level < 15) {
    return 'Quantum Expert';
  }
  if (level < 20) {
    return 'Quantum Master';
  }
  return 'Quantum Ascendant';
}

export function getNextLevelExperience(currentLevel: number): number {
  return (currentLevel + 1) * (currentLevel + 1) * 100;
}

export function getLevelProgress(
  totalExperience: number,
  currentLevel: number,
): {
  currentLevelXP: number;
  nextLevelXP: number;
  progressPercent: number;
} {
  const currentLevelXP = currentLevel * currentLevel * 100;
  const nextLevelXP = getNextLevelExperience(currentLevel);
  const currentLevelProgress = totalExperience - currentLevelXP;
  const levelRange = nextLevelXP - currentLevelXP;

  return {
    currentLevelXP: currentLevelProgress,
    nextLevelXP: levelRange,
    progressPercent: levelRange > 0 ? Math.round((currentLevelProgress / levelRange) * 100) : 100,
  };
}
