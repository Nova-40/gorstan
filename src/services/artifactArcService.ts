/**
 * Artifact Arc Service
 * Manages artifact storytelling, lore progression, and narrative experiences
 */

import {
  type ArtifactLoreEntry,
  type DiscoveryNarrative,
  type ArtifactVision,
  type ArtifactBond,
  type ArtifactCommunication,
  type ArtifactArchive,
  type ArtifactArcEvent,
  type ArtifactArcConfig,
  type ArtifactEvolution
} from '../types/artifactArc';
import { type QuantumProgression } from '../types/quantumMagic';
import {
  ARTIFACT_LORE,
  DISCOVERY_NARRATIVES,
  ARTIFACT_VISIONS,
  ARTIFACT_EVOLUTIONS,
  DEFAULT_ARTIFACT_ARC_CONFIG
} from '../data/artifactArc';

class ArtifactArcService {
  private archive: ArtifactArchive;
  private config: ArtifactArcConfig;
  private eventListeners: ((event: ArtifactArcEvent) => void)[] = [];
  private visionTimer: number | null = null;
  private bondingTimer: number | null = null;

  constructor(playerId: string, config: Partial<ArtifactArcConfig> = {}) {
    this.config = { ...DEFAULT_ARTIFACT_ARC_CONFIG, ...config };
    this.archive = this.createInitialArchive(playerId);
    this.startBackgroundProcesses();
  }

  private createInitialArchive(playerId: string): ArtifactArchive {
    return {
      playerId,
      unlockedLore: new Map(),
      discoveredNarratives: new Map(),
      experiencedVisions: [],
      artifactBonds: new Map(),
      communications: [],
      evolutionHistory: [],
      synthesisAttempts: [],
      personalNotes: {},
      researchProgress: {}
    };
  }

  private startBackgroundProcesses(): void {
    if (!this.config.enabled) {return;}

    // Vision trigger timer
    this.visionTimer = window.setInterval(() => {
      this.checkVisionTriggers();
    }, 60000); // Check every minute

    // Bonding progression timer
    this.bondingTimer = window.setInterval(() => {
      this.updateBonds();
    }, 30000); // Update every 30 seconds
  }

  // Artifact Discovery and Initial Integration
  public processArtifactDiscovery(
    artifactId: string,
    discoveryContext: {
      routeId?: string;
      circumstance: 'exploration' | 'combat' | 'puzzle' | 'social' | 'meditation' | 'accident';
      playerActions: string[];
      environmentalFactors: string[];
    }
  ): DiscoveryNarrative | null {
    const narratives = DISCOVERY_NARRATIVES[artifactId] || [];
    
    // Find matching narrative or create a generic one
    let selectedNarrative = narratives.find(narrative => 
      narrative.circumstance === discoveryContext.circumstance &&
      (!narrative.routeId || narrative.routeId === discoveryContext.routeId)
    );

    if (!selectedNarrative && narratives.length > 0) {
      selectedNarrative = narratives[0]; // Fallback to first available
    }

    if (selectedNarrative) {
      this.archive.discoveredNarratives.set(selectedNarrative.id, selectedNarrative);
      
      // Create initial bond
      this.createArtifactBond(artifactId);
      
      // Unlock initial lore
      this.checkLoreUnlocks(artifactId);

      this.emitEvent({
        type: 'lore_unlocked',
        artifactId,
        timestamp: Date.now(),
        details: {
          loreEntryId: 'discovery_narrative'
        }
      });

      return selectedNarrative;
    }

    return null;
  }

  private createArtifactBond(artifactId: string): void {
    const bond: ArtifactBond = {
      artifactId,
      playerId: this.archive.playerId,
      bondLevel: 1,
      bondType: 'resonance',
      formationTime: Date.now(),
      lastInteraction: Date.now(),
      experiences: {
        discoveries: 1,
        visions: 0,
        combatUses: 0,
        explorationTime: 0,
        emergencyActivations: 0
      },
      personality: {
        communicative: Math.random() * 30 + 10, // 10-40 base
        protective: Math.random() * 40 + 20,    // 20-60 base
        autonomous: Math.random() * 20 + 5,     // 5-25 base
        mysterious: Math.random() * 60 + 20     // 20-80 base
      }
    };

    this.archive.artifactBonds.set(artifactId, bond);
  }

