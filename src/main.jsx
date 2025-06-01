// File: src/main.jsx
// MIT License
// © 2025 Geoff Webster – Gorstan Game Project
// Purpose: Module supporting Gorstan gameplay or UI.


// Gorstan Game Module — v2.8.0
// MIT License © 2025 Geoff Webster
// main.jsx — Entry point for Gorstan Game React app.

import React from "react";
import ReactDOM from "react-dom/client";
import AppCore from "./AppCore"; // Fixed import path for AppCore
import "./tailwind.css";

// Entry point: renders the main AppCore component inside #root
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppCore />
  </React.StrictMode>
);

/*
Review summary:
- ✅ Syntax is correct and all logic is preserved.
- ✅ Fixed AppCore import path (was "AppCorex", now "./AppCore").
- ✅ No unused or broken imports.
- ✅ Structure is clear and consistent.
- ✅ Comments clarify intent and behaviour.
- ✅ Module is ready for build and production integration.
*/
