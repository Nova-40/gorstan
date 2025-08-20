/**
 * Objectives Service
 * Manages route objectives, progress tracking, and completion states
 */

import { type RouteManifest, type RouteProgress, type RouteNodeRef } from '../types/routes';

export interface ObjectiveState {
  id: string;
  label: string;
  description?: string;
  completed: boolean;
  required: boolean;
  progress?: number; // 0-100 for partial completion
  skipped?: boolean;
}

export interface ObjectivesProgress {
  objectives: ObjectiveState[];
  completed: number;
  total: number;
  required: number;
  completedRequired: number;
  canComplete: boolean; // True if all required objectives are done
  completionRate: number; // 0-100
}

export interface ObjectivesCallbacks {
  onObjectiveComplete?: (objective: ObjectiveState, progress: ObjectivesProgress) => void;
  onObjectiveSkip?: (objective: ObjectiveState, progress: ObjectivesProgress) => void;
  onProgressUpdate?: (progress: ObjectivesProgress) => void;
  onRouteComplete?: (progress: ObjectivesProgress) => void;
}

export class ObjectivesService {
  private manifest: RouteManifest;
  private callbacks: ObjectivesCallbacks;
  private objectives: Map<string, ObjectiveState> = new Map();
  private progress: RouteProgress;

  constructor(manifest: RouteManifest, callbacks: ObjectivesCallbacks = {}) {
    this.manifest = manifest;
    this.callbacks = callbacks;
    this.progress = this.initializeProgress();
    this.initializeObjectives();
  }

  private initializeProgress(): RouteProgress {
    return {
      routeId: this.manifest.id,
      currentNodeIndex: 0,
      currentNodeId: this.manifest.nodes[0]?.id || '',
      completedNodes: [],
      skippedNodes: [],
      elapsedTimeMs: 0,
      timeStarted: Date.now(),
      lastSaved: Date.now(),
      objectives: {
        completed: [],
        total: this.manifest.nodes.map(node => node.id),
      },
    };
  }

  private initializeObjectives(): void {
    this.manifest.nodes.forEach((node) => {
      const objective: ObjectiveState = {
        id: node.id,
        label: this.getNodeLabel(node),
        description: this.getNodeDescription(node),
        completed: false,
        required: node.required ?? false,
        progress: 0,
        skipped: false,
      };
      
      this.objectives.set(node.id, objective);
    });

    this.notifyProgressUpdate();
  }

  private getNodeLabel(node: RouteNodeRef): string {
    // Generate user-friendly labels based on node type and ID
    const typeLabels = {
      travel: 'Explore',
      quest: 'Complete',
      logicPuzzle: 'Solve',
      combat: 'Overcome',
      cinematic: 'Experience',
    };

    const baseLabel = typeLabels[node.type] || 'Complete';
    const friendlyName = this.formatNodeName(node.id);
    
    return `${baseLabel} ${friendlyName}`;
  }

  private getNodeDescription(node: RouteNodeRef): string {
    const descriptions = {
      travel: 'Navigate to the designated area',
      quest: 'Complete the associated quest or task',
      logicPuzzle: 'Solve the puzzle challenge',
      combat: 'Successfully handle the encounter',
      cinematic: 'Watch the story sequence',
    };

    return descriptions[node.type] || 'Complete this objective';
  }

  private formatNodeName(nodeId: string): string {
    // Convert node IDs to readable names
    return nodeId
      .replace(/^(demo_|runesprint_|catacomb_|faeglade_|clockwork_|trentpark_|nexus_|glitch_|fae_)/, '')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  getProgress(): ObjectivesProgress {
    const objectives = Array.from(this.objectives.values());
    const completed = objectives.filter(obj => obj.completed).length;
    const total = objectives.length;
    const required = objectives.filter(obj => obj.required).length;
    const completedRequired = objectives.filter(obj => obj.required && obj.completed).length;
    const canComplete = completedRequired === required;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      objectives,
      completed,
      total,
      required,
      completedRequired,
      canComplete,
      completionRate,
    };
  }

  completeObjective(nodeId: string, partialProgress?: number): boolean {
    const objective = this.objectives.get(nodeId);
    if (!objective) return false;

    if (partialProgress !== undefined) {
      objective.progress = Math.max(0, Math.min(100, partialProgress));
      if (objective.progress === 100) {
        objective.completed = true;
      }
    } else {
      objective.completed = true;
      objective.progress = 100;
    }

    // Update route progress
    if (objective.completed && !this.progress.completedNodes.includes(nodeId)) {
      this.progress.completedNodes.push(nodeId);
      this.progress.lastSaved = Date.now();
    }

    const currentProgress = this.getProgress();
    
    this.callbacks.onObjectiveComplete?.(objective, currentProgress);
    this.notifyProgressUpdate();

    // Check if route is complete
    if (currentProgress.canComplete) {
      this.callbacks.onRouteComplete?.(currentProgress);
    }

    return true;
  }

