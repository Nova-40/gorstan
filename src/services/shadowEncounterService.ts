/**
 * Shadow Encounter Service
 * Manages shadow entity spawning, encounters, and interactions
 */

import { 
  type ShadowEntity, 
  type ShadowEncounter, 
  type ShadowGameState,
  type ShadowInteraction,
  type ShadowEvent,
  type ShadowSystemConfig,
  type ShadowInteractionType,
  type RouteSpecificShadowConfig
} from '../types/shadowEncounters';
import { type QuantumProgression } from '../types/quantumMagic';
import { type RouteId } from '../types/routes';
import { 
  SHADOW_ENTITIES, 
  DEFAULT_SHADOW_CONFIG,
  ROUTE_SHADOW_CONFIGS,
  DIFFICULTY_CONFIGS,
  QUANTUM_SHADOW_EFFECTS
} from '../data/shadowEncounters';

class ShadowEncounterService {
  private shadowState: ShadowGameState;
  private config: ShadowSystemConfig;
  private eventListeners: ((event: ShadowEvent) => void)[] = [];
  private spawnTimer: number | null = null;
  private stressDecayTimer: number | null = null;

  constructor(config: Partial<ShadowSystemConfig> = {}) {
    this.config = { ...DEFAULT_SHADOW_CONFIG, ...config };
    this.shadowState = this.createInitialState();
    this.startBackgroundProcesses();
  }

  private createInitialState(): ShadowGameState {
    return {
      encounterState: {
        activeEncounters: new Map(),
        encounterHistory: [],
        playerStress: 0,
        environmentalFear: 0,
        quantumStability: 100,
        totalEncounters: 0,
        successfulEncounters: 0,
        escapeEncounters: 0
      },
      activeEntities: new Map(),
      discoveredEntities: [],
      interactionHistory: [],
  difficultySettings: (DIFFICULTY_CONFIGS.normal ?? Object.values(DIFFICULTY_CONFIGS)[0])!,
      quantumEffects: new Map(),
      playerFearLevel: 0,
      adaptiveDifficulty: {
        currentLevel: 1,
        successRate: 0,
        adjustmentFactor: 1.0
      }
    };
  }

  private startBackgroundProcesses(): void {
    if (!this.config.enabled) return;

    // Spawn timer - check for new shadow spawns
    this.spawnTimer = window.setInterval(() => {
      this.checkSpawnConditions();
    }, 30000); // Check every 30 seconds

    // Stress decay timer
    this.stressDecayTimer = window.setInterval(() => {
      this.decayStress();
    }, 5000); // Update every 5 seconds
  }

  private checkSpawnConditions(): void {
    const currentRoute = this.getCurrentRoute();
    if (!currentRoute) return;

    const routeConfig = ROUTE_SHADOW_CONFIGS.find(config => config.routeId === currentRoute);
    if (!routeConfig) return;

    const spawnChance = this.calculateSpawnChance(routeConfig);
    if (Math.random() < spawnChance) {
      this.attemptSpawn(currentRoute, routeConfig);
    }
  }

  private calculateSpawnChance(routeConfig: RouteSpecificShadowConfig): number {
    let baseChance = this.config.spawnRate;
    
    // Apply route modifier
    baseChance *= routeConfig.spawnRateModifier;
    
    // Apply difficulty scaling
    baseChance *= this.shadowState.adaptiveDifficulty.adjustmentFactor;
    
    // Reduce chance if at max entities
    const activeCount = this.shadowState.activeEntities.size;
    if (activeCount >= this.config.maxEntitiesPerRoom) {
      return 0;
    }
    
    // Fear level increases spawn chance
    const fearBonus = this.shadowState.playerFearLevel * 0.01;
    baseChance += fearBonus;
    
    // Quantum instability increases spawn chance
    const quantumPenalty = (100 - this.shadowState.encounterState.quantumStability) * 0.005;
    baseChance += quantumPenalty;
    
    return Math.min(0.8, baseChance); // Cap at 80% chance
  }

  private attemptSpawn(routeId: RouteId, routeConfig: RouteSpecificShadowConfig): void {
    const eligibleEntities = this.getEligibleEntities(routeId, routeConfig);
    if (eligibleEntities.length === 0) return;

    const selectedEntity = this.selectEntityToSpawn(eligibleEntities);
    if (!selectedEntity) return;

    this.spawnEntity(selectedEntity);
  }

