/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  Consolidated Demo Showcase - Master demo experience highlighting the best features
*/

import { clearDemo } from './demoRouter';
import { startTrialsOfGorstan } from './demoScripts/trialsOfGorstan';

export interface ShowcaseSegment {
  id: string;
  title: string;
  description: string;
  duration: number; // in seconds
  handler: () => Promise<void>;
  features: string[];
}

export const showcaseSegments: ShowcaseSegment[] = [
  {
    id: 'trials-enhanced',
    title: 'Enhanced Mushroom Field Trials',
    description: 'Experience the intense creature wave mechanics with strategic safety rocks',
    duration: 180, // 3 minutes
    handler: () => startTrialsOfGorstan(),
    features: ['Wave Combat', 'Strategic Planning', 'Enhanced AI', 'Visual Polish'],
  },
  {
    id: 'exploration-tour',
    title: 'Multiverse Exploration Tour',
    description: "Journey through Gorstan's diverse zones and meet memorable NPCs",
    duration: 240, // 4 minutes
    handler: () => runExplorationTour(),
    features: ['Rich Lore', 'NPC Interactions', 'Zone Variety', 'Narrative Depth'],
  },
  {
    id: 'puzzle-showcase',
    title: 'Puzzle and Mystery Showcase',
    description: 'Solve intricate puzzles and uncover hidden secrets',
    duration: 180, // 3 minutes
    handler: () => runPuzzleShowcase(),
    features: ['Logic Puzzles', 'Hidden Secrets', 'Problem Solving', 'Discovery'],
  },
  {
    id: 'social-drama',
    title: 'Social Dynamics & Drama',
    description: 'Navigate complex NPC relationships and moral choices',
    duration: 180, // 3 minutes
    handler: () => runSocialDrama(),
    features: ['Character Development', 'Moral Choices', 'Dialogue Trees', 'Consequences'],
  },
];

export async function startConsolidatedShowcase(): Promise<void> {
  console.log('[ConsolidatedShowcase] Starting comprehensive demo showcase...');

  try {
    await showIntroduction();

    for (let i = 0; i < showcaseSegments.length; i++) {
      const segment = showcaseSegments[i];
      await runShowcaseSegment(segment, i + 1);
    }

    await showConclusion();

    console.log('[ConsolidatedShowcase] Showcase completed successfully');
    setTimeout(() => {
      clearDemo();
      console.log('[ConsolidatedShowcase] Returning to Choose Your Adventure...');
    }, 3000);
  } catch (error) {
    console.error('[ConsolidatedShowcase] Showcase failed:', error);
    clearDemo();
    throw error;
  }
}

async function showIntroduction(): Promise<void> {
  return new Promise((resolve) => {
    console.log('════════════════════════════════════════════════');
    console.log('        🎮 GORSTAN: COMPREHENSIVE SHOWCASE 🎮');
    console.log('════════════════════════════════════════════════');
    console.log('');
    console.log('Welcome to the definitive Gorstan experience!');
    console.log('This showcase highlights the best features across all game modes:');
    console.log('');
    console.log('🦂 Enhanced Combat: Wave-based creature mechanics');
    console.log('🗺️  Rich Exploration: Diverse zones and memorable NPCs');
    console.log('🧩 Challenging Puzzles: Logic puzzles and hidden secrets');
    console.log('💬 Social Dynamics: Complex relationships and moral choices');
    console.log('');
    console.log('Each segment demonstrates core gameplay systems...');
    console.log('Prepare for your journey through the multiverse!');
    console.log('');

    setTimeout(() => {
      console.log('[Showcase] 🚀 Initializing showcase systems...');
      resolve();
    }, 3000);
  });
}

async function runShowcaseSegment(segment: ShowcaseSegment, index: number): Promise<void> {
  console.log('');
  console.log(`─────────────────────────────────────────────────`);
  console.log(`   SEGMENT ${index}: ${segment.title.toUpperCase()}`);
  console.log(`─────────────────────────────────────────────────`);
  console.log(segment.description);
  console.log('');
  console.log('✨ Featured Systems:');
  segment.features.forEach((feature) => {
    console.log(`   • ${feature}`);
  });
  console.log('');

  await segment.handler();

  console.log('');
  console.log(`✅ ${segment.title} demonstration complete!`);
  console.log('');
}

async function runExplorationTour(): Promise<void> {
  return new Promise((resolve) => {
    console.log('🗺️  [Exploration] Welcome to the Multiverse Tour!');
    console.log('');

    const zones = [
      {
        name: 'Control Nexus',
        theme: 'Technology & Mystery',
        highlight: 'Hidden laboratory beneath command chair',
      },
      {
        name: 'Elfhame Realm',
        theme: 'Fantasy & Magic',
        highlight: 'Ancient fae magic and mystical creatures',
      },
      {
        name: 'Stanton Village',
        theme: 'Culture & History',
        highlight: 'Local folklore and community spirit',
      },
      {
        name: 'Glitch Zone',
        theme: 'Reality Distortion',
        highlight: 'Temporal anomalies and dimension shifts',
      },
    ];

    let zoneIndex = 0;

    function exploreNextZone() {
      if (zoneIndex >= zones.length) {
        console.log('🎯 [Exploration] Multiverse tour complete!');
        console.log("You've experienced the breadth of Gorstan's rich world...");
        resolve();
        return;
      }

      const zone = zones[zoneIndex];
      console.log(`🌟 Entering ${zone.name}...`);
      console.log(`   Theme: ${zone.theme}`);
      console.log(`   Highlight: ${zone.highlight}`);
      console.log('');

      // Simulate zone-specific interactions
      setTimeout(() => {
        switch (zone.name) {
          case 'Control Nexus':
            console.log('🔬 You discover the hidden laboratory! Advanced technology awaits...');
            break;
          case 'Elfhame Realm':
            console.log('🧚 Ancient magic flows through crystalline trees and glowing lakes...');
            break;
          case 'Stanton Village':
            console.log('🏘️  Villagers share tales of local legends and community traditions...');
            break;
          case 'Glitch Zone':
            console.log('⚡ Reality flickers! You witness echoes of other timelines...');
            break;
        }

        zoneIndex++;
        setTimeout(exploreNextZone, 1500);
      }, 1500);
    }

    exploreNextZone();
  });
}