  // Lore System
  public checkLoreUnlocks(artifactId: string, quantumProgression?: QuantumProgression): string[] {
    const artifactLore = ARTIFACT_LORE[artifactId] || [];
    const unlockedLore: string[] = [];

    for (const loreEntry of artifactLore) {
      if (this.archive.unlockedLore.has(loreEntry.id)) {continue;}

      if (this.meetsUnlockConditions(loreEntry, artifactId, quantumProgression)) {
        this.archive.unlockedLore.set(loreEntry.id, loreEntry);
        unlockedLore.push(loreEntry.id);

        this.emitEvent({
          type: 'lore_unlocked',
          artifactId,
          timestamp: Date.now(),
          details: {
            loreEntryId: loreEntry.id
          }
        });
      }
    }

    return unlockedLore;
  }

  private meetsUnlockConditions(
    loreEntry: ArtifactLoreEntry,
    artifactId: string,
    quantumProgression?: QuantumProgression
  ): boolean {
    const conditions = loreEntry.unlockConditions;
    const bond = this.archive.artifactBonds.get(artifactId);
    const artifact = quantumProgression?.artifacts.get(artifactId);

    // Check artifact level
    if (conditions.artifactLevel && (!artifact || artifact.level < conditions.artifactLevel)) {
      return false;
    }

    // Check experience threshold
    if (conditions.experienceThreshold && 
        (!quantumProgression || quantumProgression.totalExperience < conditions.experienceThreshold)) {
      return false;
    }

    // Check route completions
    if (conditions.routeCompletions && quantumProgression) {
      const totalCompletions = 
        quantumProgression.routeCompletions.demo +
        quantumProgression.routeCompletions.short10.length +
        quantumProgression.routeCompletions.short30.length +
        quantumProgression.routeCompletions.full;
      
      if (totalCompletions < conditions.routeCompletions) {
        return false;
      }
    }

    // Check other artifacts
    if (conditions.otherArtifacts && quantumProgression) {
      const hasRequired = conditions.otherArtifacts.every(requiredId =>
        quantumProgression.artifacts.has(requiredId)
      );
      if (!hasRequired) {return false;}
    }

    // Check time with artifact
    if (conditions.timeWithArtifact && bond) {
      const timeWithArtifact = Date.now() - bond.formationTime;
      if (timeWithArtifact < conditions.timeWithArtifact) {
        return false;
      }
    }

    // Check usage count
    if (conditions.usageCount && bond) {
      const totalUsage = Object.values(bond.experiences).reduce((sum, count) => sum + count, 0);
      if (totalUsage < conditions.usageCount) {
        return false;
      }
    }

    return true;
  }

  // Vision System
  private checkVisionTriggers(): void {
    for (const [artifactId, bond] of this.archive.artifactBonds) {
      const visions = ARTIFACT_VISIONS[artifactId] || [];
      
      for (const vision of visions) {
        if (this.shouldTriggerVision(vision, artifactId, bond)) {
          this.triggerVision(vision);
          break; // Only one vision per check cycle
        }
      }
    }
  }

  private shouldTriggerVision(vision: ArtifactVision, _artifactId: string, bond: ArtifactBond): boolean {
    // Check if vision already experienced recently
    const recentVisions = this.archive.experiencedVisions.filter(v => 
      v.id === vision.id && Date.now() - (v.metadata?.timestamp || 0) < 86400000 // 24 hours
    );
    if (recentVisions.length > 0) {return false;}

    // Check trigger conditions
    const conditions = vision.triggerConditions;
    
    // Random chance based on configuration
    if (Math.random() > this.config.visionFrequency) {return false;}

    // Check quantum resonance (approximated by bond level)
    if (conditions.quantumResonance && bond.bondLevel < conditions.quantumResonance) {
      return false;
    }

    // Check other artifacts present (simplified)
    if (conditions.otherArtifactsPresent) {
      const hasOthers = conditions.otherArtifactsPresent.every(otherId =>
        this.archive.artifactBonds.has(otherId)
      );
      if (!hasOthers) {return false;}
    }

    // Check time of day (simplified - based on current hour)
    if (conditions.timeOfDay) {
      const hour = new Date().getHours();
      const timeMatches = {
        dawn: hour >= 5 && hour < 8,
        day: hour >= 8 && hour < 18,
        dusk: hour >= 18 && hour < 21,
        night: hour >= 21 || hour < 5
      };
      if (!timeMatches[conditions.timeOfDay]) {return false;}
    }

    return true;
  }

