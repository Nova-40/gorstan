// Gorstan Game Module — v3.0.0
import React, { useContext, useEffect, useState } from 'react';
import { GameContext } from '../engine/GameContext';

const StatBar = ({ label, value, icon }) => {
  const percentage = Math.max(0, Math.min(100, value));
  let barColor = 'bg-green-500';
  if (percentage < 50) barColor = 'bg-yellow-400';
  if (percentage < 25) barColor = 'bg-red-500 animate-pulse';

  return (
    <div className="mb-2">
      <div className="flex justify-between text-sm font-medium">
        <span>{icon} {label}</span>
        <span>{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const StatusPanel = () => {
  const { state } = useContext(GameContext);
  const { health = 100, energy = 100, mood = 100 } = state;
  const [flashColor, setFlashColor] = useState("green");

  useEffect(() => {
    const minStat = Math.min(health, energy, mood);
    let color = "green";
    if (minStat < 25) color = "red";
    else if (minStat < 50) color = "amber";

    setFlashColor(color);
    const timeout = setTimeout(() => setFlashColor("green"), 1500);
    return () => clearTimeout(timeout);
  }, [health, energy, mood]);

  const borderStyles = {
    green: "border-green-500",
    amber: "border-yellow-400 animate-pulse",
    red: "border-red-500 animate-pulse",
  };

  return (
    <div className={`fixed right-2 top-20 w-48 p-4 bg-white shadow-lg rounded-xl z-50 text-xs border-2 transition-all duration-300 ${borderStyles[flashColor]}`}>
      <h2 className="text-sm font-bold mb-2 text-center">📊 Status</h2>
      <StatBar label="Health" value={health} icon="❤️" />
      <StatBar label="Energy" value={energy} icon="⚡" />
      <StatBar label="Mood" value={mood} icon="😐" />
    </div>
  );
};

export default StatusPanel;