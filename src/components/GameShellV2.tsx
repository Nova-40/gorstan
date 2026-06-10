import React from 'react';

import type { NPC } from '../types/NPCTypes';
import type { GameMessage } from '../types/GameTypes';

interface ToolbarAction {
  id: string;
  label: string;
  onClick: () => void;
  isActive?: boolean;
}

interface GameShellV2Props {
  playerName: string;
  roomTitle: string;
  roomId: string;
  roomZone?: string;
  toolbarActions: ToolbarAction[];
  scene: React.ReactNode;
  parserBar: React.ReactNode;
  npcsInRoom: NPC[];
  onTalkToNPC: (npc: NPC) => void;
  inventoryItems: string[];
  history: GameMessage[];
  hotspotsVisible: boolean;
  characterSummary: {
    health: number;
    maxHealth: number;
    score: number;
    visitedRooms: number;
    achievementCount: number;
  };
  journalSummary: {
    questCount: number;
    codexCount: number;
    note: string;
  };
  actionSummary: {
    movement: string[];
    actions: string[];
  };
}

const GameShellV2: React.FC<GameShellV2Props> = ({
  playerName,
  roomTitle,
  roomId,
  roomZone,
  toolbarActions,
  scene,
  parserBar,
  npcsInRoom,
  onTalkToNPC,
  inventoryItems,
  history,
  hotspotsVisible,
  characterSummary,
  journalSummary,
  actionSummary,
}) => {
  const historyPreview = history.slice(-5).reverse();
  const inventoryPreview = inventoryItems.slice(0, 5);

  return (
    <div className="gorstan-v2-shell">
      <header className="gorstan-v2-shell__header">
        <div className="gorstan-v2-shell__identity">
          <div className="gorstan-v2-shell__eyebrow">Gorstan UI v2</div>
          <h1 className="gorstan-v2-shell__title">{roomTitle}</h1>
          <div className="gorstan-v2-shell__meta">
            <span>{playerName}</span>
            <span>{roomZone || 'Unknown Zone'}</span>
            <span>{roomId}</span>
          </div>
        </div>

        <div className="gorstan-v2-shell__toolbar" role="toolbar" aria-label="Primary panels">
          {toolbarActions.map((action) => (
            <button
              key={action.id}
              type="button"
              className={`gorstan-v2-shell__tool ${action.isActive ? 'is-active' : ''}`}
              onClick={action.onClick}
              aria-label={action.label}
              title={action.label}
            >
              {action.label}
            </button>
          ))}
        </div>
      </header>

      <main className="gorstan-v2-shell__main">
        <section className="gorstan-v2-shell__scene-area">
          <div className="gorstan-v2-shell__scene-frame">{scene}</div>
        </section>

        <aside className="gorstan-v2-shell__sidebar">
          <section className="gorstan-v2-card">
            <div className="gorstan-v2-card__title">Character</div>
            <dl className="gorstan-v2-stat-grid">
              <div>
                <dt>Health</dt>
                <dd>
                  {characterSummary.health}/{characterSummary.maxHealth}
                </dd>
              </div>
              <div>
                <dt>Score</dt>
                <dd>{characterSummary.score}</dd>
              </div>
              <div>
                <dt>Visited</dt>
                <dd>{characterSummary.visitedRooms}</dd>
              </div>
              <div>
                <dt>Achievements</dt>
                <dd>{characterSummary.achievementCount}</dd>
              </div>
            </dl>
          </section>

          <section className="gorstan-v2-card">
            <div className="gorstan-v2-card__title">Inventory</div>
            {inventoryPreview.length > 0 ? (
              <ul className="gorstan-v2-list">
                {inventoryPreview.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="gorstan-v2-muted">No items carried yet.</p>
            )}
            {inventoryItems.length > inventoryPreview.length && (
              <div className="gorstan-v2-footnote">+{inventoryItems.length - inventoryPreview.length} more</div>
            )}
          </section>

          <section className="gorstan-v2-card">
            <div className="gorstan-v2-card__title">Journal</div>
            <dl className="gorstan-v2-stat-grid">
              <div>
                <dt>Quests</dt>
                <dd>{journalSummary.questCount}</dd>
              </div>
              <div>
                <dt>Codex</dt>
                <dd>{journalSummary.codexCount}</dd>
              </div>
            </dl>
            <p className="gorstan-v2-muted">{journalSummary.note}</p>
          </section>

          <section className="gorstan-v2-card">
            <div className="gorstan-v2-card__title">Actions & Navigation</div>
            <div className="gorstan-v2-pill-row">
              {(actionSummary.movement.length > 0 ? actionSummary.movement : ['No exits']).map((entry) => (
                <span key={`move-${entry}`} className="gorstan-v2-pill">
                  {entry}
                </span>
              ))}
            </div>
            <div className="gorstan-v2-pill-row">
              {(actionSummary.actions.length > 0 ? actionSummary.actions : ['No authored room actions']).map((entry) => (
                <span key={`action-${entry}`} className="gorstan-v2-pill is-secondary">
                  {entry}
                </span>
              ))}
            </div>
          </section>

          <section className="gorstan-v2-card">
            <div className="gorstan-v2-card__title">Hotspot Visibility</div>
            <p className="gorstan-v2-muted">
              {hotspotsVisible
                ? 'Interactive hotspots are currently visible.'
                : 'Interactive hotspots are currently hidden.'}
            </p>
          </section>

          <section className="gorstan-v2-card">
            <div className="gorstan-v2-card__title">History</div>
            {historyPreview.length > 0 ? (
              <ul className="gorstan-v2-history">
                {historyPreview.map((entry) => (
                  <li key={entry.id}>{entry.text}</li>
                ))}
              </ul>
            ) : (
              <p className="gorstan-v2-muted">No parser output yet.</p>
            )}
          </section>

          <section className="gorstan-v2-card">
            <div className="gorstan-v2-card__title">Present NPCs</div>
            {npcsInRoom.length > 0 ? (
              <div className="gorstan-v2-npc-list">
                {npcsInRoom.map((npc) => (
                  <button
                    key={npc.id}
                    type="button"
                    className="gorstan-v2-npc-chip"
                    onClick={() => onTalkToNPC(npc)}
                    title={`Talk to ${npc.name}`}
                  >
                    {npc.name}
                  </button>
                ))}
              </div>
            ) : (
              <p className="gorstan-v2-muted">No one is nearby.</p>
            )}
          </section>
        </aside>
      </main>

      <footer className="gorstan-v2-shell__parser-bar">
        <div className="gorstan-v2-shell__parser-label">Parser Bar</div>
        {parserBar}
      </footer>
    </div>
  );
};

export default GameShellV2;