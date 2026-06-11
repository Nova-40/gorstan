import React from 'react';
import { render, cleanup } from '@testing-library/react';
import GameProvider from '../context/GameContext';

export function renderWithProvider(ui: React.ReactElement, options?: { initialStateOverrides?: any } & any) {
  const Wrapper = ({ children }: { children?: React.ReactNode }) => (
    <GameProvider initialStateOverrides={options?.initialStateOverrides}>{children}</GameProvider>
  );
  // Ensure any previous renders are cleaned up (some tests call render multiple times)
  try {
    cleanup();
  } catch {
    // ignore
  }

  return { ...render(ui, { wrapper: Wrapper, ...options }) };
}

export default renderWithProvider;