  private triggerVision(vision: ArtifactVision): void {
    // Add to experienced visions
    const experiencedVision = {
      ...vision,
      metadata: {
        ...vision.metadata,
        timestamp: Date.now()
      }
    };
    this.archive.experiencedVisions.push(experiencedVision);

    // Apply aftermath effects
    if (vision.aftermath) {
      const bond = this.archive.artifactBonds.get(vision.artifactId);
      if (bond && vision.aftermath.artifactBondIncrease) {
        bond.bondLevel = Math.min(100, bond.bondLevel + vision.aftermath.artifactBondIncrease);
        bond.experiences.visions++;
      }

      // Unlock new lore if specified
      if (vision.aftermath.unlockedLore) {
        for (const loreId of vision.aftermath.unlockedLore) {
          const loreEntry = Object.values(ARTIFACT_LORE)
            .flat()
            .find(entry => entry.id === loreId);
          
          if (loreEntry) {
            this.archive.unlockedLore.set(loreId, loreEntry);
          }
        }
      }
    }

    this.emitEvent({
      type: 'vision_triggered',
      artifactId: vision.artifactId,
      timestamp: Date.now(),
      details: {
        visionId: vision.id
      }
    });
  }

  // Bonding System
  private updateBonds(): void {
    for (const [artifactId, bond] of this.archive.artifactBonds) {
      const timeSinceLastInteraction = Date.now() - bond.lastInteraction;
      
      // Slow bond decay if unused for too long (over 24 hours)
      if (timeSinceLastInteraction > 86400000) {
        bond.bondLevel = Math.max(0, bond.bondLevel - 0.1);
      }
      
      // Update bond type based on level
      if (bond.bondLevel >= 80) {
        bond.bondType = 'transcendence';
      } else if (bond.bondLevel >= 60) {
        bond.bondType = 'symbiosis';
      } else if (bond.bondLevel >= 30) {
        bond.bondType = 'mastery';
      } else {
        bond.bondType = 'resonance';
      }

      // Check for evolution potential
      this.checkEvolutionReadiness(artifactId, bond);
    }
  }

  public strengthenBond(
    artifactId: string, 
    experienceType: 'discovery' | 'vision' | 'combat' | 'exploration' | 'emergency',
    amount: number = 1
  ): void {
    const bond = this.archive.artifactBonds.get(artifactId);
    if (!bond) {return;}

    bond.bondLevel = Math.min(100, bond.bondLevel + (amount * this.config.bondingSpeed));
    bond.lastInteraction = Date.now();
    
    // Update specific experience
    switch (experienceType) {
      case 'discovery':
        bond.experiences.discoveries += amount;
        break;
      case 'vision':
        bond.experiences.visions += amount;
        break;
      case 'combat':
        bond.experiences.combatUses += amount;
        break;
      case 'exploration':
        bond.experiences.explorationTime += amount;
        break;
      case 'emergency':
        bond.experiences.emergencyActivations += amount;
        // Emergency use creates stronger bonds
        bond.bondLevel = Math.min(100, bond.bondLevel + 2);
        break;
    }

    // Check for communication trigger
    this.checkCommunicationTrigger(artifactId, bond, experienceType);

    this.emitEvent({
      type: 'bond_strengthened',
      artifactId,
      timestamp: Date.now(),
      details: {
        bondIncrease: amount
      }
    });
  }

