import React from 'react';
import { describe, test, expect } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProvider } from '../test-utils/renderWithProvider';
import { useGameActions, useGameState } from '../context/GameContext';

function HarnessButtons() {
  const actions = useGameActions();
  const state = useGameState();
  return (
    <div>
      <div data-testid="room">{state.currentRoomId}</div>
      <div data-testid="inventory">{(state.inventory || []).join(',')}</div>
      <div data-testid="msgs">{(state.messageEntries || []).length}</div>
      <div data-testid="last">{state.messageEntries.length ? state.messageEntries[state.messageEntries.length - 1].text : ''}</div>
      <button onClick={() => actions.addItem('schrodinger_coin')}>AddCoin</button>
      <button onClick={() => actions.removeItem('schrodinger_coin')}>DropCoin</button>
    </div>
  );
}

describe('Schrödinger coin — provider façade behavior', () => {
  test('picking up the coin adds it once and emits one line', async () => {
    renderWithProvider(<HarnessButtons />);

    expect(screen.getByTestId('inventory').textContent).toBe('');
    const beforeMsgs = Number(screen.getByTestId('msgs').textContent || '0');

    fireEvent.click(screen.getByText('AddCoin'));

    expect(screen.getByTestId('inventory').textContent).toContain('schrodinger_coin');

    const afterMsgs = Number(screen.getByTestId('msgs').textContent || '0');
    expect(afterMsgs - beforeMsgs).toBe(1);
    expect(screen.getByTestId('last').textContent || '').toMatch(/collapse/i);
  });

  test('dropping the coin outside the café is rejected with exactly one message and inventory unchanged', async () => {
    renderWithProvider(<HarnessButtons />, { initialStateOverrides: { currentRoomId: 'control_nexus', inventory: ['schrodinger_coin'] } });

    expect(screen.getByTestId('room').textContent).toBe('control_nexus');
    expect(screen.getByTestId('inventory').textContent).toContain('schrodinger_coin');
    const beforeMsgs = Number(screen.getByTestId('msgs').textContent || '0');

    fireEvent.click(screen.getByText('DropCoin'));

    expect(screen.getByTestId('inventory').textContent).toContain('schrodinger_coin');

    const afterMsgs = Number(screen.getByTestId('msgs').textContent || '0');
    expect(afterMsgs - beforeMsgs).toBe(1);
    expect(screen.getByTestId('last').textContent || '').toMatch(/pockets are inexplicably empty|refuses to exist|café/i);
  });

  test('dropping the coin in the café removes it from inventory and places it with one message', async () => {
    renderWithProvider(<HarnessButtons />, { initialStateOverrides: { currentRoomId: 'cafe_main', inventory: ['schrodinger_coin'] } });

    expect(screen.getByTestId('room').textContent).toBe('cafe_main');
    expect(screen.getByTestId('inventory').textContent).toContain('schrodinger_coin');
    const beforeMsgs = Number(screen.getByTestId('msgs').textContent || '0');

    fireEvent.click(screen.getByText('DropCoin'));

    expect(screen.getByTestId('inventory').textContent).not.toContain('schrodinger_coin');

    const afterMsgs = Number(screen.getByTestId('msgs').textContent || '0');
    expect(afterMsgs - beforeMsgs).toBe(1);
    expect(screen.getByTestId('last').textContent || '').toMatch(/set the coin back down|set the coin/i);
  });
});
