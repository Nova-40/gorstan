import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import RoomRenderer from '../RoomRenderer';

const dispatchMock = vi.fn();

vi.mock('../../state/gameState', () => ({
  useGameState: () => ({
    state: {
      currentRoomId: 'findlaterscornercoffeeshop',
      player: {
        name: 'Tester',
        flags: {},
      },
      roomMap: {
        findlaterscornercoffeeshop: {
          id: 'findlaterscornercoffeeshop',
          title: "Findlater's Corner Coffee Shop",
          description: ['A familiar café waits for testing.'],
          image: 'londonzone_findlaters.png',
          exits: {
            north: 'cafeoffice',
          },
          clickHotspots: [
            {
              id: 'cafe-office-exit',
              label: 'Café Office',
              command: 'go north',
              description: 'Go through to the café office.',
              x: 50,
              y: 18,
              width: 16,
              height: 16,
            },
            {
              id: 'coffee-counter',
              label: 'Coffee Counter',
              command: 'examine coffee_counter',
              description: 'Examine the coffee counter.',
              x: 58,
              y: 62,
              width: 28,
              height: 18,
            },
          ],
        },
      },
    },
    dispatch: dispatchMock,
  }),
}));

describe('RoomRenderer hotspots', () => {
  beforeEach(() => {
    dispatchMock.mockClear();
  });

  it('renders accessible hotspot controls over the room image', () => {
    render(<RoomRenderer />);

    expect(screen.getByRole('button', { name: 'Café Office: go north' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Coffee Counter: examine coffee_counter' })
    ).toBeInTheDocument();
  });

  it('dispatches the same parser command string a typed command would use', () => {
    const typedParserCommand = 'go north';

    render(<RoomRenderer />);

    fireEvent.click(screen.getByRole('button', { name: 'Café Office: go north' }));

    expect(dispatchMock).toHaveBeenCalledWith({
      type: 'COMMAND_INPUT',
      payload: typedParserCommand,
    });
  });

  it('routes examine hotspots through COMMAND_INPUT rather than custom React logic', () => {
    const typedParserCommand = 'examine coffee_counter';

    render(<RoomRenderer />);

    fireEvent.click(
      screen.getByRole('button', { name: 'Coffee Counter: examine coffee_counter' })
    );

    expect(dispatchMock).toHaveBeenCalledWith({
      type: 'COMMAND_INPUT',
      payload: typedParserCommand,
    });
  });
});
