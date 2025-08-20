/*
  Gorstan – Magic Modal
  This component provides a UI for the magic system, allowing players to view and cast spells.
*/

import React, { useState } from 'react';
import { MagicSystem, Spell } from '../engine/MagicSystem';

const MagicModal: React.FC<{ magicSystem: MagicSystem; onClose: () => void }> = ({ magicSystem, onClose }) => {
  const [selectedSpell, setSelectedSpell] = useState<Spell | null>(null);
  const [message, setMessage] = useState('');

  const handleCastSpell = () => {
    if (selectedSpell) {
      const result = magicSystem.castSpell(selectedSpell.id, {}); // Replace {} with actual target
      setMessage(result.toString());
    }
  };

  return (
    <div className="magic-modal">
      <h2>Magic System</h2>
      <p>Mana: {magicSystem.getMana()}</p>
      <ul>
        {magicSystem.getSpells().map(spell => (
          <li key={spell.id} onClick={() => setSelectedSpell(spell)}>
            {spell.name} - {spell.manaCost} Mana
          </li>
        ))}
      </ul>
      {selectedSpell && (
        <div>
          <h3>{selectedSpell.name}</h3>
          <p>{selectedSpell.description}</p>
          <button onClick={handleCastSpell}>Cast Spell</button>
        </div>
      )}
      <p>{message}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default MagicModal;
