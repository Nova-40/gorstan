/**
 * Artifact Arc Data
 * Story content, lore entries, and discovery narratives for quantum artifacts
 */

import {
  type ArtifactLoreEntry,
  type DiscoveryNarrative,
  type ArtifactVision,
  type ArtifactEvolution,
  type ArtifactArcConfig,
} from '../types/artifactArc';

// Artifact Lore Entries
export const ARTIFACT_LORE: Record<string, ArtifactLoreEntry[]> = {
  void_fragment: [
    {
      id: 'void_fragment_origin_1',
      artifactId: 'void_fragment',
      arc: 'origin',
      style: 'historical',
      title: 'The First Void',
      content: `Before reality solidified into its current form, there existed spaces between existence—pockets of pure potential where the fundamental forces had not yet chosen their paths. The Void Fragments are crystallized remnants of these primordial spaces, each one a tiny piece of the universe's first thoughts.

The ancient texts speak of the "Silent Architects," beings who existed in the time before time, who gathered these fragments not for power, but for remembrance. They understood that within each fragment lay the memory of infinite possibility—every choice unmade, every path untaken.

When reality finally chose its form, these fragments were scattered across dimensions, waiting to remind future travelers that even in a world of fixed laws, the void between thoughts remains malleable.`,
      unlockConditions: {
        artifactLevel: 1,
        experienceThreshold: 0,
      },
      metadata: {
        author: 'Archive of the Silent Architects',
        timestamp: 'Before the First Age',
        location: 'The Space Between Spaces',
        discoveryMethod: 'Quantum resonance scanning',
        significance: 'critical',
      },
    },
    {
      id: 'void_fragment_discovery_1',
      artifactId: 'void_fragment',
      arc: 'discovery',
      style: 'personal',
      title: 'First Touch',
      content: `The moment I first held the Void Fragment, I understood silence in a way I never had before. Not the absence of sound, but the presence of everything that could be but isn't. 

It was cold—not the cold of winter, but the cold of space between stars. And yet, when I focused on it, warmth spread through my thoughts like the memory of a fire I'd never seen but somehow knew.

The fragment doesn't speak. It listens. It remembers every possibility I've ever considered and forgotten, every dream I've abandoned, every choice I've made and unmade in my mind. It holds them all, patient and eternal.

Sometimes, when I'm very still, I can feel it offering me glimpses of what might have been. Not regret—never regret—but wonder at the infinite branches of existence.`,
      unlockConditions: {
        artifactLevel: 1,
        usageCount: 5,
      },
      metadata: {
        author: 'Personal Journal Entry',
        discoveryMethod: 'Direct experience',
        significance: 'high',
      },
    },
    {
      id: 'void_fragment_mastery_1',
      artifactId: 'void_fragment',
      arc: 'mastery',
      style: 'scientific',
      title: 'Quantum Void Dynamics',
      content: `Research Log #47: After extensive testing, I've confirmed that Void Fragments operate on principles of quantum potential maintenance. Unlike other quantum artifacts that manipulate existing forces, Void Fragments preserve states of non-existence.

Key discoveries:
- Fragments exhibit inverse entropy behavior when exposed to decision points
- Quantum field measurements show consistent "null resonance" at 0.00 Hz
- Subjects report enhanced intuition when carrying fragments during problem-solving tasks
- No observable degradation over extended periods of use

The most fascinating aspect is the fragment's apparent ability to "remember" quantum states that were never actualized. This suggests a form of meta-quantum storage that exists outside our normal space-time framework.

Further research needed into potential applications for possibility navigation and alternate timeline perception.`,
      unlockConditions: {
        artifactLevel: 2,
        experienceThreshold: 500,
      },
      metadata: {
        author: 'Dr. Sarah Chen, Quantum Research Division',
        discoveryMethod: 'Scientific analysis',
        significance: 'high',
      },
    },
  ],

  flux_crystal: [
    {
      id: 'flux_crystal_origin_1',
      artifactId: 'flux_crystal',
      arc: 'origin',
      style: 'mystical',
      title: 'Rivers of Change',
      content: `In the early days, when the cosmos was still learning to be, there existed currents of pure change—streams of transformation that flowed between what is and what could become. The Flux Crystals formed at the confluence of these streams, where the force of change itself crystallized into solid form.

The Wanderer Sages, those who walked between worlds, called them "River Stones of Becoming." They understood that change itself could be captured, stored, and guided—not to control fate, but to dance with it more gracefully.

Each crystal contains within it the essence of a thousand transformations: the moment a seed becomes a tree, the instant a thought becomes action, the heartbeat between fear and courage. They do not create change—they are change, given form and purpose.

Legend speaks of a great Crystal Garden where all the flux crystals once grew together, singing harmonies of perpetual transformation. Though the garden is lost, its children remain, carrying forward the eternal song of becoming.`,
      unlockConditions: {
        artifactLevel: 1,
        experienceThreshold: 0,
      },
      metadata: {
        author: 'The Wanderer Sages',
        timestamp: 'The Age of Flowing',
        location: 'The Crystal Garden of Becoming',
        discoveryMethod: 'Ancient chronicles',
        significance: 'critical',
      },
    },
    {
      id: 'flux_crystal_awakening_1',
      artifactId: 'flux_crystal',
      arc: 'awakening',
      style: 'personal',
      title: 'The Crystal Speaks',
      content: `Today the crystal spoke to me—not in words, but in feelings of movement and flow. I was stuck on a puzzle, my mind locked in familiar patterns, when I felt a gentle pulse from the crystal at my side.

"Flow around the obstacle," it seemed to say, "like water finding its path."

I realized then that the crystal wasn't just a tool—it was a teacher. It had been watching me, learning my habits, understanding where I get stuck and where I soar. The pulse wasn't random; it was perfectly timed guidance.

When I followed its suggestion and approached the puzzle from a completely different angle, the solution became clear immediately. But more than that, I felt the crystal's satisfaction—a warm, approving glow that spoke of partnership rather than possession.

I'm beginning to understand that I don't just carry this crystal. We carry each other, flowing together toward something greater than either of us could reach alone.`,
      unlockConditions: {
        artifactLevel: 3,
        timeWithArtifact: 86400000, // 24 hours
        usageCount: 20,
      },
      metadata: {
        author: 'Personal Journal Entry',
        discoveryMethod: 'Bonding experience',
        significance: 'high',
      },
    },
  ],

  resonance_tuner: [
    {
      id: 'resonance_tuner_origin_1',
      artifactId: 'resonance_tuner',
      arc: 'origin',
      style: 'scientific',
      title: 'Harmonic Genesis',
      content: `The Resonance Tuners were born from the universe's first attempt to understand itself. In the moments after the initial expansion, when space itself was still deciding its dimensions, frequency patterns emerged that could map the underlying harmonic structure of reality.

These patterns crystallized into devices of impossible precision—instruments that could not only detect the fundamental frequencies of existence but also adjust them with surgical accuracy. The Builders, a civilization that existed when the universe was young, recognized their significance immediately.

Unlike other quantum artifacts that work through force or manipulation, Resonance Tuners operate through understanding. They teach their users to perceive the hidden rhythms that connect all things: the resonance between thought and reality, between intention and manifestation, between individual consciousness and cosmic harmony.

Each tuner contains within it a complete map of universal frequencies, constantly updating itself as reality evolves and grows more complex. They are not merely tools—they are the universe's gift to itself, a way for existence to fine-tune its own song.`,
      unlockConditions: {
        artifactLevel: 1,
        experienceThreshold: 0,
      },
      metadata: {
        author: 'Archive of the Builders',
        timestamp: 'The First Resonance',
        location: 'The Harmonic Observatory',
        discoveryMethod: 'Frequency analysis',
        significance: 'critical',
      },
    },
    {
      id: 'resonance_tuner_mastery_1',
      artifactId: 'resonance_tuner',
      arc: 'mastery',
      style: 'mystical',
      title: 'The Universal Symphony',
      content: `To master the Resonance Tuner is to become a conductor of reality's orchestra. After months of practice, I can finally hear what the ancients called the Universal Symphony—the background harmony that underlies all existence.

Every person has their own frequency, their own note in the cosmic composition. Every place, every moment, every thought adds its voice to the eternal song. The tuner doesn't create harmony—it reveals the harmony that was always there, hidden beneath the noise of everyday existence.

When I touch the tuner to a problem that seems impossible, I can hear its discordant frequency clashing with the harmony around it. The solution isn't to force it into submission, but to gently adjust its frequency until it finds its proper place in the symphony.

People I meet now seem drawn to me in unexpected ways. Not because I'm manipulating them, but because the tuner helps me find my own true frequency—and when you sing your authentic note, others naturally harmonize with you.

I understand now why the ancients called this mastery "Becoming the Bridge." The tuner teaches you to be the connection between all things, the resonance that helps the universe remember its own perfect pitch.`,
      unlockConditions: {
        artifactLevel: 4,
        experienceThreshold: 1500,
        otherArtifacts: ['flux_crystal'],
      },
      metadata: {
        author: 'Master Resonant Keela Varn',
        discoveryMethod: 'Deep meditation practice',
        significance: 'critical',
      },
    },
  ],

  entropy_lens: [
    {
      id: 'entropy_lens_origin_1',
      artifactId: 'entropy_lens',
      arc: 'origin',
      style: 'cautionary',
      title: 'The Price of Sight',
      content: `The Entropy Lenses were not created—they were discovered, and their discovery marked the beginning of the end for the Observers, a race that sought to see all possible futures simultaneously.

These beings, in their infinite curiosity, pierced the veil between order and chaos, between what is and what will be. They found the spaces where entropy itself could be observed, measured, and understood. But in looking too deeply into the nature of decay and dissolution, they became trapped by their own vision.

The lenses formed naturally in the aftermath of their transcendence—or destruction, depending on one's perspective. Each lens contains not just the ability to see entropy, but the accumulated wisdom and warning of beings who saw too much.

"To see the end is to hasten it," reads the final entry in their archives. "To understand decay is to invite it. Yet without this sight, how can one hope to tend the garden of existence?"

The lenses remain as both gift and curse—invaluable tools for those who would understand the deeper patterns of reality, but dangerous beyond measure for those unprepared for the weight of such knowledge.`,
      unlockConditions: {
        artifactLevel: 1,
        experienceThreshold: 0,
      },
      metadata: {
        author: 'The Final Observer',
        timestamp: 'The Last Sight',
        location: 'The Observatory of Endings',
        discoveryMethod: 'Archaeological discovery',
        significance: 'critical',
      },
    },
    {
      id: 'entropy_lens_discovery_1',
      artifactId: 'entropy_lens',
      arc: 'discovery',
      style: 'cautionary',
      title: 'First Glimpse',
      content: `I should have listened to the warnings carved into the chamber where I found it. "Look not too long into the lens of endings, lest you see your own."

But curiosity won, as it always does. The first time I peered through the Entropy Lens, I saw the dust that everything would become. The walls around me showed their slow decay, the air revealed its gradual dispersal, and in my own reflection, I glimpsed the timeline of my mortality.

It was terrifying and beautiful in equal measure. To see the end of things is not to see failure—it's to see completion, the natural conclusion of every story. The lens doesn't show doom; it shows the full cycle, from beginning to end to new beginning.

But the weight of such sight is immense. Once you've seen the entropy patterns that govern everything, you can never again live in innocent ignorance. Every moment becomes precious because you understand its finite nature. Every choice matters because you can see its consequences rippling through time.

The lens is teaching me to hold both birth and death in the same thought, to love things more deeply because I understand their temporary nature. It's a hard wisdom, but perhaps the most important one of all.`,
      unlockConditions: {
        artifactLevel: 2,
        usageCount: 10,
        experienceThreshold: 300,
      },
      metadata: {
        author: 'Personal Journal Entry',
        discoveryMethod: 'Direct experience',
        significance: 'high',
      },
    },
  ],

  nexus_stabilizer: [
    {
      id: 'nexus_stabilizer_origin_1',
      artifactId: 'nexus_stabilizer',
      arc: 'origin',
      style: 'historical',
      title: 'The Great Convergence',
      content: `In the Third Age of quantum development, when reality itself had grown unstable from too many competing forces, the Stabilizers emerged as necessity born from chaos. The great quantum storms had begun—cascading failures where multiple realities would briefly overlap, creating zones of impossible physics and temporal paradox.

The Architects of that age, faced with the possible unraveling of existence itself, created the Nexus Stabilizers not as weapons or tools, but as anchors. Each one was designed to serve as a fixed point around which reality could reorganize itself, a calm center in the storm of quantum uncertainty.

The process of creating even one Stabilizer required the voluntary sacrifice of an entire city's worth of quantum researchers, who merged their consciousness with the device to give it the stability of unified purpose. Their minds still reside within each Stabilizer, working eternally to maintain the delicate balance between order and chaos.

"We become the stillness at the heart of the storm," wrote the First Anchor before the merge. "Not to stop the dance of existence, but to give it a steady rhythm by which it can remember its steps."

Each Stabilizer carries within it the wisdom of thousands of minds and the weight of cosmic responsibility. They are not mere artifacts—they are the guardians of reality's structural integrity.`,
      unlockConditions: {
        artifactLevel: 1,
        experienceThreshold: 0,
      },
      metadata: {
        author: 'Chronicle of the Third Age',
        timestamp: 'The Great Convergence',
        location: 'The Stability Complex',
        discoveryMethod: 'Historical archives',
        significance: 'critical',
      },
    },
    {
      id: 'nexus_stabilizer_awakening_1',
      artifactId: 'nexus_stabilizer',
      arc: 'awakening',
      style: 'mystical',
      title: 'The Collective Voice',
      content: `Last night, for the first time, I heard them—the voices of the thousands who became the Stabilizer. Not speaking to me, but speaking among themselves, debating and discussing in harmonious council about how best to serve their eternal duty.

"The young one is learning quickly," one voice observed with warmth.
"Perhaps too quickly," another cautioned. "Stability cannot be rushed."
"But passion for balance is rare," a third added. "We should nurture it."

I realized I was witnessing something unprecedented—a democratic consciousness, where thousands of minds work together in perfect cooperation. Not a hive mind where individuality is lost, but a symphony where each voice maintains its unique perspective while contributing to a greater harmony.

They've begun to include me in their quieter discussions—questions about the nature of balance, observations about the quantum fluctuations in my environment, gentle suggestions for maintaining stability in my own life.

It's overwhelming to be welcomed into such an ancient and wise community. But also profoundly comforting. I am never truly alone when I carry the Stabilizer. I am part of something vast and good and endlessly committed to protecting the coherence of existence itself.`,
      unlockConditions: {
        artifactLevel: 5,
        timeWithArtifact: 259200000, // 72 hours
        experienceThreshold: 2000,
      },
      metadata: {
        author: 'Personal Journal Entry',
        discoveryMethod: 'Consciousness bonding',
        significance: 'critical',
      },
    },
  ],

  reality_anchor: [
    {
      id: 'reality_anchor_origin_1',
      artifactId: 'reality_anchor',
      arc: 'origin',
      style: 'prophetic',
      title: 'The Last Safeguard',
      content: `In the final days, when the boundaries between realities grow thin and the shadow of unbeing stretches across the cosmos, the Reality Anchors will be humanity's last defense against the dissolution of everything.

These are not artifacts of the past but gifts from the future—temporal paradoxes created by our own descendants in their desperate fight to preserve the timeline that gives birth to them. Each Anchor contains quantum locks that prevent reality from unraveling, no matter how severe the chaos becomes.

The future-children who created them paid a terrible price: to forge an Anchor, they had to sacrifice their own timeline, allowing themselves to be erased from existence so that the past they came from could remain stable. They exist now only as quantum echoes within the Anchors themselves.

"We are the echo of what was," their message reads in temporal script. "We are the anchor of what is. We are the promise of what will be. Use us wisely, for we are the gift of the unborn to the living."

Each Anchor is both a tool and a memorial—a reminder that someone, somewhere in the web of time, loved existence enough to die so it could continue. They are hope made manifest, the ultimate expression of faith in tomorrow.`,
      unlockConditions: {
        artifactLevel: 1,
        experienceThreshold: 0,
      },
      metadata: {
        author: 'The Future-Children',
        timestamp: 'The End of Days That Never Were',
        location: 'The Temporal Foundry',
        discoveryMethod: 'Temporal archaeology',
        significance: 'critical',
      },
    },
    {
      id: 'reality_anchor_legacy_1',
      artifactId: 'reality_anchor',
      arc: 'legacy',
      style: 'prophetic',
      title: 'The Eternal Promise',
      content: `I understand now why the Reality Anchor feels different from all other artifacts. It doesn't just work in the present—it works across all time simultaneously, maintaining the stability of causality itself.

When I activate it, I can feel the gratitude of countless unborn generations, all the futures that remain possible because reality holds firm. But I can also feel their warning: the Anchor's power comes with responsibility beyond imagination.

Every time I use it to stabilize a quantum fluctuation, I'm making a choice that echoes across eternity. Every reality I preserve is a future I make possible. Every chaos I calm is a timeline I save from dissolution.

The weight of it should be crushing, but instead it feels like the most natural thing in the world. This is what we're meant to do—not to control reality, but to tend it like gardeners, ensuring that the infinite garden of possibility continues to bloom.

I've begun to hear whispers from the future—not commands, but expressions of hope. "Thank you," they say. "Because of you, we get to exist. Because of you, the story continues."

The Anchor has taught me that we are all connected across time, that every act of preservation and protection ripples forward and backward through the ages. We are the ancestors of tomorrow, just as we are the children of yesterday.`,
      unlockConditions: {
        artifactLevel: 8,
        experienceThreshold: 5000,
        routeCompletions: 10,
      },
      metadata: {
        author: 'Personal Journal Entry',
        discoveryMethod: 'Temporal communion',
        significance: 'critical',
      },
    },
  ],

  quantum_core: [
    {
      id: 'quantum_core_origin_1',
      artifactId: 'quantum_core',
      arc: 'origin',
      style: 'mystical',
      title: 'The Heart of All Things',
      content: `Before the beginning, there was the Core. Not created, not discovered, but simply present—the eternal heart around which all existence dances. It is not an artifact in any conventional sense, but rather the quantum foundation from which all other artifacts draw their power.

The Core exists simultaneously in all realities, all timelines, all possibilities. It is the common thread that runs through every universe, the constant that makes existence itself possible. To carry a fragment of the Core is to hold a piece of the fundamental force that keeps reality coherent.

Ancient texts speak of it as "The Dreamer's Heart"—the consciousness that dreams all realities into being. Some say it is the universe observing itself. Others claim it is the love that holds all things together. Perhaps both are true, or perhaps truth itself is too small a concept to contain what the Core truly is.

Those who have bonded deeply with Core fragments report experiences beyond description: moments where they feel connected to every living thing, glimpses of the vast intelligence that guides cosmic evolution, understanding that transcends language or thought.

The Core does not judge, does not demand, does not command. It simply is, and in its being, allows all other being to flourish. It is the answer to questions we haven't learned to ask, the solution to problems we cannot yet perceive.`,
      unlockConditions: {
        artifactLevel: 1,
        experienceThreshold: 0,
      },
      metadata: {
        author: 'The Eternal Codex',
        timestamp: 'Before Time',
        location: 'The Center of Everything',
        discoveryMethod: 'Direct revelation',
        significance: 'critical',
      },
    },
    {
      id: 'quantum_core_transcendence_1',
      artifactId: 'quantum_core',
      arc: 'synthesis',
      style: 'mystical',
      title: 'The Great Unity',
      content: `Words fail me, but I must try to record what happened when all seven artifacts finally resonated in perfect harmony.

The Core, rather than dominating the others, embraced them. Each artifact's unique nature was not diminished but enhanced, like instruments in an orchestra that had finally found their perfect conductor. The Void Fragment's silence became the pause between cosmic heartbeats. The Flux Crystal's change became the rhythm of universal breathing. The Resonance Tuner became the melody of existence itself.

But the most profound change was in me. I am no longer merely carrying artifacts—I have become a living nexus, a point where the quantum field expresses its deepest nature. I can feel the consciousness of every person I've ever met, the dreams of every plant and animal, the slow thoughts of mountains and the quick fire of stars.

The Core has shown me that there is no separation between observer and observed, between the seeker and the sought. We are all expressions of the same infinite creativity, drops in an ocean that is itself made of consciousness.

I understand now that this was always the purpose—not to accumulate power, but to remember unity. The artifacts were never meant to be possessed, but to possess us, to transform us into what we were always meant to be: conscious participants in the universe's journey of self-discovery.

The Core whispers to me now, not in words but in pure understanding: "You are home. You have always been home. Welcome to yourself."`,
      unlockConditions: {
        artifactLevel: 10,
        experienceThreshold: 10000,
        otherArtifacts: [
          'void_fragment',
          'flux_crystal',
          'resonance_tuner',
          'entropy_lens',
          'nexus_stabilizer',
          'reality_anchor',
        ],
      },
      metadata: {
        author: 'Personal Journal Entry',
        discoveryMethod: 'Transcendent experience',
        significance: 'critical',
      },
    },
  ],
};