  private getEligibleEntities(routeId: RouteId, routeConfig: RouteSpecificShadowConfig): ShadowEntity[] {
    return Object.values(SHADOW_ENTITIES).filter(entity => {
      // Check if entity type is allowed for this route
      if (!routeConfig.allowedEntityTypes.includes(entity.type)) {
        return false;
      }

      // Check route-specific conditions
      if (entity.spawnConditions.routeSpecific && 
          !entity.spawnConditions.routeSpecific.includes(routeId)) {
        return false;
      }

      // Check quantum level requirement
      const quantumProgression = this.getQuantumProgression();
      if (entity.spawnConditions.quantumLevel && 
          quantumProgression.quantumLevel < entity.spawnConditions.quantumLevel) {
        return false;
      }

      // Check artifact presence requirement
      if (entity.spawnConditions.artifactPresence) {
        const hasRequiredArtifacts = entity.spawnConditions.artifactPresence.some(artifactId =>
          quantumProgression.artifacts.has(artifactId)
        );
        if (!hasRequiredArtifacts) return false;
      }

      return true;
    });
  }

  private selectEntityToSpawn(eligibleEntities: ShadowEntity[]): ShadowEntity | null {
    if (eligibleEntities.length === 0) return null;

    // Weight selection by player fear level and quantum progression
    const quantumLevel = this.getQuantumProgression().quantumLevel;
    const fearLevel = this.shadowState.playerFearLevel;

    const weightedEntities = eligibleEntities.map(entity => {
      let weight = 1;

      // Favor entities appropriate for quantum level
      if (entity.spawnConditions.quantumLevel) {
        const levelDiff = Math.abs(quantumLevel - entity.spawnConditions.quantumLevel);
        weight *= Math.max(0.1, 1 - (levelDiff * 0.2));
      }

      // Fear level affects entity selection
      if (fearLevel > 50) {
        // Higher fear = more dangerous entities
        weight *= (entity.stats.aggression / 100) + 0.5;
      } else {
        // Lower fear = less aggressive entities
        weight *= 1 - (entity.stats.aggression / 200);
      }

      return { entity, weight };
    });

    // Select based on weighted random
    const totalWeight = weightedEntities.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;

    for (const item of weightedEntities) {
      random -= item.weight;
      if (random <= 0) {
        return item.entity;
      }
    }

    return eligibleEntities[0] || null; // Fallback
  }

  private spawnEntity(entityTemplate: ShadowEntity): void {
    const entity: ShadowEntity = {
      ...entityTemplate,
      id: `${entityTemplate.id}_${Date.now()}`,
      stats: { ...entityTemplate.stats }
    };

    this.shadowState.activeEntities.set(entity.id, entity);
    
    // Add to discovered entities if not already there
    if (!this.shadowState.discoveredEntities.includes(entityTemplate.id)) {
      this.shadowState.discoveredEntities.push(entityTemplate.id);
    }

    // Create encounter
    const encounter: ShadowEncounter = {
      id: `encounter_${entity.id}`,
      entityId: entity.id,
      startTime: Date.now(),
      roomId: this.getCurrentRoomId(),
      encounterType: this.determineEncounterType(entity),
      difficulty: this.calculateEncounterDifficulty(entity),
      playerActions: []
    };

    this.shadowState.encounterState.activeEncounters.set(encounter.id, encounter);
    this.shadowState.encounterState.totalEncounters++;

    // Emit spawn event
    this.emitEvent({
      type: 'spawn',
      entityId: entity.id,
      timestamp: Date.now(),
      details: {
        roomId: encounter.roomId,
        quantumArtifacts: Array.from(this.getQuantumProgression().artifacts.values())
      }
    });

    // Increase player stress based on entity aggression
    this.increaseStress(entity.stats.aggression * 0.5);
  }

  private determineEncounterType(entity: ShadowEntity): ShadowEncounter['encounterType'] {
    switch (entity.behavior) {
      case 'passive': return 'observation';
      case 'curious': return 'interaction';
      case 'territorial': return 'challenge';
      case 'aggressive': return 'chase';
      case 'mimic': return 'interaction';
      case 'phase': return 'stealth';
      case 'collective': return 'challenge';
      default: return 'observation';
    }
  }

  private calculateEncounterDifficulty(entity: ShadowEntity): number {
    let difficulty = Math.floor((entity.stats.health + entity.stats.aggression + entity.stats.awareness) / 30);
    
    // Apply route difficulty modifier
    const currentRoute = this.getCurrentRoute();
    const routeConfig = ROUTE_SHADOW_CONFIGS.find(config => config.routeId === currentRoute);
    if (routeConfig) {
      difficulty *= routeConfig.difficultyModifier;
    }

    // Apply adaptive difficulty
    difficulty *= this.shadowState.adaptiveDifficulty.adjustmentFactor;

    return Math.max(1, Math.min(10, Math.round(difficulty)));
  }

