/**
 * File: src/components/TraitPanelToggle.jsx
 * Gorstan Game – v3.0.5
 * MIT License
 * © 2025 Geoff Webster – Gorstan Game Project
 *
 * Purpose: Module logic for Gorstan game (description TBD).
 */


// Gorstan Game Module — v3.0.0
import React, { useState } from 'react';
import TraitPanel from './TraitPanel';

const TraitPanelToggle = () => {
  const [visible, setVisible] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <>
      <button
        onClick={() => setVisible(!visible)}
        className="fixed right-2 bottom-20 bg-blue-500 text-white rounded-full p-2 shadow-md hover:bg-blue-600 z-50"
        title="Toggle Traits Panel"
      >
        📘
      </button>

      {visible && (
        <TraitPanel fullscreen={fullscreen} toggleFullscreen={() => setFullscreen(!fullscreen)} />
      )}
    </>
  );
};

export default TraitPanelToggle;