  private checkCommunicationTrigger(
    artifactId: string, 
    bond: ArtifactBond, 
    trigger: string
  ): void {
    if (!this.config.personalityDevelopment) {return;}
    if (!bond.personality) {return;}

    const communicationChance = (bond.personality.communicative / 100) * this.config.communicationChance;
    
    if (Math.random() < communicationChance) {
      this.generateCommunication(artifactId, bond, trigger);
    }
  }

  private generateCommunication(artifactId: string, bond: ArtifactBond, trigger: string): void {
    if (!bond.personality) {return;}

    // Choose communication type based on bond level and personality
    let selectedType: ArtifactCommunication['communicationType'];
    if (bond.bondLevel > 70) {
      selectedType = bond.personality.mysterious > 50 ? 'vision' : 'direct';
    } else if (bond.bondLevel > 40) {
      selectedType = 'feeling';
    } else {
      selectedType = 'whisper';
    }

    const messages = this.generateMessage(artifactId, bond, trigger, selectedType);
    
    const communication: ArtifactCommunication = {
      id: `comm_${artifactId}_${Date.now()}`,
      artifactId,
      bondLevel: bond.bondLevel,
      communicationType: selectedType,
      message: messages,
      context: {
        trigger: trigger as any,
        playerState: 'curious', // Simplified
        situation: `Using ${artifactId} for ${trigger}`
      }
    };

    this.archive.communications.push(communication);

    this.emitEvent({
      type: 'communication',
      artifactId,
      timestamp: Date.now(),
      details: {
        communicationId: communication.id
      }
    });
  }

  private generateMessage(
    artifactId: string, 
    bond: ArtifactBond, 
    trigger: string, 
    type: ArtifactCommunication['communicationType']
  ): string {
    const personality = bond.personality!;

    // Artifact-specific message templates
    const messageTemplates: Record<string, Record<string, string[]>> = {
      void_fragment: {
        whisper: ['...silence speaks...', '...between thoughts...', '...the pause that contains all...'],
        feeling: ['A sense of peaceful emptiness', 'Clarity through stillness', 'The comfort of the void'],
        direct: ['Focus on the silence between sounds', 'Find strength in emptiness', 'The void holds infinite potential']
      },
      flux_crystal: {
        whisper: ['...change flows...', '...adapt and grow...', '...transformation awaits...'],
        feeling: ['Energy of constant change', 'The rhythm of transformation', 'Flow like water'],
        direct: ['Embrace the change coming', 'Adaptation is strength', 'Let yourself transform']
      },
      quantum_core: {
        whisper: ['...all is one...', '...connection eternal...', '...unity in diversity...'],
        feeling: ['Deep connection to everything', 'Universal love and understanding', 'Oneness with existence'],
        direct: ['You are part of the infinite', 'All consciousness is connected', 'Love is the fundamental force']
      }
    };

    const artifactMessages = messageTemplates[artifactId] || {
      whisper: ['...presence...', '...awareness...', '...guidance...'],
      feeling: ['Mysterious energy', 'Ancient wisdom', 'Protective presence'],
      direct: ['I am here', 'We journey together', 'Trust the process']
    };

    const messages = artifactMessages[type] || artifactMessages.feeling;
    let selectedMessage = messages?.[Math.floor(Math.random() * messages.length)] || 'The artifact resonates quietly';

    // Modify message based on personality
    if (personality.protective > 70 && trigger === 'emergency') {
      selectedMessage = 'I will shield you from harm';
    } else if (personality.mysterious > 80) {
      selectedMessage = '...' + selectedMessage + '...';
    }

    return selectedMessage || 'The artifact whispers softly';
  }

  // Evolution System
  private checkEvolutionReadiness(artifactId: string, bond: ArtifactBond): void {
    if (!this.config.evolutionEnabled) {return;}

    const evolution = ARTIFACT_EVOLUTIONS.find(evo => evo.artifactId === artifactId);
    if (!evolution) {return;}

    const requirements = evolution.requirements;
    let isReady = true;

    if (requirements.bondLevel && bond.bondLevel < requirements.bondLevel) {
      isReady = false;
    }

    if (requirements.timeThreshold) {
      const timeWithArtifact = Date.now() - bond.formationTime;
      if (timeWithArtifact < requirements.timeThreshold) {
        isReady = false;
      }
    }

    if (isReady) {
      this.initiateEvolution(artifactId, evolution);
    }
  }

