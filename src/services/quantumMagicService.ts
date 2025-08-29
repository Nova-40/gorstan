/**
 * Quantum Magic Service
 * Manages artifact discovery, skill progression, and quantum abilities
 */

import { type QuantumProgression, type QuantumArtifact, type QuantumSkill, type QuantumDiscovery, type ExperienceGain, type QuantumGameState, type ArtifactEffect, type SkillEffect, type SkillRequirement } from '../types/quantumMagic';
import { quantumArtifacts, quantumSkills, experienceValues, calculateQuantumLevel } from '../data/quantumMagic';

export interface QuantumMagicCallbacks {
  onArtifactDiscovered?: (artifact: QuantumArtifact, discovery: QuantumDiscovery) => void;
  onSkillUnlocked?: (skill: QuantumSkill) => void;
  onLevelUp?: (newLevel: number, previousLevel: number) => void;
  onSynergyActivated?: (artifacts: QuantumArtifact[]) => void;
  onExperienceGained?: (gain: ExperienceGain) => void;
}

export class QuantumMagicService {
  private progression: QuantumProgression;
  private callbacks: QuantumMagicCallbacks;
  private gameState: QuantumGameState;

  constructor(progression: QuantumProgression, callbacks: QuantumMagicCallbacks = {}) {
    this.progression = progression;
    this.callbacks = callbacks;
    this.gameState = this.initializeGameState();
  }

  private initializeGameState(): QuantumGameState {
    return {
      progression: this.progression,
      activePuzzleHints: [],
      activeCombatBonuses: [],
      activeDetectionBoosts: [],
      availableSkips: 0,
      pendingDiscoveries: [],
      discoverySequence: 0,
    };
  }

  // Discovery System
  async discoverArtifact(artifactId: string, routeId: string, nodeId: string): Promise<QuantumDiscovery | null> {
    const artifactData = quantumArtifacts[artifactId];
    if (!artifactData) return null;

    // Check if already discovered
    if (this.progression.artifacts.has(artifactId)) {
      // Instead of discovering, gain experience for the existing artifact
      this.gainArtifactExperience(artifactId, experienceValues.discovery.artifact / 2);
      return null;
    }

    // Create artifact instance
    const artifact: QuantumArtifact = {
      ...artifactData,
      discoveryLocation: nodeId,
      discoveryRoute: routeId,
      isActive: this.shouldAutoActivate(artifactData),
    };

    this.progression.artifacts.set(artifactId, artifact);

    // Create discovery event
    const discovery: QuantumDiscovery = {
      id: `discovery_${Date.now()}_${this.gameState.discoverySequence++}`,
      type: 'artifact',
      routeId,
      nodeId,
      timestamp: Date.now(),
      artifactId,
      title: `Discovered: ${artifact.name}`,
      description: artifact.description,
      rarity: this.getTierRarity(artifact.tier),
      element: artifact.element,
    };

    this.gameState.pendingDiscoveries.push(discovery);

    // Gain experience
    this.gainExperience({
      source: 'discovery',
      amount: experienceValues.discovery.artifact,
      artifactId,
    });

    // Check for skill unlocks
    this.checkSkillUnlocks(artifact);

    // Check for synergies
    this.checkArtifactSynergies(artifact);

    // Auto-activate if appropriate
    if (artifact.isActive) {
      this.activateArtifact(artifactId);
    }

    this.callbacks.onArtifactDiscovered?.(artifact, discovery);
    return discovery;
  }

  private shouldAutoActivate(artifact: QuantumArtifact): boolean {
    if (!this.progression.autoActivateNewArtifacts) return false;
    
    // Auto-activate if we have space and it's not already covered
    const activeCount = this.progression.activeArtifacts.length;
    if (activeCount >= 3) return false;

    // Don't auto-activate if we already have this element active
    const activeElements = this.progression.activeArtifacts
      .map(id => this.progression.artifacts.get(id)?.element)
      .filter(Boolean);
    
    return !activeElements.includes(artifact.element);
  }

  private getTierRarity(tier: string): 'common' | 'uncommon' | 'rare' | 'legendary' {
    const tierMap = {
      'shard': 'common' as const,
      'relic': 'uncommon' as const,
      'nexus': 'rare' as const,
      'legendary': 'legendary' as const,
    };
    return tierMap[tier as keyof typeof tierMap] || 'common';
  }

  // Skill System
  private checkSkillUnlocks(artifact: QuantumArtifact): void {
    for (const effect of artifact.effects) {
      if (effect.type === 'skill_unlock') {
        const skillId = effect.target;
        const skill = quantumSkills[skillId];
        
        if (skill && !this.progression.skills.has(skillId)) {
          this.unlockSkill(skillId);
        }
      }
    }
  }

