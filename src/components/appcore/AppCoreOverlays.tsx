/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.

  Overlay composition for AppCore. This keeps the main game shell focused on
  the four-quadrant room/terminal/action layout.
*/

import React from 'react';

import AylaHintPopup from '../AylaHintPopup';
import type { AylaHintResponse } from '../../services/aylaHintSystem';
import type { AIGuidanceResponse } from '../../services/unifiedAI';
import type { GameplayUpdate } from '../../services/aiUsageMonitor';
import {
  AIMonitorDisplay,
  BlueButtonWarningModal,
  CombatActionsPanel,
  DebugPanel,
  ModalOverlay,
  MultiverseRebootSequence,
  PauseMenu,
  PerformanceDashboard,
  QuickWinNotifications,
  RoomTransition,
  UnifiedAIPopup,
} from './AppCoreLazyComponents';

export type RoomTransitionKind = 'zone_change' | 'portal' | 'normal' | 'chair_portal';

interface AppCoreOverlaysProps {
  readonly demoBanner?: string;
  readonly isDemoActive: boolean;
  readonly roomTransitionActive: boolean;
  readonly transitionInfo: {
    shouldAnimate: boolean;
    transitionType: RoomTransitionKind;
    fromZone?: string | null;
    toZone?: string | null;
  };
  readonly onRoomTransitionComplete: () => void;
  readonly showDebugPanel: boolean;
  readonly modalOpen: boolean;
  readonly onCloseModal: () => void;
  readonly modalContent: React.ReactNode;
  readonly showPause: boolean;
  readonly onResume: () => void;
  readonly onSave: () => void;
  readonly onLoad: () => void;
  readonly onOptions: () => void;
  readonly onQuitToMain: () => void;
  readonly showBlueButtonWarning: boolean;
  readonly onDismissBlueButtonWarning: () => void;
  readonly currentHint: AylaHintResponse | null;
  readonly onDismissHint: () => void;
  readonly onTalkToAylaFromHint: () => void;
  readonly currentGuidance: AIGuidanceResponse | null;
  readonly onDismissGuidance: () => void;
  readonly onTalkToAylaFromGuidance: () => void;
  readonly onOpenMiniquestsFromGuidance: () => void;
  readonly showPerformanceDashboard: boolean;
  readonly onClosePerformanceDashboard: () => void;
  readonly showAIMonitor: boolean;
  readonly gameplayUpdates: GameplayUpdate[];
  readonly npcBehaviors: Record<string, string>;
  readonly onCloseAIMonitor: () => void;
}

const AppCoreOverlays: React.FC<AppCoreOverlaysProps> = ({
  demoBanner,
  isDemoActive,
  roomTransitionActive,
  transitionInfo,
  onRoomTransitionComplete,
  showDebugPanel,
  modalOpen,
  onCloseModal,
  modalContent,
  showPause,
  onResume,
  onSave,
  onLoad,
  onOptions,
  onQuitToMain,
  showBlueButtonWarning,
  onDismissBlueButtonWarning,
  currentHint,
  onDismissHint,
  onTalkToAylaFromHint,
  currentGuidance,
  onDismissGuidance,
  onTalkToAylaFromGuidance,
  onOpenMiniquestsFromGuidance,
  showPerformanceDashboard,
  onClosePerformanceDashboard,
  showAIMonitor,
  gameplayUpdates,
  npcBehaviors,
  onCloseAIMonitor,
}) => {
  return (
    <>
      {demoBanner ? (
        <div className="fixed top-0 left-0 right-0 z-50 bg-purple-900 text-white text-center py-2 px-4 font-bold">
          {demoBanner}
        </div>
      ) : isDemoActive ? (
        <div className="fixed top-0 left-0 right-0 z-50 bg-purple-900 text-white text-center py-2 px-4 font-bold">
          🎬 DEMO MODE ACTIVE - Press ESC to skip • Use "stop demo" to exit
        </div>
      ) : null}

      <MultiverseRebootSequence />

      <React.Suspense fallback={null}>
        <RoomTransition
          isActive={roomTransitionActive && transitionInfo.shouldAnimate}
          transitionType={transitionInfo.transitionType}
          fromZone={transitionInfo.fromZone ?? ''}
          toZone={transitionInfo.toZone ?? ''}
          onComplete={onRoomTransitionComplete}
        />
      </React.Suspense>

      {showDebugPanel && (
        <React.Suspense fallback={null}>
          <DebugPanel />
        </React.Suspense>
      )}

      <React.Suspense fallback={null}>
        <CombatActionsPanel />
      </React.Suspense>

      <React.Suspense fallback={null}>
        <ModalOverlay isOpen={modalOpen} onClose={onCloseModal}>
          {modalContent}
        </ModalOverlay>
      </React.Suspense>

      <React.Suspense fallback={null}>
        <PauseMenu
          isOpen={showPause}
          onResume={onResume}
          onSave={onSave}
          onLoad={onLoad}
          onOptions={onOptions}
          onQuitToMain={onQuitToMain}
        />
      </React.Suspense>

      <React.Suspense fallback={null}>
        <BlueButtonWarningModal
          isOpen={showBlueButtonWarning}
          onClose={onDismissBlueButtonWarning}
        />
      </React.Suspense>

      {currentHint && (
        <AylaHintPopup
          hint={currentHint}
          onDismiss={onDismissHint}
          onTalkToAyla={onTalkToAylaFromHint}
        />
      )}

      {currentGuidance && (
        <UnifiedAIPopup
          guidance={currentGuidance}
          onDismiss={onDismissGuidance}
          onTalkToAyla={onTalkToAylaFromGuidance}
          onOpenMiniquests={onOpenMiniquestsFromGuidance}
        />
      )}

      <PerformanceDashboard
        isOpen={showPerformanceDashboard}
        onClose={onClosePerformanceDashboard}
      />

      {showAIMonitor && (
        <AIMonitorDisplay
          updates={gameplayUpdates}
          npcBehaviors={npcBehaviors}
          onClose={onCloseAIMonitor}
        />
      )}

      <React.Suspense fallback={null}>
        <QuickWinNotifications />
      </React.Suspense>
    </>
  );
};

export default AppCoreOverlays;
