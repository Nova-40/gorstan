import React from 'react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';

vi.mock('../hooks/useFlags', () => ({
  useFlags: () => ({ hasFlag: () => false }),
}));

vi.mock('../hooks/useModuleLoader', () => ({
  useModuleLoader: () => ({ loadModule: vi.fn() }),
}));

vi.mock('../hooks/useLibrarianLogic', () => ({
  useLibrarianLogic: () => {},
}));

vi.mock('../hooks/useOptimizedEffects', () => ({
  useOptimizedEffects: () => {},
}));

vi.mock('../hooks/useRoomTransition', () => ({
  useRoomTransition: () => ({
    shouldAnimate: false,
    transitionType: 'none',
    fromZone: undefined,
    toZone: undefined,
  }),
}));

vi.mock('../hooks/useWendellLogic', () => ({
  useWendellLogic: () => {},
}));

vi.mock('../logic/achievementEngine', () => ({
  initializeAchievementEngine: vi.fn(),
  deriveAchievementView: (achievementIds: string[] = []) =>
    achievementIds.map((id) => ({
      id,
      label: id,
      description: `${id} description`,
      unlocked: true,
      hidden: false,
    })),
  getAllAchievements: vi.fn(() => []),
}));

vi.mock('../state/scoreManager', () => ({
  initializeScoreManager: vi.fn(),
}));

vi.mock('../logic/codexTracker', () => ({
  initializeCodexTracker: vi.fn(),
}));

vi.mock('../engine/miniquestInitializer', () => ({
  initializeMiniquests: vi.fn(),
}));

vi.mock('../celebrate/index', () => ({
  loadCelebrationIndex: vi.fn(),
}));

vi.mock('../engine/wanderingNPCController', () => ({
  initializeWanderingNPCs: vi.fn(),
  handleRoomEntryForWanderingNPCs: vi.fn(),
}));

vi.mock('../engine/roomEventHandler', () => ({
  handleRoomEntry: vi.fn(),
}));

vi.mock('../npc/triggers', () => ({
  onRoomEntry: vi.fn(),
  periodicConversationCheck: vi.fn(),
}));

vi.mock('../services/SaveManager', () => ({
  SaveManager: {
    listSlots: vi.fn(async () => []),
    save: vi.fn(async () => ({ success: true, message: 'ok' })),
    load: vi.fn(async () => null),
    delete: vi.fn(async () => ({ success: true })),
  },
}));

vi.mock('../services/aylaHintSystem', () => ({
  AylaHintSystem: vi.fn().mockImplementation(() => ({
    shouldAylaInterrupt: vi.fn(async () => null),
  })),
}));

vi.mock('../services/unifiedAI', () => ({
  unifiedAI: {
    getUnifiedGuidance: vi.fn(async () => null),
  },
}));

vi.mock('../services/aiUsageMonitor', () => ({
  aiUsageMonitor: {
    trackCommand: vi.fn(),
  },
}));

vi.mock('../services/npcAI', () => ({
  npcAI: {},
}));

vi.mock('../engine/npcEngine', () => ({
  npcReact: vi.fn(),
}));

vi.mock('../demo/demoController', () => ({
  demoController: {
    startDemo: vi.fn(),
    skipDemo: vi.fn(),
    skipToNext: vi.fn(),
  },
}));

vi.mock('../demo/demoGate', () => ({
  isDemoEnvironment: () => false,
}));

vi.mock('../utils/performanceMonitor', () => ({
  performanceMonitor: {
    markRenderStart: vi.fn(),
    markRenderEnd: vi.fn(),
  },
}));

vi.mock('../components/MultiverseRebootSequence', () => ({
  default: () => null,
}));

vi.mock('../components/animations/RoomTransition', () => ({
  default: () => null,
}));

vi.mock('../ui/QuickActionsPanel', () => ({
  default: () => null,
}));

vi.mock('../components/BlueButtonWarningModal', () => ({
  default: () => null,
}));