async function runPuzzleShowcase(): Promise<void> {
  return new Promise((resolve) => {
    console.log('🧩 [Puzzle] Welcome to the Puzzle & Mystery Showcase!');
    console.log('');

    const puzzles = [
      {
        name: 'Rune Cipher Chamber',
        type: 'Logic Puzzle',
        description: 'Ancient glyphs hold the key to unlocking forgotten knowledge',
        solution: 'Pattern recognition and symbol translation',
      },
      {
        name: 'Mirror Lake Riddle',
        type: 'Environmental Puzzle',
        description: 'Reflections reveal hidden truths beneath the surface',
        solution: 'Perspective shifts and hidden object detection',
      },
      {
        name: 'Temporal Junction Puzzle',
        type: 'Time Mechanics',
        description: 'Navigate timeline branches to find the correct path',
        solution: 'Cause-effect understanding and temporal logic',
      },
    ];

    let puzzleIndex = 0;

    function solveNextPuzzle() {
      if (puzzleIndex >= puzzles.length) {
        console.log('🎯 [Puzzle] All mysteries solved!');
        console.log('Your analytical skills have been thoroughly tested...');
        resolve();
        return;
      }

      const puzzle = puzzles[puzzleIndex];
      console.log(`🔍 Puzzle: ${puzzle.name}`);
      console.log(`   Type: ${puzzle.type}`);
      console.log(`   Challenge: ${puzzle.description}`);
      console.log('');

      setTimeout(() => {
        console.log('💡 Analyzing clues...');
        setTimeout(() => {
          console.log(`✅ Solution found! ${puzzle.solution}`);
          console.log('🌟 Hidden secrets revealed!');
          console.log('');

          puzzleIndex++;
          setTimeout(solveNextPuzzle, 1500);
        }, 1000);
      }, 1500);
    }

    solveNextPuzzle();
  });
}

async function runSocialDrama(): Promise<void> {
  return new Promise((resolve) => {
    console.log('💬 [Social] Welcome to Social Dynamics & Drama!');
    console.log('');

    const scenarios = [
      {
        title: "The Merchant's Dilemma",
        context: 'A desperate trader offers a suspicious deal',
        choice: 'Trust vs. Caution',
        outcome: 'Your choice affects future merchant relationships',
      },
      {
        title: "The Scholar's Secret",
        context: 'An NPC reveals forbidden knowledge that could help or harm',
        choice: 'Knowledge vs. Ignorance',
        outcome: 'Information shapes your understanding of the world',
      },
      {
        title: "The Guardian's Test",
        context: 'A powerful entity challenges your moral convictions',
        choice: 'Principle vs. Pragmatism',
        outcome: 'Your values determine access to hidden areas',
      },
    ];

    let scenarioIndex = 0;

    function playNextScenario() {
      if (scenarioIndex >= scenarios.length) {
        console.log('🎯 [Social] Character development complete!');
        console.log('Your choices have shaped your journey through Gorstan...');
        resolve();
        return;
      }

      const scenario = scenarios[scenarioIndex];
      console.log(`🎭 Scenario: ${scenario.title}`);
      console.log(`   Context: ${scenario.context}`);
      console.log(`   Decision: ${scenario.choice}`);
      console.log('');

      setTimeout(() => {
        console.log('🤔 Considering your options...');
        setTimeout(() => {
          console.log('⚖️  You make a choice that reflects your values...');
          console.log(`📖 Consequence: ${scenario.outcome}`);
          console.log('🌱 Character growth achieved!');
          console.log('');

          scenarioIndex++;
          setTimeout(playNextScenario, 1500);
        }, 1000);
      }, 1500);
    }

    playNextScenario();
  });
}

async function showConclusion(): Promise<void> {
  return new Promise((resolve) => {
    console.log('════════════════════════════════════════════════');
    console.log('         🎉 SHOWCASE COMPLETE! 🎉');
    console.log('════════════════════════════════════════════════');
    console.log('');
    console.log("You've experienced the full spectrum of Gorstan's features:");
    console.log('');
    console.log('✅ Combat Systems: Enhanced creature waves & strategic gameplay');
    console.log('✅ World Building: Rich zones with diverse themes & atmosphere');
    console.log('✅ Puzzle Design: Logic challenges & environmental mysteries');
    console.log('✅ Character Drama: Complex NPCs & meaningful choices');
    console.log('');
    console.log('🌟 Ready to dive deeper into the full Gorstan experience?');
    console.log('🚀 Choose your adventure and begin your own unique journey!');
    console.log('');
    console.log('Thank you for experiencing the best of Gorstan! 🎮');

    setTimeout(resolve, 3000);
  });
}

// Export for use in demo router
export { startConsolidatedShowcase as startMasterShowcase };