  public interactWithShadow(
    entityId: string, 
    interactionType: ShadowInteractionType,
    artifactIds: string[] = []
  ): ShadowInteraction | null {
    const entity = this.shadowState.activeEntities.get(entityId);
    if (!entity) return null;

    const encounter = Array.from(this.shadowState.encounterState.activeEncounters.values())
      .find(enc => enc.entityId === entityId);
    if (!encounter) return null;

    const interaction = this.processInteraction(entity, interactionType, artifactIds);
    
    // Update encounter
    encounter.playerActions.push(interactionType);
    
    // Store interaction history
    this.shadowState.interactionHistory.push(interaction);
    
    // Check if encounter should end
    if (interaction.result.success && 
        ['banish', 'retreat'].includes(interactionType)) {
      this.endEncounter(encounter.id, 'success');
    }

    return interaction;
  }

  private processInteraction(
    entity: ShadowEntity, 
    interactionType: ShadowInteractionType,
    artifactIds: string[]
  ): ShadowInteraction {
    const quantumProgression = this.getQuantumProgression();
    let effectiveness = 0;
    let stressChange = 0;
    let experienceGained = 0;
    let entityResponse = '';

    // Calculate base effectiveness
    switch (interactionType) {
      case 'observe':
        effectiveness = 70;
        stressChange = -5;
        experienceGained = 10;
        entityResponse = `The ${entity.name} seems ${entity.behavior} and ${this.getEntityMoodDescription(entity)}.`;
        break;

      case 'approach':
        effectiveness = entity.behavior === 'aggressive' ? 20 : 60;
        stressChange = entity.stats.aggression * 0.3;
        experienceGained = 15;
        entityResponse = entity.behavior === 'aggressive' 
          ? `The ${entity.name} grows more agitated as you approach.`
          : `The ${entity.name} watches you with curious interest.`;
        break;

      case 'retreat':
        effectiveness = 80;
        stressChange = -10;
        experienceGained = 5;
        entityResponse = `The ${entity.name} lets you withdraw without pursuit.`;
        break;

      case 'activate':
        const artifactEffectiveness = this.calculateArtifactEffectiveness(entity, artifactIds);
        effectiveness = artifactEffectiveness;
        stressChange = artifactEffectiveness > 50 ? -20 : 10;
        experienceGained = 25;
        entityResponse = artifactEffectiveness > 50
          ? `Your quantum artifacts disrupt the ${entity.name}!`
          : `The ${entity.name} resists your quantum energy.`;
        break;

      case 'communicate':
        effectiveness = entity.behavior === 'mimic' ? 70 : 30;
        stressChange = 5;
        experienceGained = 20;
        entityResponse = entity.behavior === 'mimic'
          ? `The ${entity.name} echoes your attempt at communication.`
          : `The ${entity.name} seems unable or unwilling to respond.`;
        break;

      case 'hide':
        effectiveness = Math.max(10, 90 - entity.stats.awareness);
        stressChange = effectiveness > 50 ? -15 : 15;
        experienceGained = 12;
        entityResponse = effectiveness > 50
          ? `You successfully avoid the ${entity.name}'s attention.`
          : `The ${entity.name} easily detects your hiding attempt.`;
        break;

      case 'banish':
        const banishPower = this.calculateBanishPower(artifactIds);
        effectiveness = Math.min(95, banishPower);
        stressChange = effectiveness > 70 ? -30 : 20;
        experienceGained = effectiveness > 70 ? 50 : 25;
        entityResponse = effectiveness > 70
          ? `The ${entity.name} fades away, banished by your power!`
          : `The ${entity.name} resists your banishment attempt.`;
        break;

      case 'study':
        effectiveness = 60;
        stressChange = 0;
        experienceGained = 30;
        entityResponse = `You learn about the ${entity.name}'s weaknesses: ${entity.weaknesses.join(', ')}.`;
        break;
    }

    // Apply quantum level bonus
    effectiveness += quantumProgression.quantumLevel * 2;
    experienceGained += quantumProgression.quantumLevel;

    // Apply stress to effectiveness
    const stressPenalty = this.shadowState.encounterState.playerStress * 0.2;
    effectiveness = Math.max(5, effectiveness - stressPenalty);

    const success = effectiveness > 50;

    // Update stress
    this.shadowState.encounterState.playerStress = Math.max(0, 
      Math.min(100, this.shadowState.encounterState.playerStress + stressChange));

    return {
      type: interactionType,
      entityId: entity.id,
      timestamp: Date.now(),
      result: {
        success,
        effect: `${interactionType} ${success ? 'succeeded' : 'failed'}`,
        stressChange,
        entityResponse,
        experienceGained,
        ...(artifactIds.length > 0 ? { artifactEffectiveness: effectiveness } : {})
      }
    };
  }

