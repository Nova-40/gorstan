/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.

  Structured use-item chooser for the modular AppCore.

  This component dispatches the same reducer-backed item actions as the legacy
  AppCore use-item flow.
*/

import React, { useState } from 'react';

interface UseItemChooserProps {
  readonly inventory: string[];
  readonly targets: string[];
  readonly onUse: (item: string, target?: string) => void;
  readonly onClose: () => void;
}

const UseItemChooser: React.FC<UseItemChooserProps> = ({
  inventory,
  targets,
  onUse,
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
              onUse(selectedUseItem, selectedUseTarget || undefined);
              onClose();
              setSelectedUseItem('');
              setSelectedUseTarget('');
            }}
          >
            Use selected item
          </button>
        </>
      )}
      <p className="modal-hint">Uses the same item action flow as the legacy inventory modal.</p>
    </div>
  );
};

export default UseItemChooser;
