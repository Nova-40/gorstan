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
// Modal for selecting which NPC to talk to when multiple are present

import React from 'react';
import { MessageCircle, Users } from 'lucide-react';
import { RetroModal } from './ui/RetroModal';
import { Button } from './ui/Button';
import type { NPC } from '../types/NPCTypes';

interface NPCSelectionModalProps {
  isOpen: boolean;
  npcs: NPC[];
  onSelectNPC: (npc: NPC) => void;
  onClose: () => void;
  onTalkToAll?: () => void; // Future feature for group conversations
  onTalkToAyla?: () => void; // Option to switch to Ayla
}

const NPCSelectionModal: React.FC<NPCSelectionModalProps> = ({
  isOpen,
  npcs,
  onSelectNPC,
  onClose,
  onTalkToAll,
  onTalkToAyla
}) => {
  if (!isOpen) return null;

  // NPC image mapping
  const npcImages: Record<string, string> = {
    'dominic': '/images/Dominic.png',
    'chef': '/images/Chef.png',
    'albie': '/images/Albie.png',
    'polly': '/images/Polly.png',
    'mr wendell': '/images/MrWendell.png',
    'wendell': '/images/MrWendell.png',
    'ayla': '/images/Ayla.png',
    'al': '/images/Al.png',
    'al_escape_artist': '/images/Al.png', // Al's escape artist persona
    'librarian': '/images/Librarian.png',
    'morthos': '/images/Morthos.png'
  };

  const getImagePath = (npc: NPC): string => {
    if (npc.portrait) return npc.portrait;
    return npcImages[npc.id.toLowerCase()] || 
           npcImages[npc.name.toLowerCase()] || 
           '/images/fallback.png';
  };

  return (
    <RetroModal
      isOpen
      onClose={onClose}
      title="Choose Who to Talk To"
      subtitle={npcs.length > 1 ? `${npcs.length} participants available` : `${npcs.length} participant`}
      widthClass="max-w-4xl"
      footer={(
        <>
          <span className="panel-subtle mr-auto text-xs">Click a portrait to begin</span>
          {onTalkToAll && npcs.length > 1 && (
            <Button size="sm" variant="secondary" onClick={onTalkToAll}><Users size={14} className="mr-1"/> Talk to Everyone</Button>
          )}
          {onTalkToAyla && (
            <Button size="sm" variant="outline" onClick={onTalkToAyla}><MessageCircle size={14} className="mr-1"/> Ayla (Help)</Button>
          )}
          <Button size="sm" variant="ghost" onClick={onClose}>Close</Button>
        </>
      )}
    >
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {npcs.map(npc => (
          <button
            key={npc.id}
            onClick={() => onSelectNPC(npc)}
            className="group relative border border-emerald-400/30 rounded-sm overflow-hidden bg-black/30 hover:border-emerald-400/70 transition-colors text-left"
          >
            <div className="aspect-video w-full overflow-hidden bg-black/50 flex items-center justify-center">
              <img
                src={getImagePath(npc)}
                alt={npc.name}
                className="object-contain max-h-full max-w-full opacity-90 group-hover:opacity-100 transition-opacity"
                onError={(e) => { (e.target as HTMLImageElement).src = '/images/fallback.png'; }}
              />
              <div className="absolute top-1 left-1 px-1 py-0.5 text-[10px] rounded-sm bg-black/60 border border-emerald-400/40 font-mono uppercase tracking-wide">
                {npc.mood}
              </div>
            </div>
            <div className="p-2 space-y-1">
              <div className="flex items-center gap-2">
                <MessageCircle size={14} className="opacity-70" />
                <span className="font-mono text-xs truncate">{npc.name}</span>
              </div>
              {npc.description && (
                <p className="m-0 text-[10px] leading-snug opacity-70 line-clamp-2">{npc.description}</p>
              )}
            </div>
          </button>
        ))}
      </div>
    </RetroModal>
  );
};

export default NPCSelectionModal;
