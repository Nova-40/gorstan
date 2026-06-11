import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  Backpack,
  BookText,
  Crosshair,
  Map,
  Save,
  ScrollText,
  Sparkles,
  Trophy,
  UserRound,
  Users,
} from 'lucide-react';

import IconButton from './IconButton';
import type { GameMessage } from '../types/GameTypes';

type PanelKey =
  | 'character'
  | 'journal'
  | 'actions'
  | 'map'
  | 'history'
  | 'npcs'
  | 'achievements'
  | 'status';

type ToolbarButtonId = PanelKey | 'inventory' | 'hotspots' | 'save';

type GameShellV2Props = {
  roomId: string;
  roomTitle: string;
  scene: React.ReactNode;
  messages: GameMessage[];
  commandBar: React.ReactNode;
  characterPanel: React.ReactNode;
  journalPanel: React.ReactNode;
  actionsPanel: React.ReactNode;
  mapPanel: React.ReactNode;
  historyPanel: React.ReactNode;
  npcsPanel: React.ReactNode;
  achievementsPanel: React.ReactNode;
  statusPanel: React.ReactNode;
  onOpenInventory: () => void;
  onOpenSaveGame: () => void;
  onTriggerHotspots: () => void;
  npcCount: number;
  hoverPreviews: Record<ToolbarButtonId, React.ReactNode>;
};

