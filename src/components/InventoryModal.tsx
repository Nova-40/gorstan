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

import React from 'react';
import { Package, Search } from 'lucide-react';
import { RetroModal } from './ui/RetroModal';
import { Button } from './ui/Button';

interface InventoryModalProps {
  items: string[];
  onClose: () => void;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({ items, onClose }) => {
  const [searchFilter, setSearchFilter] = React.useState('');

  // React effect hook
  React.useEffect(() => {
    // Variable declaration
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    // JSX return block or main return
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const filteredItems = items.filter(item => 
    item.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <RetroModal
      isOpen
      onClose={onClose}
      title={`Inventory (${items.length})`}
      subtitle={items.length ? 'Search, browse and manage your collected items' : 'Inventory is empty'}
      footer={(
        <>
          <span className="panel-subtle mr-auto text-xs">{filteredItems.length}/{items.length} shown</span>
          <Button size="sm" variant="secondary" onClick={onClose}>Close</Button>
        </>
      )}
      widthClass="max-w-2xl"
    >
      {items.length > 0 && (
        <div className="relative">
          <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 opacity-60" />
          <input
            type="text"
            placeholder="Search inventory..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full bg-black/40 border border-emerald-400/30 rounded-sm pl-7 pr-2 py-1 text-sm font-mono focus:outline-none focus:border-emerald-400/70 placeholder:text-console-dim"
            autoFocus
          />
        </div>
      )}
      {filteredItems.length > 0 ? (
        <div className="grid gap-2 grid-cols-2 md:grid-cols-3 max-h-72 overflow-y-auto pr-1">
          {filteredItems.map((item, i) => (
            <div
              key={i}
              className="border border-emerald-400/30 bg-black/30 rounded-sm p-2 flex flex-col gap-1 hover:border-emerald-400/60 transition-colors"
              title={`Details about ${item}`}
            >
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="opacity-80">📦</span>
                <span className="truncate flex-1">{item}</span>
              </div>
            </div>
          ))}
        </div>
      ) : searchFilter ? (
        <div className="text-center py-8 opacity-80">
          <Search className="mx-auto mb-2" size={32} />
          <p className="m-0 text-sm">No items match "{searchFilter}"</p>
        </div>
      ) : (
        <div className="text-center py-8 opacity-80">
          <Package className="mx-auto mb-2" size={32} />
          <p className="m-0 text-sm">Your inventory is empty.</p>
          <small className="block mt-1 text-xs">Items you pick up will appear here</small>
        </div>
      )}
      <p className="m-0 text-xs panel-subtle">💡 Use the search box to quickly find items</p>
    </RetroModal>
  );
};
