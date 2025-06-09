// Gorstan Game Module — v3.0.0
import React, { useContext, useEffect, useState } from 'react';
import { GameContext } from '../engine/GameContext';
// Gorstan Game Module — v3.1.0
// MIT License © 2025 Geoff Webster
// StatusPanel.jsx — Slide-out player status panel with real-time trait/health tracking

import React from "react";
import PropTypes from "prop-types";

const StatusPanel = ({ stats, traits, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-0 right-0 w-64 h-full bg-gray-900 text-green-200 p-4 shadow-lg z-50 overflow-y-auto border-l border-green-600">
      <h2 className="text-xl font-bold mb-4">Player Status</h2>

      <div className="mb-4">
        <h3 className="text-green-400 font-semibold mb-1">Vitals</h3>
        <ul className="text-sm space-y-1">
          <li>Health: {stats.health}</li>
          <li>Energy: {stats.energy}</li>
          <li>Mood: {stats.mood}</li>
        </ul>
      </div>

      <div>
        <h3 className="text-green-400 font-semibold mb-1">Traits</h3>
        <ul className="text-sm list-disc ml-5">
          {traits.map((trait) => (
            <li key={trait.name} title={trait.description}>
              {trait.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

StatusPanel.propTypes = {
  stats: PropTypes.shape({
    health: PropTypes.number,
    energy: PropTypes.number,
    mood: PropTypes.number
  }).isRequired,
  traits: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string
    })
  ).isRequired,
  isVisible: PropTypes.bool.isRequired
};

export default StatusPanel;
