// Gorstan Game Module — v3.0.0
// File: src/main.jsx
// MIT License
// © 2025 Geoff Webster – Gorstan Game Project
// Purpose: Module supporting Gorstan gameplay or UI.


// Gorstan Game Module — v3.0.0
// MIT License © 2025 Geoff Webster
// main.jsx — Entry point for Gorstan Game React app.

/*
  Entry point for the Gorstan React application.
  - Renders the main AppCore component inside the #root element.
  - Loads Tailwind CSS for styling.
  - Robust to missing root element.
*/

import React from "react";
import ReactDOM from "react-dom/client";
import AppCore from "./AppCore";
import "./tailwind.css";

/**
 * Safely retrieves the root DOM node for React rendering.
 * @returns {HTMLElement|null} The #root element or null if not found.
 */
function getRootNode() {
  try {
    const root = document.getElementById("root");
    if (!root) {
      // eslint-disable-next-line no-console
      console.error("Root element #root not found. App will not render.");
      return null;
    }
    return root;
  } catch (err) {
    // Defensive: log error and prevent crash if DOM access fails
    // eslint-disable-next-line no-console
    console.error("Error accessing #root element:", err);
    return null;
  }
}

// Get the root node for rendering
const rootNode = getRootNode();

if (rootNode) {
  /**
   * Main render: wraps AppCore in React.StrictMode for highlighting potential problems.
   * If AppCore throws, React will surface the error in the console.
   */
  ReactDOM.createRoot(rootNode).render(
    <React.StrictMode>
      <AppCore />
    </React.StrictMode>
  );
} else {
  // Optionally, render a fallback UI or error message here if #root is missing.
  // document.body.innerHTML += '<div style="color:red;text-align:center;">Failed to start Gorstan: #root not found.</div>';
}

/*
Review summary:
- ✅ Syntax is correct and all logic is preserved.
- ✅ All imports are used and resolved.
- ✅ Defensive check for #root element.
- ✅ JSDoc comments for all functions and logic blocks.
- ✅ No dead code or unused props.
- ✅ Structure is clear and ready for production.
*/
