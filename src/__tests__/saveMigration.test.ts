import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import SaveGameModal from '../components/SaveGameModal';
import {
  SaveManager,
  parseSaveSlotId,
  type SaveFile,
} from '../services/SaveManager';
import type { LocalGameState } from '../types/GameTypes';

function createGameState(overrides: Partial<LocalGameState> = {}): LocalGameState {
  return {
    stage: 'game',
    transition: null,
    player: {
      id: 'player-1',
      name: 'Test Pilot',
      health: 100,
      inventory: [],
      score: 42,
    },
    history: [],
    currentRoomId: 'controlnexus',
    roomMap: {},
    flags: {},
    npcsInRoom: [],
    roomVisitCount: {},
    gameTime: {
      day: 1,
      hour: 9,
      minute: 0,
      startTime: 0,
      currentTime: 0,
      timeScale: 1,
    },
    settings: {
      soundEnabled: true,
      fullscreen: false,
      cheatMode: false,
      difficulty: 'normal',
      autoSave: true,
      autoSaveInterval: 60,
      musicEnabled: true,
      animationsEnabled: true,
      textSpeed: 50,
      fontSize: 'medium',
      theme: 'auto',
      debugMode: false,
    },
    metadata: {
      resetCount: 0,
      version: '3.8.8',
      lastSaved: null,
      playTime: 123,
      achievements: [],
    },
    ...overrides,
  };
}

function createSaveFile(overrides: Partial<SaveFile> = {}): SaveFile {
  return {
    version: SaveManager.CURRENT_VERSION,
    saveName: 'Checkpoint',
    playerName: 'Test Pilot',
    progress: {
      questsCompleted: 0,
      achievementsUnlocked: 0,
      totalScore: 42,
      totalPlayTime: 123,
      roomsVisited: 1,
      secretsFound: 0,
      characterInteractions: 0,
    },
    timestamp: new Date('2026-06-09T09:00:00.000Z').toISOString(),
    gameState: createGameState(),
    metadata: {
      saveVersion: SaveManager.CURRENT_VERSION,
      gameVersion: '3.8.8',
    },
    ...overrides,
  };
}

describe('save slot coherence', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it('saves to a numeric slot and lists the same slot metadata', async () => {
    const result = await SaveManager.save(3, createSaveFile());

    expect(result.success).toBe(true);
    expect(window.localStorage.getItem('save_slot_3')).toBeTruthy();

    const slots = await SaveManager.listSlots();
    expect(slots).toHaveLength(1);
    expect(slots[0]).toMatchObject({
      slot: 3,
      saveName: 'Checkpoint',
      playerName: 'Test Pilot',
      currentRoom: 'controlnexus',
      totalScore: 42,
      playTime: 123,
    });
  });

  it('rejects invalid slot ids safely', async () => {
    const saveResult = await SaveManager.save(Number.NaN, createSaveFile());

    expect(saveResult.success).toBe(false);
    expect(parseSaveSlotId('save_123')).toBeNull();
    expect(parseSaveSlotId('11')).toBeNull();
    expect(parseSaveSlotId('4')).toBe(4);
    expect(await SaveManager.load(Number.NaN)).toBeNull();
    expect(SaveManager.deleteSave(Number.NaN)).toBe(false);
  });

  it('deletes the same numeric slot that it lists and loads', async () => {
    await SaveManager.save(2, createSaveFile({ saveName: 'Disposable' }));

    expect((await SaveManager.listSlots()).map((slot) => slot.slot)).toEqual([2]);
    expect(SaveManager.deleteSave(2)).toBe(true);
    expect(await SaveManager.load(2)).toBeNull();
    expect(await SaveManager.listSlots()).toEqual([]);
  });

  it('ignores malformed modern slot data and still lists valid saves', async () => {
    window.localStorage.setItem('save_slot_0', '{not valid json');
    await SaveManager.save(1, createSaveFile({ saveName: 'Healthy Slot' }));

    const slots = await SaveManager.listSlots();
    expect(slots).toHaveLength(1);
    expect(slots[0].slot).toBe(1);
    expect(slots[0].saveName).toBe('Healthy Slot');
  });

  it('modal uses the first empty numeric slot for new saves', () => {
    const onSave = vi.fn();

    render(
      React.createElement(SaveGameModal, {
        isOpen: true,
        onClose: () => {},
        onSave,
        onLoad: () => {},
        onDelete: () => {},
        saveSlots: [
          {
            id: 0,
            name: 'Slot Zero',
            playerName: 'Test Pilot',
            currentRoom: 'controlnexus',
            timestamp: 100,
            score: 1,
            playTime: 10,
          },
        ],
      }),
    );

    fireEvent.change(screen.getByPlaceholderText(/enter save name/i), {
      target: { value: 'New Save' },
    });
    fireEvent.click(screen.getByRole('button', { name: /^save$/i }));

    expect(onSave).toHaveBeenCalledWith(1, 'New Save');
  });

  it('modal overwrites the selected numeric slot when one is chosen', () => {
    const onSave = vi.fn();
    const confirmSpy = vi.fn(() => true);
    Object.defineProperty(window, 'confirm', {
      configurable: true,
      writable: true,
      value: confirmSpy,
    });

    render(
      React.createElement(SaveGameModal, {
        isOpen: true,
        onClose: () => {},
        onSave,
        onLoad: () => {},
        onDelete: () => {},
        saveSlots: [
          {
            id: 0,
            name: 'Slot Zero',
            playerName: 'Test Pilot',
            currentRoom: 'controlnexus',
            timestamp: 100,
            score: 1,
            playTime: 10,
          },
        ],
      }),
    );

    fireEvent.click(screen.getByText(/slot 1: slot zero/i));
    fireEvent.change(screen.getByPlaceholderText(/enter save name/i), {
      target: { value: 'Overwrite Me' },
    });
    fireEvent.click(screen.getByRole('button', { name: /overwrite/i }));
    fireEvent.click(screen.getByTitle(/delete this save/i));

    expect(onSave).toHaveBeenCalledWith(0, 'Overwrite Me');
    expect(confirmSpy).toHaveBeenCalled();
  });
});
