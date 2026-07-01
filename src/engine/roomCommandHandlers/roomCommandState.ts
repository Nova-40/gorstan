import type { LocalGameState } from '../../state/gameState';

export const getBooleanFlag = (gameState: any, flagName: string): boolean =>
  Boolean(gameState?.flags?.[flagName] ?? gameState?.gameFlags?.[flagName] ?? gameState?.[flagName]);

export const getExistingFlags = (gameState: any): Record<string, boolean> => ({
  ...(gameState?.flags || {}),
  ...(gameState?.gameFlags || {}),
});

export const setBooleanFlagUpdate = (
  gameState: LocalGameState,
  flagName: string,
): Partial<LocalGameState> =>
  ({
    flags: {
      ...getExistingFlags(gameState),
      [flagName]: true,
    },
  }) as Partial<LocalGameState>;

export const mergeBooleanFlagUpdates = (
  gameState: LocalGameState,
  ...flagNames: string[]
): Partial<LocalGameState> =>
  ({
    flags: {
      ...getExistingFlags(gameState),
      ...Object.fromEntries(flagNames.map((flagName) => [flagName, true])),
    },
  }) as Partial<LocalGameState>;

export const roomTransitionUpdate = (
  gameState: LocalGameState,
  roomId: string,
): Partial<LocalGameState> =>
  ({
    currentRoomId: roomId,
    currentRoom: roomId,
    player: {
      ...((gameState as any).player || {}),
      currentRoom: roomId,
    },
  }) as Partial<LocalGameState>;

export const hasAnyFlag = (gameState: any, ...flagNames: string[]): boolean =>
  flagNames.some((flagName) => getBooleanFlag(gameState, flagName));
