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
import { Settings, ArrowLeft, Wrench } from 'lucide-react';
import { RetroModal } from './ui/RetroModal';
import { Button } from './ui/Button';

interface UseItemModalProps {
  inventory: string[];
  environmentItems: string[];
  onClose: () => void;
  onUse: (item: string, target?: string) => void;
}

export const UseItemModal: React.FC<UseItemModalProps> = ({ inventory, environmentItems, onClose, onUse }) => {
  const [selectedItem, setSelectedItem] = React.useState<string | null>(null);
  const [mode, setMode] = React.useState<'choose' | 'standalone' | 'withItem' | 'withEnv'>('choose');

  // Variable declaration
  const otherItems = inventory.filter(i => i !== selectedItem);

  // React effect hook
  React.useEffect(() => {
    // Variable declaration
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    // JSX return block or main return
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const resetToChoose = () => {
    setSelectedItem(null);
    setMode('choose');
  };

  // JSX return block or main return
  return (
    <RetroModal
      isOpen
      onClose={onClose}
      title="Use an Item"
  subtitle={selectedItem ? null : 'Select an item from your inventory to begin'}
      footer={selectedItem && (
        <div className="flex w-full justify-between items-center">
          <span className="panel-subtle">{mode === 'choose' ? 'Choose a usage option' : 'Select a target'}</span>
          <div className="flex gap-2">
            {selectedItem && mode !== 'choose' && (
              <Button size="sm" variant="secondary" onClick={resetToChoose}><ArrowLeft size={12} className="mr-1"/>Back</Button>
            )}
            <Button size="sm" variant="outline" onClick={onClose}>Close</Button>
          </div>
        </div>
      )}
    >
      {!selectedItem ? (
            <div className="item-selection">
              <p className="instruction-text">Select an item from your inventory to use:</p>
              {inventory.length > 0 ? (
                <div className="item-grid">
                  {inventory.map(item => (
                    <button 
                      key={item} 
                      className="item-button"
                      onClick={() => setSelectedItem(item)}
                    >
                      <div className="item-icon">📦</div>
                      <span className="item-name">{item}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <Settings className="empty-icon" />
                  <p>Your inventory is empty.</p>
                  <small>You need to pick up items before you can use them</small>
                </div>
              )}
            </div>
          ) : mode === 'choose' ? (
            <div className="usage-selection">
              <div className="selected-item">
                <div className="item-display">
                  <div className="item-icon">📦</div>
                  <span className="item-name">{selectedItem}</span>
                </div>
                <Button size="sm" variant="secondary" onClick={resetToChoose}><ArrowLeft size={14} className="mr-1"/>Choose Different</Button>
              </div>
              
              <p className="instruction-text">How would you like to use <strong>{selectedItem}</strong>?</p>
              
              <div className="usage-options">
                <Button onClick={() => onUse(selectedItem)} className="usage-button standalone !justify-start gap-3">
                  <span className="option-icon">⚡</span>
                  <span className="text-left">
                    <span className="block option-title">Use by itself</span>
                    <small className="block text-console-dim">Activate or use directly</small>
                  </span>
                </Button>
                
                <Button onClick={() => setMode('withItem')} disabled={otherItems.length === 0} className="usage-button with-item !justify-start gap-3">
                  <Settings className="option-icon" />
                  <span className="text-left">
                    <span className="block option-title">Use with another item</span>
                    <small className="block text-console-dim">{otherItems.length > 0 ? `Combine with ${otherItems.length}` : 'None available'}</small>
                  </span>
                </Button>
                
                <Button onClick={() => setMode('withEnv')} disabled={environmentItems.length === 0} className="usage-button with-env !justify-start gap-3">
                  <Wrench className="option-icon" />
                  <span className="text-left">
                    <span className="block option-title">Use with environment</span>
                    <small className="block text-console-dim">{environmentItems.length > 0 ? `Use with ${environmentItems.length} objects` : 'No environment targets'}</small>
                  </span>
                </Button>
              </div>
            </div>
          ) : mode === 'withItem' ? (
      <div className="target-selection">
              <div className="selected-item">
                <span>Using: <strong>{selectedItem}</strong></span>
        <Button size="sm" variant="secondary" onClick={() => setMode('choose')}><ArrowLeft size={14} className="mr-1"/>Back</Button>
              </div>
              
              <p className="instruction-text">Choose another item to combine with <strong>{selectedItem}</strong>:</p>
              
              {otherItems.length > 0 ? (
                <div className="target-grid">
                  {otherItems.map(item => (
                    <Button 
                      key={item}
                      onClick={() => onUse(selectedItem, item)}
                      className="target-button !justify-start"
                    >
                      <div className="item-icon">📦</div>
                      <span className="item-name">{item}</span>
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <Settings className="empty-icon" />
                  <p>No other items available to combine with.</p>
                </div>
              )}
            </div>
          ) : (
      <div className="target-selection">
              <div className="selected-item">
                <span>Using: <strong>{selectedItem}</strong></span>
        <Button size="sm" variant="secondary" onClick={() => setMode('choose')}><ArrowLeft size={14} className="mr-1"/>Back</Button>
              </div>
              
              <p className="instruction-text">Choose an environmental object to use <strong>{selectedItem}</strong> with:</p>
              
              {environmentItems.length > 0 ? (
                <div className="target-grid">
                  {environmentItems.map(env => (
                    <Button
                      key={env}
                      onClick={() => onUse(selectedItem, env)}
                      className="target-button environmental !justify-start"
                    >
                      <div className="env-icon">🌍</div>
                      <span className="env-name">{env}</span>
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <Wrench className="empty-icon" />
                  <p>There are no environmental objects you can use this item with.</p>
                </div>
              )}
            </div>
          )}
    </RetroModal>
  );
};