  private unlockSkill(skillId: string): void {
    const skillData = quantumSkills[skillId];
    if (!skillData) return;

    const skill: QuantumSkill = {
      ...skillData,
      currentLevel: 0,
      experience: 0,
    };

    this.progression.skills.set(skillId, skill);
    this.callbacks.onSkillUnlocked?.(skill);

    // Create skill unlock discovery
    const discovery: QuantumDiscovery = {
      id: `skill_unlock_${Date.now()}_${this.gameState.discoverySequence++}`,
      type: 'skill_unlock',
      routeId: this.gameState.currentRoute || 'unknown',
      nodeId: this.gameState.currentNode || 'unknown',
      timestamp: Date.now(),
      skillId,
      title: `Skill Unlocked: ${skill.name}`,
      description: skill.description,
      rarity: 'uncommon',
      element: skill.element,
    };

    this.gameState.pendingDiscoveries.push(discovery);
  }

  // Experience and Leveling
  gainExperience(gain: ExperienceGain): void {
    const previousLevel = this.progression.quantumLevel;
    this.progression.totalExperience += gain.amount;
    
    // Apply multipliers from active artifacts
    const finalAmount = this.applyExperienceMultipliers(gain);
    
    // Distribute to artifact if specified
    if (gain.artifactId) {
      this.gainArtifactExperience(gain.artifactId, finalAmount);
    }

    // Distribute to skills if specified
    if (gain.skillIds) {
      const skillAmount = Math.floor(finalAmount / gain.skillIds.length);
      gain.skillIds.forEach(skillId => {
        this.gainSkillExperience(skillId, skillAmount);
      });
    }

    // Check for level up
    const newLevel = calculateQuantumLevel(this.progression.totalExperience);
    if (newLevel > previousLevel) {
      this.progression.quantumLevel = newLevel;
      this.callbacks.onLevelUp?.(newLevel, previousLevel);
    }

    this.callbacks.onExperienceGained?.(gain);
  }

  private applyExperienceMultipliers(gain: ExperienceGain): number {
    let multiplier = gain.multiplier || 1.0;
    
    // Apply active artifact bonuses
    for (const artifactId of this.progression.activeArtifacts) {
      const artifact = this.progression.artifacts.get(artifactId);
      if (artifact) {
        for (const effect of artifact.effects) {
          if (effect.type === 'ability_enhance' && effect.target === 'experience_gain') {
            multiplier += (effect.value as number) / 100;
          }
        }
      }
    }

    return Math.floor(gain.amount * multiplier);
  }

  private gainArtifactExperience(artifactId: string, amount: number): void {
    const artifact = this.progression.artifacts.get(artifactId);
    if (!artifact) return;

    artifact.experience += amount;
    
    // Check for artifact level up
    const experienceNeeded = this.getArtifactExperienceNeeded(artifact.level);
    if (artifact.experience >= experienceNeeded && artifact.level < artifact.maxLevel) {
      artifact.level++;
      artifact.experience -= experienceNeeded;
      
      // Artifact level ups might unlock new effects or enhance existing ones
      this.updateArtifactEffects(artifact);
    }
  }

  private gainSkillExperience(skillId: string, amount: number): void {
    const skill = this.progression.skills.get(skillId);
    if (!skill) return;

    skill.experience += amount;
    
    // Check for skill level up
    if (skill.experience >= skill.experienceToNext && skill.currentLevel < skill.maxLevel) {
      skill.currentLevel++;
      skill.experience -= skill.experienceToNext;
      skill.experienceToNext = this.getSkillExperienceNeeded(skill.currentLevel + 1);
      
      // Skill level ups enhance effects
      this.updateSkillEffects(skill);
      
      // Check if this unlocks new skills
      this.checkSkillChainUnlocks(skill);
    }
  }

  private getArtifactExperienceNeeded(level: number): number {
    return level * 200 + 100; // Scaling experience requirements
  }

  private getSkillExperienceNeeded(level: number): number {
    return level * level * 50; // Exponential scaling
  }

  // Artifact Management
  activateArtifact(artifactId: string): boolean {
    if (this.progression.activeArtifacts.length >= 3) {
      return false; // Maximum 3 active artifacts
    }

    if (this.progression.activeArtifacts.includes(artifactId)) {
      return false; // Already active
    }

    const artifact = this.progression.artifacts.get(artifactId);
    if (!artifact) return false;

    this.progression.activeArtifacts.push(artifactId);
    artifact.isActive = true;
    
    // Apply artifact effects to game state
    this.updateGameStateFromArtifacts();
    
    // Check for new synergies
    this.checkArtifactSynergies(artifact);
    
    return true;
  }

