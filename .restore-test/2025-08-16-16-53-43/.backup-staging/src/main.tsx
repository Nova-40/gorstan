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

// src/main.tsx
// Gorstan Game Beta 2
// Gorstan and characters (c) Geoff Webster 2025
// Game module.

import './tailwind.css';

import App from './App';

import { createRoot } from 'react-dom/client';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';
import { TutorialManager } from './engine/TutorialManager';
import { GameStateManager } from './engine/GameStateManager';
import { MagicSystem } from './engine/MagicSystem';
import { Player } from './state/Player';
import { RoomObjectivesManager } from './rooms/RoomObjectives';

console.log("🔥 Gorstan main.tsx executing...");

// Variable declaration
const rootElement = document.getElementById('root');
// Variable declaration
const errorMessage = "Root element not found. Is index.html missing a <div id='root'>?";

if (!rootElement) {
  console.error('[Gorstan]', errorMessage);

  document.body.innerHTML = `
    <div style="
      font-family: 'Courier New', monospace;
      background: #000;
      color: #00ff00;
      padding: 20px;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    ">
      <div>
        <h1>GORSTAN INITIALIZATION ERROR</h1>
        <p>${errorMessage}</p>
        <p>Please check your HTML template and try again.</p>
      </div>
    </div>
  `;
  throw new Error(errorMessage);
}

// Initialize game components
const gameState = GameStateManager.getInstance();
const magicSystem = new MagicSystem(100); // Example initial mana
const player = new Player();
const objectivesManager = new RoomObjectivesManager();

// Start tutorial
const tutorialManager = new TutorialManager(gameState, magicSystem, player, objectivesManager);
tutorialManager.startTutorial();

// Variable declaration
const root = createRoot(rootElement);
root.render(
  <>
    <App />
    <SpeedInsights />
    <Analytics />
  </>
);