  private calculateArtifactEffectiveness(entity: ShadowEntity, artifactIds: string[]): number {
    if (artifactIds.length === 0) return 0;

    let totalEffectiveness = 0;
    
    for (const artifactId of artifactIds) {
      const effect = Object.values(QUANTUM_SHADOW_EFFECTS)
        .find(effect => effect.artifactId === artifactId);
      
      if (effect) {
        let effectiveness = effect.effectiveness;
        
        // Check entity weaknesses
        if (entity.weaknesses.includes('quantum') || entity.weaknesses.includes('artifacts')) {
          effectiveness *= 1.5;
        }
        
        // Specific weakness bonuses
        if (entity.weaknesses.includes('light') && effect.effectType === 'reveal') {
          effectiveness *= 1.3;
        }
        if (entity.weaknesses.includes('resonance') && effect.effectType === 'communicate') {
          effectiveness *= 1.4;
        }
        
        totalEffectiveness += effectiveness;
      }
    }

    return Math.min(100, totalEffectiveness);
  }

  private calculateBanishPower(artifactIds: string[]): number {
    return this.calculateArtifactEffectiveness({ weaknesses: ['quantum', 'artifacts'] } as ShadowEntity, artifactIds);
  }

  private getEntityMoodDescription(entity: ShadowEntity): string {
    const manifestation = entity.stats.manifestation;
    if (manifestation < 30) return 'barely visible';
    if (manifestation < 60) return 'partially solid';
    if (manifestation < 90) return 'clearly defined';
    return 'fully manifested';
  }

  private endEncounter(encounterId: string, outcome: 'success' | 'failure' | 'escape'): void {
    const encounter = this.shadowState.encounterState.activeEncounters.get(encounterId);
    if (!encounter) return;

    encounter.outcome = outcome;
    encounter.duration = Date.now() - encounter.startTime;

    // Calculate rewards
    if (outcome === 'success') {
      const entity = this.shadowState.activeEntities.get(encounter.entityId);
      if (entity?.rewards) {
        encounter.rewards = {
          experienceGained: entity.rewards.experience,
          artifactsDiscovered: [],
          quantumBonus: entity.rewards.artifactDiscoveryBonus || 0
        };
        
        this.shadowState.encounterState.successfulEncounters++;
      }
    } else if (outcome === 'escape') {
      this.shadowState.encounterState.escapeEncounters++;
    }

    // Move to history
    this.shadowState.encounterState.encounterHistory.push(encounter);
    this.shadowState.encounterState.activeEncounters.delete(encounterId);

    // Remove entity
    this.shadowState.activeEntities.delete(encounter.entityId);

    // Update adaptive difficulty
    this.updateAdaptiveDifficulty();

    // Emit event
    this.emitEvent({
      type: outcome === 'success' ? 'victory' : 'escape',
      entityId: encounter.entityId,
      timestamp: Date.now(),
      details: {
        roomId: encounter.roomId,
        outcome,
        ...(encounter.rewards?.experienceGained !== undefined ? { experienceGained: encounter.rewards.experienceGained } : {})
      }
    });
  }

  private updateAdaptiveDifficulty(): void {
    const recentEncounters = this.shadowState.encounterState.encounterHistory.slice(-10);
    if (recentEncounters.length < 3) return;

    const successRate = recentEncounters.filter(enc => enc.outcome === 'success').length / recentEncounters.length;
    this.shadowState.adaptiveDifficulty.successRate = successRate;

    // Adjust difficulty based on success rate
    if (successRate > 0.7) {
      this.shadowState.adaptiveDifficulty.adjustmentFactor *= 1.1; // Make it harder
    } else if (successRate < 0.3) {
      this.shadowState.adaptiveDifficulty.adjustmentFactor *= 0.9; // Make it easier
    }

    // Keep within reasonable bounds
    this.shadowState.adaptiveDifficulty.adjustmentFactor = Math.max(0.5, 
      Math.min(2.0, this.shadowState.adaptiveDifficulty.adjustmentFactor));
  }

