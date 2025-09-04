/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  You may play Gorstan for free for personal entertainment only.
  You may NOT copy, redistribute, modify, or sell the game, its code, 
  artwork, storyline, or any other part without written permission.
  
  Gorstan includes third-party libraries and assets:
    - React © Meta Platforms, Inc. – MIT Licence
    - Lucide Icons © Lucide Contributors – ISC Licence
    - Flaticon icons © Flaticon.com – Free Licence with attribution
    - Other packages under their respective licences (see package.json)

  Full licence terms: see EULA.md in the project root.
*/

// Gorstan and characters (c) Geoff Webster 2025
// Save game modal component

import React, { useState } from 'react';
import { Save, Download, Trash2, Calendar, Clock } from 'lucide-react';
import { RetroModal } from './ui/RetroModal';
import { Button } from './ui/Button';

interface SaveSlot {
  id: string;
  name: string;
  playerName: string;
  currentRoom: string;
  timestamp: number;
  score: number;
  playTime: number;
}

interface SaveGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (slotId: string, slotName: string) => void;
  onLoad: (slotId: string) => void;
  onDelete: (slotId: string) => void;
  saveSlots: SaveSlot[];
}

const SaveGameModal: React.FC<SaveGameModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onLoad,
  onDelete,
  saveSlots
}) => {
  const [newSaveName, setNewSaveName] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  if (!isOpen) return null;

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const formatPlayTime = (playTime: number) => {
    const hours = Math.floor(playTime / 3600);
    const minutes = Math.floor((playTime % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const handleSave = () => {
    if (newSaveName.trim()) {
      const slotId = `save_${Date.now()}`;
      onSave(slotId, newSaveName.trim());
      setNewSaveName('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newSaveName.trim()) {
      handleSave();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <RetroModal
      isOpen={isOpen}
      onClose={onClose}
      title="Save & Load Game"
      subtitle="Manage your progression snapshots"
      footer={(
        <>
          <span className="panel-subtle mr-auto">Tip: Ctrl+S opens this menu</span>
          <Button size="sm" variant="secondary" onClick={onClose}>Close</Button>
        </>
      )}
    >
      <section className="space-y-3">
        <h3 className="panel-heading text-sm flex items-center gap-2"><Save size={14}/> Create New Save</h3>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={newSaveName}
            onChange={(e) => setNewSaveName(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Enter save name"
            maxLength={50}
            className="flex-1 bg-black/60 border border-emerald-400/30 rounded-sm px-2 py-1 text-console-bright focus:outline-none focus:ring-1 focus:ring-emerald-400/60"
          />
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!newSaveName.trim()}
            variant="primary"
          >
            <Save size={14} className="mr-1"/> Save
          </Button>
        </div>
      </section>

      <section className="mt-6 space-y-3">
        <h3 className="panel-heading text-sm">Saved Games</h3>
        {saveSlots.length === 0 ? (
          <div className="panel-subtle">No saved games found.</div>
        ) : (
          <div className="max-h-72 overflow-y-auto pr-1 space-y-2">
            {saveSlots.map(slot => {
              const selected = selectedSlot === slot.id;
              return (
                <div
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot.id)}
                  className={
                    `cursor-pointer border rounded-sm p-2 transition-colors text-console text-xs ${selected ? 'border-emerald-400/70 bg-black/60' : 'border-emerald-400/20 hover:border-emerald-400/40 bg-black/30'}`
                  }
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="space-y-1">
                      <div className="text-console-bright font-mono text-sm flex items-center gap-2">
                        <span>{slot.name}</span>
                        <span className="panel-subtle">Score {slot.score}</span>
                      </div>
                      <div className="panel-subtle flex flex-wrap gap-x-3 gap-y-1">
                        <span>{slot.playerName}</span>
                        <span>{slot.currentRoom}</span>
                        <span className="inline-flex items-center gap-1"><Calendar size={10}/> {formatTimestamp(slot.timestamp)}</span>
                        <span className="inline-flex items-center gap-1"><Clock size={10}/> {formatPlayTime(slot.playTime)}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={(e) => { e.stopPropagation(); onLoad(slot.id); }}
                      >
                        <Download size={12} className="mr-1"/> Load
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={(e) => { e.stopPropagation(); if (confirm(`Delete save \"${slot.name}\"?`)) onDelete(slot.id); }}
                      >
                        <Trash2 size={12} className="mr-1"/> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </RetroModal>
  );
};

export default SaveGameModal;
