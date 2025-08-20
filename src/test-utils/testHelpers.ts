/// <reference types="jest" />

/**
 * Test helper utilities
 */

import { render, RenderResult } from '@testing-library/react';
import React, { ReactElement } from 'react';
import { GameStateProvider } from '../state/gameState';
import type { LocalGameState } from '../state/gameState';

/**
 * Custom render function that wraps components with GameStateProvider
 */
export function renderWithGameState(
  ui: ReactElement,
  _gameState?: Partial<LocalGameState>
): RenderResult {
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return React.createElement(GameStateProvider, { children });
  };

  return render(ui, { wrapper: Wrapper });
}

/**
 * Create a mock dispatch function for testing
 */
export const createMockDispatch = () => jest.fn();

/**
 * Wait for async operations to complete
 */
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0));

/**
 * Mock implementations for common game functions
 */
export const mockGameFunctions = {
  playSound: jest.fn(),
  saveGame: jest.fn().mockResolvedValue(true),
  loadGame: jest.fn().mockResolvedValue({}),
  processCommand: jest.fn().mockResolvedValue({
    messages: [],
    updates: {},
  }),
};