  skipObjective(nodeId: string): boolean {
    const objective = this.objectives.get(nodeId);
    if (!objective || objective.required) return false; // Can't skip required objectives

    objective.skipped = true;
    objective.completed = false;
    objective.progress = 0;

    // Update route progress
    if (!this.progress.skippedNodes.includes(nodeId)) {
      this.progress.skippedNodes.push(nodeId);
      this.progress.lastSaved = Date.now();
    }

    const currentProgress = this.getProgress();
    
    this.callbacks.onObjectiveSkip?.(objective, currentProgress);
    this.notifyProgressUpdate();

    return true;
  }

  setCurrentObjective(nodeId: string): void {
    this.progress.currentNodeId = nodeId;
    // Update currentNodeIndex to match
    const nodeIndex = this.manifest.nodes.findIndex(node => node.id === nodeId);
    if (nodeIndex >= 0) {
      this.progress.currentNodeIndex = nodeIndex;
    }
    this.progress.lastSaved = Date.now();
    this.notifyProgressUpdate();
  }

  getObjective(nodeId: string): ObjectiveState | undefined {
    return this.objectives.get(nodeId);
  }

  getCurrentObjective(): ObjectiveState | undefined {
    return this.objectives.get(this.progress.currentNodeId);
  }

  getNextRequiredObjective(): ObjectiveState | undefined {
    const objectives = Array.from(this.objectives.values());
    return objectives.find(obj => obj.required && !obj.completed && !obj.skipped);
  }

  canSkipObjectives(): boolean {
    return (this.manifest.allowedSkips ?? 0) > this.progress.skippedNodes.length;
  }

  getRemainingSkips(): number {
    return Math.max(0, (this.manifest.allowedSkips ?? 0) - this.progress.skippedNodes.length);
  }

  private notifyProgressUpdate(): void {
    const currentProgress = this.getProgress();
    this.callbacks.onProgressUpdate?.(currentProgress);
  }

  // Export/import for save system compatibility
  exportProgress(): RouteProgress {
    return {
      ...this.progress,
      lastSaved: Date.now(),
    };
  }

  importProgress(savedProgress: RouteProgress): void {
    if (savedProgress.routeId !== this.manifest.id) return;

    this.progress = savedProgress;

    // Update objective states based on saved progress
    savedProgress.completedNodes.forEach(nodeId => {
      const objective = this.objectives.get(nodeId);
      if (objective) {
        objective.completed = true;
        objective.progress = 100;
      }
    });

    savedProgress.skippedNodes.forEach((nodeId: string) => {
      const objective = this.objectives.get(nodeId);
      if (objective) {
        objective.skipped = true;
        objective.completed = false;
        objective.progress = 0;
      }
    });

    this.notifyProgressUpdate();
  }
}

// React Hook for using ObjectivesService
import { useEffect, useState } from 'react';

export function useObjectives(manifest: RouteManifest, callbacks?: ObjectivesCallbacks) {
  const [service] = useState(() => new ObjectivesService(manifest, callbacks));
  const [progress, setProgress] = useState<ObjectivesProgress>(() => service.getProgress());

  useEffect(() => {
    // Update progress when callbacks might have changed
    const currentProgress = service.getProgress();
    setProgress(currentProgress);
  }, [service, callbacks]);

  const completeObjective = (nodeId: string, partialProgress?: number) => {
    const success = service.completeObjective(nodeId, partialProgress);
    if (success) {
      setProgress(service.getProgress());
    }
    return success;
  };

  const skipObjective = (nodeId: string) => {
    const success = service.skipObjective(nodeId);
    if (success) {
      setProgress(service.getProgress());
    }
    return success;
  };

  const setCurrentObjective = (nodeId: string) => {
    service.setCurrentObjective(nodeId);
    setProgress(service.getProgress());
  };

  return {
    progress,
    service,
    completeObjective,
    skipObjective,
    setCurrentObjective,
    getObjective: (nodeId: string) => service.getObjective(nodeId),
    getCurrentObjective: () => service.getCurrentObjective(),
    getNextRequiredObjective: () => service.getNextRequiredObjective(),
    canSkipObjectives: () => service.canSkipObjectives(),
    getRemainingSkips: () => service.getRemainingSkips(),
    exportProgress: () => service.exportProgress(),
    importProgress: (savedProgress: RouteProgress) => service.importProgress(savedProgress),
  };
}
