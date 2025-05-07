# Gorstan Game Codebase Overview

## `src/App.jsx`

**Purpose:** This module defines components or logic functions related to gameplay.

**Styling:** TailwindCSS is applied for UI.

**Exports:**
```
export default function App() {
```


---

## `src/AppCore.jsx`

**Purpose:** This module defines components or logic functions related to gameplay.

**React Hooks:** This file uses React state and side effects.

**Styling:** TailwindCSS is applied for UI.

**Exports:**
```
export default function AppCore() {
```


---

## `src/ErrorBoundary.jsx`

**Purpose:** This module defines components or logic functions related to gameplay.

**Exports:**
```
export default ErrorBoundary;
```


---

## `src/main.jsx`

**Purpose:** This module defines components or logic functions related to gameplay.

**Styling:** TailwindCSS is applied for UI.


---

## `src/MultiverseReset.jsx`

**Purpose:** This module defines components or logic functions related to gameplay.

**React Hooks:** This file uses React state and side effects.

**Styling:** TailwindCSS is applied for UI.

**Exports:**
```
export default function MultiverseReset({ onComplete }) {
```


---

## `src/components/AylaButton.jsx`

**Purpose:** This module defines components or logic functions related to gameplay.

**React Hooks:** This file uses React state and side effects.

**Styling:** TailwindCSS is applied for UI.

**Exports:**
```
export default function AylaButton({ onAsk }) {
```


---

## `src/components/CodexPanel.jsx`

**Purpose:** This module defines components or logic functions related to gameplay.

**Styling:** TailwindCSS is applied for UI.

**Exports:**
```
export default function CodexPanel({ codex }) {
```


---

## `src/components/Game.jsx`

**Purpose:** This module defines components or logic functions related to gameplay.

**React Hooks:** This file uses React state and side effects.

**Styling:** TailwindCSS is applied for UI.

**Exports:**
```
export default function Game({ startRoom = "controlnexus" }) {
```


---

## `src/components/IntroSequence.jsx`

**Purpose:** This module defines components or logic functions related to gameplay.

**React Hooks:** This file uses React state and side effects.

**Styling:** TailwindCSS is applied for UI.

**Exports:**
```
export default function IntroSequence({ onComplete }) {
```


---

## `src/components/InventoryPanel.jsx`

**Purpose:** This module defines components or logic functions related to gameplay.

**Styling:** TailwindCSS is applied for UI.

**Exports:**
```
export default function InventoryPanel({ inventory }) {
```


---

## `src/components/MovementPanel.jsx`

**Purpose:** This module defines components or logic functions related to gameplay.

**Styling:** TailwindCSS is applied for UI.

**Exports:**
```
export default function MovementPanel({
```


---

## `src/components/PuzzleUI.jsx`

**Purpose:** This module defines components or logic functions related to gameplay.

**React Hooks:** This file uses React state and side effects.

**Styling:** TailwindCSS is applied for UI.

**Exports:**
```
export default function PuzzleUI({ puzzle, onSolve }) {
```


---

## `src/components/RoomRenderer.jsx`

**Purpose:** This module defines components or logic functions related to gameplay.

**Styling:** TailwindCSS is applied for UI.

**Exports:**
```
export default function RoomRenderer({ roomId }) {
```


---

## `src/components/WelcomeScreen.jsx`

**Purpose:** This module defines components or logic functions related to gameplay.

**Styling:** TailwindCSS is applied for UI.

**Exports:**
```
export default function WelcomeScreen({ onStartIntro }) {
```


---

## `src/engine/AutoWalkGame.js`

**Purpose:** This module defines components or logic functions related to gameplay.

**Navigation:** This module likely handles routing or scene transitions.


---

## `src/engine/aylaHelp.js`

**Purpose:** This module defines components or logic functions related to gameplay.


---

## `src/engine/commandParser.js`

**Purpose:** This module defines components or logic functions related to gameplay.


---

## `src/engine/dialogueMemory.js`

**Purpose:** This module defines components or logic functions related to gameplay.

**Exports:**
```
export const dialogueMemory = new DialogueMemory();
```


---

## `src/engine/eventTriggers.js`

**Purpose:** This module defines components or logic functions related to gameplay.


---

## `src/engine/GameEngine.js`

**Purpose:** This module defines components or logic functions related to gameplay.


---

## `src/engine/inventory.js`

**Purpose:** This module defines components or logic functions related to gameplay.

**Exports:**
```
export const inventory = {
```


---

## `src/engine/npcs.js`

**Purpose:** This module defines components or logic functions related to gameplay.

**Exports:**
```
export const npcs = {
```


---

## `src/engine/npcSupportSystem.js`

**Purpose:** This module defines components or logic functions related to gameplay.

**Exports:**
```
export const npcDialogueMap = {
```


---

## `src/engine/puzzles.js`

**Purpose:** This module defines components or logic functions related to gameplay.

**Exports:**
```
export const puzzles = {
```


---

## `src/engine/resetSystem.js`

**Purpose:** This module defines components or logic functions related to gameplay.


---

## `src/engine/rooms.js`

**Purpose:** This module defines components or logic functions related to gameplay.

**Exports:**
```
export const rooms = {
```


---

## `src/engine/saveLoad.js`

**Purpose:** This module defines components or logic functions related to gameplay.


---

## `src/engine/secretUnlock.js`

**Purpose:** This module defines components or logic functions related to gameplay.

**Exports:**
```
export const secretUnlocks = {
```


---

## `src/engine/storyProgress.js`

**Purpose:** This module defines components or logic functions related to gameplay.

**Exports:**
```
export const storyProgress = {
```


---

## `src/engine/characters/al.js`

**Purpose:** This module defines components or logic functions related to gameplay.

**Exports:**
```
export const al = new Al();
```


---

## `src/engine/characters/morthos.js`

**Purpose:** This module defines components or logic functions related to gameplay.

**Exports:**
```
export const morthos = new Morthos();
```


---