vi.mock('../components/QuickWinNotifications', () => ({
  default: () => null,
}));

vi.mock('../components/ProgressDashboard', () => ({
  default: () => null,
}));

vi.mock('../components/OpeningBriefing', () => ({
  default: () => null,
}));

vi.mock('../components/WalkthroughPanel', () => ({
  default: () => null,
}));

vi.mock('../components/AylaHintPopup', () => ({
  default: () => null,
}));

import AppCore from '../components/AppCore';
import RoomRenderer from '../components/RoomRenderer';
import { GameStateContext, initialGameState } from '../state/gameState';

const baseRoom = {
  id: 'controlnexus',
  title: 'Control Nexus',
  description: 'A humming chamber full of screens.',
  image: '/images/controlnexus.png',
  zone: 'coreZone',
  exits: {
    north: 'northroom',
  },
  items: [],
  npcs: [],
  consoleIntro: [],
  actions: [
    {
      id: 'scan-console',
      label: 'Scan console',
      command: 'scan console',
    },
  ],
  hotspots: [
    {
      id: 'control-panel',
      label: 'Control Panel',
      description: 'A flickering control interface.',
      x: 10,
      y: 10,
      width: 20,
      height: 20,
      command: 'inspect control panel',
    },
  ],
};

const northRoom = {
  id: 'northroom',
  title: 'North Room',
  description: 'A quiet annex.',
  image: '/images/northroom.png',
  zone: 'coreZone',
  exits: {},
  items: [],
  npcs: [],
  consoleIntro: [],
  actions: [],
  hotspots: [],
};

function createState(overrides: Record<string, unknown> = {}) {
  return {
    ...initialGameState,
    ...overrides,
    stage: 'game',
    currentRoomId: 'controlnexus',
    roomMap: {
      controlnexus: baseRoom,
      northroom: northRoom,
      ...(overrides.roomMap as Record<string, unknown> | undefined),
    },
    player: {
      ...initialGameState.player,
      name: 'Tester',
      inventory: ['compass'],
      visitedRooms: ['controlnexus'],
      ...(overrides.player as Record<string, unknown> | undefined),
    },
    metadata: {
      ...initialGameState.metadata,
      achievements: ['first-step'],
      codexEntries: { welcome: { title: 'Welcome' } },
      ...(overrides.metadata as Record<string, unknown> | undefined),
    },
    flags: {
      ...initialGameState.flags,
      ...(overrides.flags as Record<string, unknown> | undefined),
    },
    quests: [{ id: 'quest-1', title: 'Check Console' }],
  } as typeof initialGameState;
}

function renderAppCore(stateOverrides: Record<string, unknown> = {}) {
  const dispatch = vi.fn();
  const state = createState(stateOverrides);

  render(
    <GameStateContext.Provider value={{ state, dispatch }}>
      <AppCore />
    </GameStateContext.Provider>,
  );

  return { dispatch, state };
}

afterEach(() => {
  vi.clearAllMocks();
});