  deactivateArtifact(artifactId: string): boolean {
    const index = this.progression.activeArtifacts.indexOf(artifactId);
    if (index === -1) return false;

    this.progression.activeArtifacts.splice(index, 1);
    
    const artifact = this.progression.artifacts.get(artifactId);
    if (artifact) {
      artifact.isActive = false;
    }
    
    // Update game state
    this.updateGameStateFromArtifacts();
    
    return true;
  }

  private updateGameStateFromArtifacts(): void {
    // Reset active effects
    this.gameState.activePuzzleHints = [];
    this.gameState.activeCombatBonuses = [];
    this.gameState.activeDetectionBoosts = [];
    this.gameState.availableSkips = 0;

    // Apply effects from all active artifacts
    for (const artifactId of this.progression.activeArtifacts) {
      const artifact = this.progression.artifacts.get(artifactId);
      if (!artifact) continue;

      for (const effect of artifact.effects) {
        this.applyEffectToGameState(effect, artifact);
      }
    }

    // Apply effects from active skills
    for (const [, skill] of this.progression.skills) {
      if (skill.currentLevel > 0) {
        for (const effect of skill.effects) {
          this.applySkillEffectToGameState(effect, skill);
        }
      }
    }
  }

  private applyEffectToGameState(effect: ArtifactEffect, _artifact: QuantumArtifact): void {
    switch (effect.type) {
      case 'ability_enhance':
        if (effect.target === 'puzzle_solving') {
          this.gameState.activePuzzleHints.push(effect.description);
        }
        break;
      case 'detection':
        this.gameState.activeDetectionBoosts.push({
          type: 'detection_range',
          description: effect.description,
          value: effect.value,
          conditions: []
        });
        break;
      case 'traversal':
        // Fast travel and movement enhancements handled by route system
        break;
    }
  }

  private applySkillEffectToGameState(effect: SkillEffect, skill: QuantumSkill): void {
    switch (effect.type) {
      case 'skip_unlock':
        this.gameState.availableSkips += skill.currentLevel;
        break;
      case 'puzzle_hint':
        this.gameState.activePuzzleHints.push(
          `${skill.name}: ${effect.description} (Level ${skill.currentLevel})`
        );
        break;
      case 'combat_bonus':
        this.gameState.activeCombatBonuses.push(effect);
        break;
    }
  }

  // Synergy System
  private checkArtifactSynergies(artifact: QuantumArtifact): void {
    if (!artifact.synergies) return;

    const activeSynergies: string[] = [];
    
    for (const synergyId of artifact.synergies) {
      if (this.progression.activeArtifacts.includes(synergyId)) {
        activeSynergies.push(synergyId);
      }
    }

    if (activeSynergies.length > 0) {
      const synergyArtifacts = [artifact, ...activeSynergies.map(id => this.progression.artifacts.get(id)!).filter(Boolean)];
      this.activateSynergy(synergyArtifacts);
    }
  }

  private activateSynergy(artifacts: QuantumArtifact[]): void {
    // Create synergy discovery
    const discovery: QuantumDiscovery = {
      id: `synergy_${Date.now()}_${this.gameState.discoverySequence++}`,
      type: 'synergy',
      routeId: this.gameState.currentRoute || 'unknown',
      nodeId: this.gameState.currentNode || 'unknown',
      timestamp: Date.now(),
      synergyPartners: artifacts.map(a => a.id),
      title: 'Quantum Synergy Activated!',
      description: `${artifacts.map(a => a.name).join(' + ')} are resonating together!`,
      rarity: 'rare',
      element: artifacts[0]?.element || 'void',
    };

    this.gameState.pendingDiscoveries.push(discovery);

    // Gain synergy experience
    const firstArtifact = artifacts[0];
    if (firstArtifact) {
      this.gainExperience({
        source: 'synergy_activated',
        amount: experienceValues.discovery.synergy,
        artifactId: firstArtifact.id,
      });
    }

    this.callbacks.onSynergyActivated?.(artifacts);
  }

  private updateArtifactEffects(artifact: QuantumArtifact): void {
    // Enhance artifact effects based on level
    for (const effect of artifact.effects) {
      if (typeof effect.value === 'number') {
        effect.value = Math.floor(effect.value * (1 + artifact.level * 0.2));
      }
    }
  }

  private updateSkillEffects(skill: QuantumSkill): void {
    // Enhance skill effects based on level
    for (const effect of skill.effects) {
      if (typeof effect.value === 'number') {
        effect.value = Math.floor(effect.value * (1 + skill.currentLevel * 0.15));
      }
    }
  }

  private checkSkillChainUnlocks(skill: QuantumSkill): void {
    for (const unlockSkillId of skill.unlocks) {
      const unlockSkill = quantumSkills[unlockSkillId];
      if (unlockSkill && !this.progression.skills.has(unlockSkillId)) {
        // Check if all requirements are met
        const canUnlock = unlockSkill.requirements.every(req => this.checkRequirement(req));
        if (canUnlock) {
          this.unlockSkill(unlockSkillId);
        }
      }
    }
  }