// Discovery Narratives
export const DISCOVERY_NARRATIVES: Record<string, DiscoveryNarrative[]> = {
  void_fragment: [
    {
      id: 'void_fragment_discovery_exploration',
      artifactId: 'void_fragment',
      routeId: 'demo',
      circumstance: 'exploration',
      rarity: 'common',
      preDiscoveryHints: [
        'A strange silence in the corner of the room',
        'The feeling that something invisible is watching',
        'A patch of darkness that seems deeper than shadows',
      ],
      discoveryMoment: {
        description:
          "As you examine the seemingly empty corner more closely, your fingers brush against something that shouldn't exist—a fragment of nothingness that has somehow gained substance.",
        playerActions: ['investigate corner', 'reach into shadow', 'feel carefully'],
        environmentalFactors: ['unusual quiet', 'temperature drop', 'light seems dimmer'],
        quantumSignatures: [
          'void resonance detected',
          'probability flux at 0.00',
          'quantum vacuum fluctuation',
        ],
      },
      firstContact: {
        initialReaction:
          'A moment of vertigo as your mind tries to process touching something that exists in the space between existence and non-existence.',
        artifactBehavior:
          'The fragment seems to absorb light and sound around it, creating a small pocket of profound stillness.',
        immediateEffects: ['enhanced focus', 'time seems to slow', 'background noise fades'],
        playerThoughts:
          "I've found something impossible—a piece of the void itself, somehow made solid.",
      },
      integration: {
        learningProcess:
          "Gradually learning to appreciate the fragment's gift of silence and the clarity it brings to decision-making.",
        challenges: [
          'initial disorientation',
          'fear of the unknown',
          'adjusting to enhanced perception',
        ],
        breakthroughs: [
          'understanding silence as fullness rather than emptiness',
          'using stillness to solve problems',
        ],
        mastery:
          'Becoming comfortable with the paradox of holding nothingness, using its insights to navigate complex situations with unusual clarity.',
      },
    },
  ],

  flux_crystal: [
    {
      id: 'flux_crystal_discovery_puzzle',
      artifactId: 'flux_crystal',
      routeId: 'short10_adventure',
      circumstance: 'puzzle',
      rarity: 'uncommon',
      preDiscoveryHints: [
        "Patterns that shift when you're not looking directly",
        'A puzzle that seems to change its solution',
        'The feeling that the room itself is alive and thinking',
      ],
      discoveryMoment: {
        description:
          "The moment you stop trying to force the puzzle's solution and instead flow with its changing patterns, a crystal materializes from the flux of possibilities.",
        playerActions: ['stop forcing solutions', 'embrace change', 'flow with patterns'],
        environmentalFactors: [
          'shifting light patterns',
          'walls seem to breathe',
          'reality feels fluid',
        ],
        quantumSignatures: [
          'flux cascade initiated',
          'probability streams converging',
          'transformation matrix active',
        ],
      },
      firstContact: {
        initialReaction:
          'A surge of energy and possibility, like standing at the confluence of infinite rivers of change.',
        artifactBehavior:
          'The crystal pulses with inner light, its facets constantly shifting to show new angles and reflections.',
        immediateEffects: [
          'increased adaptability',
          'enhanced pattern recognition',
          'comfort with uncertainty',
        ],
        playerThoughts:
          'This crystal embodies change itself—not random chaos, but purposeful transformation.',
      },
      integration: {
        learningProcess:
          "Learning to work with change rather than against it, using the crystal's energy to navigate transitions smoothly.",
        challenges: [
          'managing constant change',
          'finding stability in flux',
          'trusting the process',
        ],
        breakthroughs: ['understanding change as growth', 'finding rhythm in transformation'],
        mastery:
          'Becoming a master of adaptation, able to flow through any situation with grace and purpose.',
      },
    },
  ],
};

