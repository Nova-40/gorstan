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
// Gorstan Game Beta 3
// Gorstan and characters (c) Geoff Webster 2025
// Game module.

import './tailwind.css';

// Original full game App now loaded inside GameShell; landing site root here
import SiteRoot from './SiteRoot';
import { ThemeProvider } from './design/ThemeProvider';

// React import not needed with automatic JSX runtime

import { createRoot } from 'react-dom/client';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';













console.log("🔥 Gorstan main.tsx executing...");

// Variable declaration
const rootElement = document.getElementById('root');
// Variable declaration
const errorMessage = "Root element not found. Is index.html missing a <div id='root'>?";

if (!rootElement) {
  console.error('[Gorstan]', errorMessage);

  document.body.innerHTML = `
    <div style="
      font-family: 'JetBrains Mono', 'Courier New', monospace;
      background: #0B0F0E;
      color: #39FF14;
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


// Variable declaration
// Remove pre-splash placeholder if present before rendering React tree
try {
  const pre = document.getElementById('pre-splash');
  if (pre && pre.parentElement === rootElement) {
    pre.remove();
  }
} catch (e) {
  console.warn('[Gorstan] Failed to remove pre-splash placeholder', e);
}

const root = createRoot(rootElement);
root.render(
  <ThemeProvider>
  <SiteRoot />
    <SpeedInsights />
    <Analytics />
  </ThemeProvider>
);
