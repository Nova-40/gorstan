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
// Game module.

import React, { useState } from 'react';
import { CheckSquare, Square } from 'lucide-react';
import { RetroModal } from './ui/RetroModal';
import { Button } from './ui/Button';

interface PickUpItemModalProps {
  isOpen: boolean;
  items: string[];
  onClose: () => void;
  onPickUp: (selectedItems: string[]) => void;
}

const PickUpItemModal: React.FC<PickUpItemModalProps> = ({ isOpen, items, onClose, onPickUp }) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Variable declaration
  const toggleItemSelection = (item: string) => {
    setSelectedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const selectAll = () => {
    setSelectedItems(items);
  };

  const selectNone = () => {
    setSelectedItems([]);
  };

  // Variable declaration
  const handlePickUp = () => {
    onPickUp(selectedItems);
    setSelectedItems([]);
    onClose();
  };

  if (!isOpen) return null;

  // JSX return block or main return
  return (
    <RetroModal
      isOpen
      onClose={onClose}
      title="Pick Up Items"
      subtitle="Select items to add to your inventory"
      footer={(
        <>
          <span className="panel-subtle mr-auto">{selectedItems.length ? `${selectedItems.length} selected` : 'No selection'}</span>
          <Button size="sm" variant="secondary" onClick={onClose}>Close</Button>
          <Button
            size="sm"
            disabled={selectedItems.length === 0}
            onClick={handlePickUp}
          >
            Pick Up {selectedItems.length > 0 && `(${selectedItems.length})`}
          </Button>
        </>
      )}
    >
      {items.length > 1 && (
        <div className="flex gap-2 mb-2">
          <Button
            size="sm"
            variant="outline"
            onClick={selectAll}
            disabled={selectedItems.length === items.length}
          >Select All</Button>
          <Button
            size="sm"
            variant="outline"
            onClick={selectNone}
            disabled={selectedItems.length === 0}
          >Clear All</Button>
        </div>
      )}
      <div className="grid gap-2 max-h-72 overflow-y-auto pr-1">
        {items.map(item => {
          const isSelected = selectedItems.includes(item);
          return (
            <button
              key={item}
              onClick={() => toggleItemSelection(item)}
              className={`w-full text-left border rounded-sm px-2 py-1 flex items-center gap-3 text-sm font-mono transition-colors ${isSelected ? 'bg-black/60 border-emerald-400/70 text-console-bright' : 'bg-black/30 border-emerald-400/20 hover:border-emerald-400/40 text-console'} `}
            >
              <span className="inline-block">{isSelected ? <CheckSquare size={14}/> : <Square size={14}/>}</span>
              <span className="flex-1">{item}</span>
              <span className="opacity-70">📦</span>
            </button>
          );
        })}
      </div>
    </RetroModal>
  );
};

export default PickUpItemModal;