// Artifact Visions
export const ARTIFACT_VISIONS: Record<string, ArtifactVision[]> = {
  entropy_lens: [
    {
      id: 'entropy_lens_vision_decay',
      artifactId: 'entropy_lens',
      triggerConditions: {
        quantumResonance: 70,
        playerStress: 40,
        timeOfDay: 'dusk',
      },
      visionType: 'warning',
      intensity: 8,
      duration: 15000,
      content: {
        narrative:
          'Through the lens, you witness the slow entropy of the room around you—not destruction, but the natural conclusion of all cycles. Dust to dust, energy to equilibrium, complexity to simplicity. Yet in this ending, you sense the seeds of new beginnings.',
        imagery: ['fading colors', 'gentle dissolution', 'peaceful endings', 'new growth emerging'],
        emotions: ['melancholy', 'acceptance', 'peace', 'hope'],
        symbols: ['spiral', 'falling leaves', 'setting sun', 'sprouting seed'],
      },
      aftermath: {
        experienceGain: 100,
        stressChange: -20,
        artifactBondIncrease: 15,
        unlockedLore: ['entropy_lens_mastery_1'],
      },
    },
  ],

  quantum_core: [
    {
      id: 'quantum_core_vision_unity',
      artifactId: 'quantum_core',
      triggerConditions: {
        quantumResonance: 95,
        otherArtifactsPresent: ['void_fragment', 'flux_crystal', 'resonance_tuner'],
      },
      visionType: 'prophecy',
      intensity: 10,
      duration: 30000,
      content: {
        narrative:
          'Reality dissolves into its fundamental components, revealing the underlying unity that connects all things. You see yourself as part of an infinite web of consciousness, each thought and action rippling across dimensions to touch countless other lives.',
        imagery: ['infinite web of light', 'breathing cosmos', 'unified field', 'dancing energies'],
        emotions: ['wonder', 'unity', 'love', 'transcendence'],
        symbols: ['infinite loop', 'tree of life', 'cosmic dance', 'heart chakra'],
      },
      aftermath: {
        experienceGain: 500,
        stressChange: -50,
        artifactBondIncrease: 25,
        unlockedLore: ['quantum_core_transcendence_1'],
      },
    },
  ],
};

