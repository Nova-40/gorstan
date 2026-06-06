/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.

  Parser-backed use-item chooser for the modular AppCore.

  This component deliberately emits text parser commands rather than mutating
  game state directly. The parser remains the source of truth for item logic.
*/

import React, { useState } from 'react';

interface UseItemChooserProps {
  readonly inventory: string[];
  readonly targets: string[];
  readonly onCommand: (command: string) => void;
  readonly onClose: () => void;
}

const UseItemChooser: React.FC<UseItemChooserProps> = ({
  inventory,
  targets,
  onCommand,
  onClose,
}) => {
  const [selectedUseItem, setSelectedUseItem] = useState<string>('');
  const [selectedUseTarget, setSelectedUseTarget] = useState<string>('');

  return (
    <div className="console-theme modal-panel">
      <h2>Use Item</h2>
      {inventory.length === 0 ? (
        <p>You are not carrying anything usable.</p>
      ) : (
        <>
          <label>
            Item
            <select value={selectedUseItem} onChange={(event) => setSelectedUseItem(event.target.value)}>
              <option value="">Choose an item…</option>
              {inventory.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            Target optional
            <select value={selectedUseTarget} onChange={(event) => setSelectedUseTarget(event.target.value)}>
              <option value="">No target</option>
              {targets.map((target) => (
                <option key={target} value={target}>{target}</option>
              ))}
            </select>
          </label>
          <button
            type="button"
            disabled={!selectedUseItem}
            onClick={() => {
              const command = selectedUseTarget
                ? `use ${selectedUseItem} with ${selectedUseTarget}`
                : `use ${selectedUseItem}`;
              onCommand(command);
              onClose();
              setSelectedUseItem('');
              setSelectedUseTarget('');
            }}
          >
            Use selected item
          </button>
        </>
      )}
      <p className="modal-hint">This sends the same command as the parser.</p>
    </div>
  );
};

export default UseItemChooser;