describe('UI v2 shell', () => {
  test('renders the toolbar with accessible labels and without save/load toolbar buttons', async () => {
    renderAppCore();

    const toolbar = await screen.findByRole('toolbar', { name: /primary panels/i });
    const expectedButtons = [
      'Character',
      'Inventory',
      'Journal',
      'History',
      'Actions & Navigation',
      'Hotspots Off',
      'World Map',
      'Achievements',
      'Game Control',
    ];

    expectedButtons.forEach((label) => {
      const button = within(toolbar).getByRole('button', { name: label });
      expect(button).toHaveAttribute('title', label);
    });

    expect(within(toolbar).queryByRole('button', { name: /^save$/i })).not.toBeInTheDocument();
    expect(within(toolbar).queryByRole('button', { name: /^load$/i })).not.toBeInTheDocument();
  });

  test('opens and closes every toolbar panel without dispatching parser commands and restores parser focus', async () => {
    const { dispatch } = renderAppCore();
    const parserInput = await screen.findByRole('textbox', { name: /parser command input/i });

    await waitFor(() => expect(parserInput).toHaveFocus());

    const panels = [
      { button: 'Character', heading: /^Character$/i },
      { button: 'Inventory', heading: /^Inventory \(/i },
      { button: 'Journal', heading: /^Journal$/i },
      { button: 'History', heading: /^History$/i },
      { button: 'Actions & Navigation', heading: /^Actions & Navigation$/i },
      { button: 'Hotspots Off', heading: /^Hotspot Visibility$/i },
      { button: 'World Map', heading: /^World Map$/i },
      { button: 'Achievements', heading: /^Achievements$/i },
      { button: 'Game Control', heading: /^Game Control$/i },
    ];

    for (const panel of panels) {
      dispatch.mockClear();
      fireEvent.click(screen.getByRole('button', { name: panel.button }));

      expect(await screen.findByRole('heading', { name: panel.heading })).toBeInTheDocument();
      expect(dispatch).not.toHaveBeenCalledWith(
        expect.objectContaining({ type: 'COMMAND_INPUT' }),
      );

      fireEvent.keyDown(window, { key: 'Escape' });

      await waitFor(() => {
        expect(screen.queryByRole('heading', { name: panel.heading })).not.toBeInTheDocument();
      });

      await waitFor(() => expect(parserInput).toHaveFocus());
    }
  });

  test('parser input submits commands through the existing parser handler', async () => {
    const { dispatch } = renderAppCore();
    const parserInput = await screen.findByRole('textbox', { name: /parser command input/i });

    dispatch.mockClear();
    fireEvent.change(parserInput, { target: { value: 'inspect control panel' } });
    fireEvent.submit(parserInput.closest('form')!);

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'COMMAND_INPUT',
        payload: 'inspect control panel',
      }),
    );
  });

  test('actions and navigation buttons dispatch parser commands where applicable', async () => {
    const { dispatch } = renderAppCore();

    fireEvent.click(screen.getByRole('button', { name: 'Actions & Navigation' }));
    await screen.findByRole('heading', { name: /^Actions & Navigation$/i });

    dispatch.mockClear();
    fireEvent.click(screen.getByRole('button', { name: /^north$/i }));

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'COMMAND_INPUT', payload: 'go north' }),
    );

    fireEvent.click(screen.getByRole('button', { name: 'Actions & Navigation' }));
    await screen.findByRole('heading', { name: /^Actions & Navigation$/i });

    dispatch.mockClear();
    fireEvent.click(screen.getByRole('button', { name: 'Scan console' }));

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'COMMAND_INPUT', payload: 'scan console' }),
    );
  });

  test('game control opens without save/load as separate toolbar buttons', async () => {
    renderAppCore();
    const toolbar = await screen.findByRole('toolbar', { name: /primary panels/i });

    expect(within(toolbar).queryByRole('button', { name: /^save$/i })).not.toBeInTheDocument();
    expect(within(toolbar).queryByRole('button', { name: /^load$/i })).not.toBeInTheDocument();

    fireEvent.click(within(toolbar).getByRole('button', { name: 'Game Control' }));

    expect(await screen.findByRole('heading', { name: /^Game Control$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save or load/i })).toBeInTheDocument();
  });
});

describe('RoomRenderer parser wiring', () => {
  test('hotspot clicks still dispatch parser-backed commands', () => {
    const onIssueCommand = vi.fn();
    const dispatch = vi.fn();
    const state = createState();

    const { container } = render(
      <GameStateContext.Provider value={{ state, dispatch }}>
        <RoomRenderer onIssueCommand={onIssueCommand} showHotspots={true} />
      </GameStateContext.Provider>,
    );

    expect(screen.getByAltText('Control Nexus')).toBeInTheDocument();

    const hotspot = container.querySelector('rect');
    expect(hotspot).not.toBeNull();

    fireEvent.click(hotspot!);

    expect(onIssueCommand).toHaveBeenCalledWith('inspect control panel');
  });
});