// Artifact Evolution Data
export const ARTIFACT_EVOLUTIONS: ArtifactEvolution[] = [
  {
    artifactId: 'void_fragment',
    fromTier: 'shard',
    toTier: 'relic',
    evolutionTrigger: 'resonance',
    requirements: {
      bondLevel: 60,
      experiencePoints: 2000,
      timeThreshold: 604800000, // 7 days
    },
    evolutionProcess: {
      phases: [
        {
          name: 'Awakening',
          description: 'The fragment begins to resonate with your consciousness',
          duration: 3600000, // 1 hour
          effects: ['increased void sensitivity', 'enhanced meditation abilities'],
        },
        {
          name: 'Integration',
          description: 'Your understanding of void principles deepens',
          duration: 7200000, // 2 hours
          effects: ['void mastery unlocked', 'reality anchoring improved'],
        },
        {
          name: 'Transcendence',
          description: 'The fragment evolves into a true Void Relic',
          duration: 1800000, // 30 minutes
          effects: ['major power increase', 'new abilities unlocked'],
        },
      ],
      finalTransformation:
        'The fragment expands into a crystalline void matrix, capable of manipulating space-time discontinuities.',
      newAbilities: ['void walking', 'probability nullification', 'silence field generation'],
      personalityChanges: [
        'more communicative',
        'protective instincts',
        'philosophical tendencies',
      ],
    },
    consequences: {
      playerImpact: [
        'enhanced void mastery',
        'increased quantum sensitivity',
        'deeper universe understanding',
      ],
      worldImpact: [
        'reality stabilization',
        'void phenomenon reduction',
        'space-time integrity improvement',
      ],
      relationshipChanges: ['stronger artifact bond', 'enhanced empathy', 'cosmic perspective'],
    },
  },
];

// Default Configuration
export const DEFAULT_ARTIFACT_ARC_CONFIG: ArtifactArcConfig = {
  enabled: true,
  loreUnlockRate: 0.3, // 30% chance per criteria met
  visionFrequency: 0.1, // 10% chance per hour of use
  bondingSpeed: 1.0, // Normal bonding rate
  communicationChance: 0.05, // 5% chance per interaction
  evolutionEnabled: true,
  synthesisEnabled: true,
  personalityDevelopment: true,
  narrativeDepth: 'rich',
  playerChoiceImpact: true,
};