  private checkRequirement(requirement: SkillRequirement): boolean {
    switch (requirement.type) {
      case 'skill':
        const skill = this.progression.skills.get(requirement.target);
        return skill ? skill.currentLevel >= (requirement.level || 1) : false;
      case 'artifact':
        return this.progression.artifacts.has(requirement.target);
      case 'route_completion':
        // Check route completion requirements
        return this.checkRouteCompletion(requirement.target, requirement.level || 1);
      case 'discovery':
        // Check if discovery has been made
        return this.progression.discoveries.includes(requirement.target);
      default:
        return false;
    }
  }

  private checkRouteCompletion(routeType: string, level: number): boolean {
    switch (routeType) {
      case 'demo':
        return this.progression.routeCompletions.demo >= level;
      case 'short10':
        return this.progression.routeCompletions.short10.length >= level;
      case 'short30':
        return this.progression.routeCompletions.short30.length >= level;
      case 'full':
        return this.progression.routeCompletions.full >= level;
      default:
        return false;
    }
  }

  // Public API
  getProgression(): QuantumProgression {
    return this.progression;
  }

  getGameState(): QuantumGameState {
    return this.gameState;
  }

  getPendingDiscoveries(): QuantumDiscovery[] {
    return [...this.gameState.pendingDiscoveries];
  }

  clearPendingDiscoveries(): void {
    this.gameState.pendingDiscoveries = [];
  }

  setCurrentLocation(routeId: string, nodeId: string): void {
    this.gameState.currentRoute = routeId;
    this.gameState.currentNode = nodeId;
  }

  // Route completion tracking
  completeRoute(routeId: string): void {
    if (routeId === 'demo') {
      this.progression.routeCompletions.demo++;
    } else if (routeId === 'full') {
      this.progression.routeCompletions.full++;
    } else if (routeId.startsWith('short10_')) {
      if (!this.progression.routeCompletions.short10.includes(routeId)) {
        this.progression.routeCompletions.short10.push(routeId);
      }
    } else if (routeId.startsWith('short30_')) {
      if (!this.progression.routeCompletions.short30.includes(routeId)) {
        this.progression.routeCompletions.short30.push(routeId);
      }
    }

    // Gain completion experience
    const experienceType = routeId === 'demo' ? 'demo' :
                          routeId === 'full' ? 'full' :
                          routeId.startsWith('short10_') ? 'short10' : 'short30';
    
    this.gainExperience({
      source: 'route_completed',
      amount: experienceValues.routeCompleted[experienceType as keyof typeof experienceValues.routeCompleted],
    });
  }

  // Export/Import for save system
  exportProgression(): QuantumProgression {
    return {
      ...this.progression,
      artifacts: new Map(this.progression.artifacts),
      skills: new Map(this.progression.skills),
    };
  }

  importProgression(progression: QuantumProgression): void {
    this.progression = progression;
    this.gameState.progression = progression;
    this.updateGameStateFromArtifacts();
  }
}

// React Hook for using QuantumMagicService
import { useEffect, useState } from 'react';

export function useQuantumMagic(initialProgression: QuantumProgression, callbacks?: QuantumMagicCallbacks) {
  const [service] = useState(() => new QuantumMagicService(initialProgression, callbacks));
  const [progression, setProgression] = useState<QuantumProgression>(() => service.getProgression());
  const [gameState, setGameState] = useState(() => service.getGameState());

  useEffect(() => {
    // Update local state when service changes
    setProgression(service.getProgression());
    setGameState(service.getGameState());
  }, [service]);

  return {
    service,
    progression,
    gameState,
    discoverArtifact: (artifactId: string, routeId: string, nodeId: string) => {
      return service.discoverArtifact(artifactId, routeId, nodeId);
    },
    gainExperience: (gain: ExperienceGain) => {
      service.gainExperience(gain);
      setProgression(service.getProgression());
      setGameState(service.getGameState());
    },
    activateArtifact: (artifactId: string) => {
      const success = service.activateArtifact(artifactId);
      if (success) {
        setProgression(service.getProgression());
        setGameState(service.getGameState());
      }
      return success;
    },
    deactivateArtifact: (artifactId: string) => {
      const success = service.deactivateArtifact(artifactId);
      if (success) {
        setProgression(service.getProgression());
        setGameState(service.getGameState());
      }
      return success;
    },
    completeRoute: (routeId: string) => {
      service.completeRoute(routeId);
      setProgression(service.getProgression());
      setGameState(service.getGameState());
    },
    setCurrentLocation: (routeId: string, nodeId: string) => {
      service.setCurrentLocation(routeId, nodeId);
      setGameState(service.getGameState());
    },
  };
}
