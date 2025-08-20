// Celebrate module for managing celebrations in the game
import React from 'react';
import { useSeasonalController } from './seasonal/useSeasonalController';

export interface Celebration {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  isActive: () => boolean;
}

interface CelebrationControllerProps {
  children: React.ReactNode;
}

export const CelebrationController: React.FC<CelebrationControllerProps> = ({ children }) => {
  useSeasonalController();
  return <>{children}</>;
};

export class CelebrationManager {
  private celebrations: Celebration[] = [];

  addCelebration(celebration: Celebration): void {
    this.celebrations.push(celebration);
  }

  getActiveCelebrations(): Celebration[] {
    return this.celebrations.filter((celebration) => celebration.isActive());
  }

  getCelebrationById(id: string): Celebration | undefined {
    return this.celebrations.find((celebration) => celebration.id === id);
  }

  removeCelebration(id: string): void {
    this.celebrations = this.celebrations.filter((celebration) => celebration.id !== id);
  }
}

// Example usage
const celebrationManager = new CelebrationManager();

celebrationManager.addCelebration({
  id: '1',
  name: 'New Year',
  description: 'Celebrate the start of the new year!',
  startDate: new Date('2025-12-31T00:00:00Z'),
  endDate: new Date('2026-01-01T23:59:59Z'),
  isActive: function () {
    const now = new Date();
    return now >= this.startDate && now <= this.endDate;
  },
});

export default celebrationManager;
