/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.

  AppCore game shell: visual composition for the four-quadrant game layout.

  This component is intentionally presentational. AppCore still owns state,
  handlers and side effects until the later controller extraction pass.
*/

import React from 'react';

import CommandInput from '../CommandInput';
import OpeningBriefing from '../OpeningBriefing';
import type { NPC } from '../../types/NPCTypes';
import type { AppCoreDirectionAvailability, AppCoreDirectionTitles } from './AppCoreTypes';
import {
  RoomRenderer,
  TerminalConsole,
  PlayerStatsPanel,
  PresentNPCsPanel,
  QuickActionsPanel,
  ProgressDashboard,
} from './AppCoreLazyComponents';

interface GameShellProps {
  readonly history: unknown[];
  readonly playerName: string;
  readonly npcsInRoom: NPC[];
  readonly availableDirections: AppCoreDirectionAvailability;
  readonly directionRoomTitles: AppCoreDirectionTitles;
  readonly currentRoomId: string;
  readonly isFullscreen: boolean;
  readonly soundOn: boolean;
  readonly isDemoActive: boolean;
  readonly ctrlClickOnInstructions: boolean;
  readonly canBackout: boolean;
  readonly onCommand: (command: string) => void;
  readonly onTalkToNPC: (npc?: NPC) => void;
  readonly onShowInventory: () => void;
  readonly onUse: () => void;
  readonly onLookAround: () => void;
  readonly onPickUp: () => void;
  readonly onPress: () => void;
  readonly onCoffee: () => void;
  readonly onFullscreen: () => void;
  readonly onToggleSound: () => void;
  readonly onJump: () => void;
  readonly onMove: (direction: string) => void;
  readonly onSit: () => void;
  readonly onDebugMenu: () => void;
  readonly onBackout: () => void;
  readonly onDisarmTrap: () => void;
  readonly hasActiveTraps: boolean;
}

const GameShell: React.FC<GameShellProps> = ({
  history,
  playerName,
  npcsInRoom,
  availableDirections,
  directionRoomTitles,
  currentRoomId,
  isFullscreen,
  soundOn,
  isDemoActive,
  ctrlClickOnInstructions,
  canBackout,
  onCommand,
  onTalkToNPC,
  onShowInventory,
  onUse,
  onLookAround,
  onPickUp,
  onPress,
  onCoffee,
  onFullscreen,
  onToggleSound,
  onJump,
  onMove,
  onSit,
  onDebugMenu,
  onBackout,
  onDisarmTrap,
  hasActiveTraps,
}) => {
  return (
    <>
      <div className="quad quad-1">
        <React.Suspense fallback={<div />}>
          <RoomRenderer />
        </React.Suspense>
        <div className="absolute top-2 left-2">
          <React.Suspense fallback={null}>
            <ProgressDashboard compact={true} className="w-48" />
          </React.Suspense>
        </div>
      </div>

      <div className="quad quad-2">
        <React.Suspense fallback={<div />}>
          <TerminalConsole messages={history as any} />
        </React.Suspense>
      </div>

      <div className="quad quad-3">
        <React.Suspense fallback={null}>
          <PlayerStatsPanel />
        </React.Suspense>
        <CommandInput onCommand={onCommand} playerName={playerName} />
        <React.Suspense fallback={null}>
          <PresentNPCsPanel npcs={npcsInRoom} onTalkToNPC={onTalkToNPC} />
        </React.Suspense>
      </div>

      <div className="quad quad-4">
        <React.Suspense fallback={null}>
          <QuickActionsPanel
            availableDirections={availableDirections}
            directionRoomTitles={directionRoomTitles}
            onShowInventory={onShowInventory}
            onUse={onUse}
            onLookAround={onLookAround}
            onPickUp={onPickUp}
            onPress={onPress}
            onCoffee={onCoffee}
            onFullscreen={onFullscreen}
            isFullscreen={isFullscreen}
            soundOn={soundOn}
            onToggleSound={onToggleSound}
            onJump={onJump}
            onMove={onMove}
            onSit={onSit}
            playerName={playerName}
            ctrlClickOnInstructions={ctrlClickOnInstructions}
            onDebugMenu={onDebugMenu}
            onBackout={onBackout}
            canBackout={canBackout}
            currentRoomId={currentRoomId}
            npcsInRoom={npcsInRoom}
            onTalkToNPC={onTalkToNPC}
            hasActiveTraps={hasActiveTraps}
            onDisarmTrap={onDisarmTrap}
            isDemoActive={isDemoActive}
          />
        </React.Suspense>
      </div>

      <OpeningBriefing onCommand={onCommand} />
    </>
  );
};

export default GameShell;
