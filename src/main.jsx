// main.jsx
// Entry point for the Gorstan React application.
// MIT License Copyright (c) 2025 Geoff Webster
// Gorstan v2.1.0

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // Main application component
import "./tailwind.css"; // Global styles (e.g., Tailwind CSS or custom styles)

/**
 * Initializes and renders the Gorstan React application.
 * Ensures the root element exists and handles errors gracefully.
 */
const rootElement = document.getElementById("root");

if (!rootElement) {
  // Log an error and stop rendering if the root element is missing
  console.error("❌ Root element not found. Ensure your HTML file has a <div id='root'></div>.");

  // Display a fallback error message in the DOM
  const fallbackMessage = document.createElement("div");
  fallbackMessage.style.textAlign = "center";
  fallbackMessage.style.padding = "2rem";
  fallbackMessage.style.backgroundColor = "#2e2e2e";
  fallbackMessage.style.color = "#ffffff";
  fallbackMessage.style.fontFamily = "Arial, sans-serif";
  fallbackMessage.innerHTML = `
    <h1>🚨 Critical Error</h1>
    <p>The application could not initialize because the root element is missing.</p>
    <p>Please check your HTML file or contact support.</p>
  `;
  document.body.appendChild(fallbackMessage);
} else {
  try {
    // Render the React application into the root element
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("✅ Gorstan application successfully rendered.");
  } catch (err) {
    // Handle rendering errors
    console.error("❌ An error occurred while rendering the application:", err);

    // Display a fallback error message in the root element
    rootElement.innerHTML = `
      <div style="text-align: center; padding: 2rem; background-color: #2e2e2e; color: #ffffff; font-family: Arial, sans-serif;">
        <h1>🚨 Rendering Error</h1>
        <p>The application encountered an error while rendering.</p>
        <p>Please refresh the page or contact support if the issue persists.</p>
        <pre style="text-align: left; margin-top: 1rem; color: #ff4d4d;">${err.toString()}</pre>
      </div>
    `;
  }
}