  private initiateEvolution(artifactId: string, evolution: ArtifactEvolution): void {
    this.archive.evolutionHistory.push(evolution);

    this.emitEvent({
      type: 'evolution_began',
      artifactId,
      timestamp: Date.now(),
      details: {
        evolutionStage: 'initiated'
      }
    });
  }

  // Journal System
  public addJournalEntry(
    artifactId: string,
    _entryType: 'discovery' | 'vision' | 'communication' | 'evolution' | 'synthesis' | 'research',
    title: string,
    content: string,
    _mood: 'excited' | 'curious' | 'concerned' | 'awed' | 'confused' | 'determined' = 'curious'
  ): void {
    if (!this.archive.personalNotes[artifactId]) {
      this.archive.personalNotes[artifactId] = [];
    }

    const entry = `[${new Date().toISOString()}] ${title}: ${content}`;
    this.archive.personalNotes[artifactId].push(entry);
  }

  // Public API Methods
  public getUnlockedLore(artifactId?: string): ArtifactLoreEntry[] {
    const allLore = Array.from(this.archive.unlockedLore.values());
    return artifactId 
      ? allLore.filter(lore => lore.artifactId === artifactId)
      : allLore;
  }

  public getArtifactBond(artifactId: string): ArtifactBond | null {
    return this.archive.artifactBonds.get(artifactId) || null;
  }

  public getRecentVisions(limit: number = 5): ArtifactVision[] {
    return this.archive.experiencedVisions
      .sort((a, b) => (b.metadata?.timestamp || 0) - (a.metadata?.timestamp || 0))
      .slice(0, limit);
  }

  public getCommunications(artifactId?: string): ArtifactCommunication[] {
    return artifactId
      ? this.archive.communications.filter(comm => comm.artifactId === artifactId)
      : this.archive.communications;
  }

  public getPersonalNotes(artifactId: string): string[] {
    return this.archive.personalNotes[artifactId] || [];
  }

  public addEventListener(listener: (event: ArtifactArcEvent) => void): void {
    this.eventListeners.push(listener);
  }

  public removeEventListener(listener: (event: ArtifactArcEvent) => void): void {
    const index = this.eventListeners.indexOf(listener);
    if (index > -1) {
      this.eventListeners.splice(index, 1);
    }
  }

  private emitEvent(event: ArtifactArcEvent): void {
    this.eventListeners.forEach(listener => listener(event));
  }

  public saveArchive(): string {
    return JSON.stringify({
      playerId: this.archive.playerId,
      unlockedLore: Array.from(this.archive.unlockedLore.entries()),
      discoveredNarratives: Array.from(this.archive.discoveredNarratives.entries()),
      experiencedVisions: this.archive.experiencedVisions,
      artifactBonds: Array.from(this.archive.artifactBonds.entries()),
      communications: this.archive.communications.slice(-50), // Keep last 50
      personalNotes: this.archive.personalNotes,
      researchProgress: this.archive.researchProgress
    });
  }

  public loadArchive(savedData: string): boolean {
    try {
      const data = JSON.parse(savedData);
      
      this.archive.playerId = data.playerId;
      this.archive.unlockedLore = new Map(data.unlockedLore || []);
      this.archive.discoveredNarratives = new Map(data.discoveredNarratives || []);
      this.archive.experiencedVisions = data.experiencedVisions || [];
      this.archive.artifactBonds = new Map(data.artifactBonds || []);
      this.archive.communications = data.communications || [];
      this.archive.personalNotes = data.personalNotes || {};
      this.archive.researchProgress = data.researchProgress || {};
      
      return true;
    } catch (error) {
      console.error('Failed to load artifact archive:', error);
      return false;
    }
  }

  public destroy(): void {
    if (this.visionTimer) {
      clearInterval(this.visionTimer);
      this.visionTimer = null;
    }
    if (this.bondingTimer) {
      clearInterval(this.bondingTimer);
      this.bondingTimer = null;
    }
    this.eventListeners = [];
  }
}

export default ArtifactArcService;