const GameShellV2: React.FC<GameShellV2Props> = ({
  roomId,
  roomTitle,
  scene,
  messages,
  commandBar,
  characterPanel,
  journalPanel,
  actionsPanel,
  mapPanel,
  historyPanel,
  npcsPanel,
  achievementsPanel,
  statusPanel,
  onOpenInventory,
  onOpenSaveGame,
  onTriggerHotspots,
  npcCount,
  hoverPreviews,
}) => {
  const [activePanel, setActivePanel] = useState<PanelKey | null>(null);
  const [hoveredButton, setHoveredButton] = useState<ToolbarButtonId | null>(null);

  const latestMessages = useMemo(
    () => messages.filter((message) => message.text.trim().length > 0).slice(-3),
    [messages],
  );

  const panels: Record<PanelKey, { label: string; content: React.ReactNode }> = {
    character: { label: 'Character', content: characterPanel },
    journal: { label: 'Journal', content: journalPanel },
    actions: { label: 'Actions', content: actionsPanel },
    map: { label: 'Map', content: mapPanel },
    history: { label: 'History', content: historyPanel },
    npcs: { label: 'NPCs', content: npcsPanel },
    achievements: { label: 'Achievements', content: achievementsPanel },
    status: { label: 'Status', content: statusPanel },
  };

  useEffect(() => {
    if (!activePanel) {
      return undefined;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActivePanel(null);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [activePanel]);

  const toolbarButtons = [
    { id: 'character', label: 'Character', icon: UserRound, panel: 'character' as PanelKey },
    { id: 'inventory', label: 'Inventory', icon: Backpack, action: onOpenInventory },
    { id: 'journal', label: 'Journal', icon: BookText, panel: 'journal' as PanelKey },
    { id: 'actions', label: 'Actions', icon: Sparkles, panel: 'actions' as PanelKey },
    { id: 'hotspots', label: 'Hotspots', icon: Crosshair, action: onTriggerHotspots },
    { id: 'map', label: 'Map', icon: Map, panel: 'map' as PanelKey },
    { id: 'history', label: 'History', icon: ScrollText, panel: 'history' as PanelKey },
    {
      id: 'npcs',
      label: 'NPCs',
      icon: Users,
      panel: 'npcs' as PanelKey,
      attention: npcCount > 0,
      badgeContent: npcCount > 0 ? npcCount : null,
      ariaLabel: npcCount > 0 ? `NPCs: ${npcCount} nearby` : 'NPCs',
      title: npcCount > 0 ? `NPCs: ${npcCount} nearby` : 'NPCs',
    },
    {
      id: 'achievements',
      label: 'Achievements',
      icon: Trophy,
      panel: 'achievements' as PanelKey,
    },
    { id: 'status', label: 'Status', icon: Activity, panel: 'status' as PanelKey },
    { id: 'save', label: 'Save / Game', icon: Save, action: onOpenSaveGame },
  ];

  const togglePanel = (panel: PanelKey) => {
    setActivePanel((currentPanel) => (currentPanel === panel ? null : panel));
  };

  const hoveredButtonConfig = hoveredButton
    ? toolbarButtons.find((button) => button.id === hoveredButton) ?? null
    : null;
  const hoveredPreviewContent = hoveredButton ? hoverPreviews[hoveredButton] : null;

  return (
    <div className="flex h-[100dvh] min-h-0 flex-col overflow-hidden bg-black text-green-100">
      <header className="relative z-30 shrink-0 border-b border-green-900/60 bg-black/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-[0.35em] text-green-500">
              Gorstan Beta 5
            </div>
            <h1 className="truncate text-lg font-semibold text-green-100">{roomTitle}</h1>
            <div className="text-xs text-green-500">{roomId}</div>
          </div>
          <div
            className="relative"
            onMouseLeave={() => setHoveredButton(null)}
          >
            <div className="flex max-w-full flex-wrap items-center justify-end gap-1 rounded-2xl border border-green-900/60 bg-black/80 p-1.5">
            {toolbarButtons.map((button) => {
              const Icon = button.icon;
              const isActive = 'panel' in button && button.panel === activePanel;

              return (
                <div
                  key={button.id}
                  className="inline-flex"
                  onMouseEnter={() => setHoveredButton(button.id as ToolbarButtonId)}
                >
                  <IconButton
                    icon={<Icon size={16} />}
                    label={button.label}
                    title={button.title || button.label}
                    ariaLabel={button.ariaLabel || button.label}
                    active={Boolean(isActive)}
                    attention={button.attention}
                    badgeContent={button.badgeContent}
                    onClick={() => {
                      setHoveredButton(null);

                      if ('panel' in button) {
                        togglePanel(button.panel as PanelKey);
                        return;
                      }

                      setActivePanel(null);
                      button.action();
                    }}
                    className="h-10 w-10"
                  />
                </div>
              );
            })}
            </div>

            {hoveredButtonConfig && hoveredPreviewContent && (
              <div className="absolute right-0 top-[calc(100%+0.5rem)] z-40 w-[min(20rem,calc(100vw-2rem))] rounded-2xl border border-green-400/20 bg-[rgba(5,10,18,0.82)] px-3 py-3 shadow-2xl backdrop-blur-md">
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-green-400">
                  {hoveredButtonConfig.label}
                </div>
                <div className="space-y-2 text-sm text-green-100">{hoveredPreviewContent}</div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="relative z-0 mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 flex-col px-3 py-3">
        <section className="relative flex min-h-0 flex-1 overflow-hidden rounded-2xl border border-green-900/60 bg-black/80 shadow-[0_0_0_1px_rgba(34,197,94,0.08)]">
          <div className="h-full min-h-0 w-full">{scene}</div>

          {activePanel && (
            <aside className="absolute inset-x-3 top-3 bottom-24 z-20 overflow-y-auto rounded-2xl border border-green-900/80 bg-black/95 p-3 shadow-2xl backdrop-blur md:inset-x-auto md:right-3 md:w-[24rem]">
              <div className="mb-3 flex items-center justify-between border-b border-green-900/60 pb-2">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-green-200">
                  {panels[activePanel].label}
                </h2>
                <button
                  type="button"
                  onClick={() => setActivePanel(null)}
                  aria-label={`Close ${panels[activePanel].label} panel`}
                  title={`Close ${panels[activePanel].label} panel`}
                  className="rounded-lg px-2 py-1 text-xs text-green-400 transition hover:bg-green-950 hover:text-green-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  Close
                </button>
              </div>
              {panels[activePanel].content}
            </aside>
          )}

          {latestMessages.length > 0 && (
            <div className="pointer-events-none absolute inset-x-3 bottom-3 z-10">
              <div className="pointer-events-auto rounded-2xl border border-green-900/70 bg-black/90 px-4 py-3 shadow-xl backdrop-blur">
                <div className="mb-2 text-[10px] uppercase tracking-[0.3em] text-green-500">
                  Latest Output
                </div>
                <div className="space-y-1.5 font-mono text-sm text-green-100">
                  {latestMessages.map((message) => (
                    <div key={message.id} className="truncate text-ellipsis">
                      {message.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="shrink-0 border-t border-green-900/70 bg-black/95 backdrop-blur">
        <div className="mx-auto max-w-[1600px] px-3 py-3">
          <div className="rounded-2xl border border-green-900/60 bg-black/80 px-3 py-3 shadow-[0_0_0_1px_rgba(34,197,94,0.08)]">
            {commandBar}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GameShellV2;