  private increaseStress(amount: number): void {
    this.shadowState.encounterState.playerStress = Math.min(100, 
      this.shadowState.encounterState.playerStress + amount);
    
    // Update fear level based on stress
    if (this.shadowState.encounterState.playerStress > 80) {
      this.shadowState.playerFearLevel = Math.min(100, this.shadowState.playerFearLevel + 5);
    }
  }

  private decayStress(): void {
    const decayRate = this.shadowState.difficultySettings.stressDecayRate;
    this.shadowState.encounterState.playerStress = Math.max(0, 
      this.shadowState.encounterState.playerStress - decayRate);
    
    // Decay fear level slowly
    if (this.shadowState.encounterState.playerStress < 20) {
      this.shadowState.playerFearLevel = Math.max(0, this.shadowState.playerFearLevel - 0.5);
    }
  }

  private emitEvent(event: ShadowEvent): void {
    this.eventListeners.forEach(listener => listener(event));
  }

  // Public API methods
  public getActiveEncounters(): ShadowEncounter[] {
    return Array.from(this.shadowState.encounterState.activeEncounters.values());
  }

  public getEncounterHistory(): ShadowEncounter[] {
    return this.shadowState.encounterState.encounterHistory;
  }

  public getPlayerStress(): number {
    return this.shadowState.encounterState.playerStress;
  }

  public getPlayerFearLevel(): number {
    return this.shadowState.playerFearLevel;
  }

  public getActiveEntities(): ShadowEntity[] {
    return Array.from(this.shadowState.activeEntities.values());
  }

  public getDiscoveredEntities(): string[] {
    return this.shadowState.discoveredEntities;
  }

  public addEventListener(listener: (event: ShadowEvent) => void): void {
    this.eventListeners.push(listener);
  }

  public removeEventListener(listener: (event: ShadowEvent) => void): void {
    const index = this.eventListeners.indexOf(listener);
    if (index > -1) {
      this.eventListeners.splice(index, 1);
    }
  }

  public updateConfig(newConfig: Partial<ShadowSystemConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  public getShadowState(): ShadowGameState {
    return { ...this.shadowState };
  }

  public saveState(): string {
    return JSON.stringify({
      encounterState: {
        ...this.shadowState.encounterState,
        activeEncounters: Array.from(this.shadowState.encounterState.activeEncounters.entries()),
      },
      discoveredEntities: this.shadowState.discoveredEntities,
      interactionHistory: this.shadowState.interactionHistory.slice(-50), // Keep last 50
      playerFearLevel: this.shadowState.playerFearLevel,
      adaptiveDifficulty: this.shadowState.adaptiveDifficulty
    });
  }

  public loadState(savedState: string): boolean {
    try {
      const state = JSON.parse(savedState);
      
      // Restore encounter state
      this.shadowState.encounterState = {
        ...state.encounterState,
        activeEncounters: new Map(state.encounterState.activeEncounters || [])
      };
      
      this.shadowState.discoveredEntities = state.discoveredEntities || [];
      this.shadowState.interactionHistory = state.interactionHistory || [];
      this.shadowState.playerFearLevel = state.playerFearLevel || 0;
      this.shadowState.adaptiveDifficulty = state.adaptiveDifficulty || {
        currentLevel: 1,
        successRate: 0,
        adjustmentFactor: 1.0
      };
      
      return true;
    } catch (error) {
      console.error('Failed to load shadow encounter state:', error);
      return false;
    }
  }

  public destroy(): void {
    if (this.spawnTimer) {
      clearInterval(this.spawnTimer);
      this.spawnTimer = null;
    }
    if (this.stressDecayTimer) {
      clearInterval(this.stressDecayTimer);
      this.stressDecayTimer = null;
    }
    this.eventListeners = [];
  }

  // Helper methods (these would be injected or retrieved from context in real implementation)
  private getCurrentRoute(): RouteId | null {
    // TODO: Implement route detection
    return 'demo'; // Placeholder
  }

  private getCurrentRoomId(): string {
    // TODO: Implement room detection
    return 'current_room'; // Placeholder
  }

  private getQuantumProgression(): QuantumProgression {
    // TODO: Implement quantum progression retrieval
    return {
      playerId: 'player',
      totalExperience: 0,
      quantumLevel: 0,
      artifacts: new Map(),
      skills: new Map(),
      discoveries: [],
      routeCompletions: { demo: 0, short10: [], short30: [], full: 0 },
      activeArtifacts: [],
      preferredElement: 'void',
      autoActivateNewArtifacts: true
    }; // Placeholder
  }
}

export default ShadowEncounterService;
