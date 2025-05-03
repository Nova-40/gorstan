// /src/main.jsx
// This is the entry point for the Gorstan application. It initializes the React app, wraps it in an error boundary, and renders it to the DOM.

// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Main application component
import ErrorBoundary from './ErrorBoundary'; // Error boundary to catch runtime errors
import './tailwind.css'; // Tailwind CSS for styling

// Detect if the app is running inside an iframe
if (window.self !== window.top) {
  console.log("✅ Gorstan running inside an iframe.");
} else {
  console.log("✅ Gorstan running directly (not framed).");
}

// Get the root DOM element where the app will be mounted
const rootElement = document.getElementById('root');

// Check if the root element exists
if (!rootElement) {
  // Log an error and display a fallback message if the root element is missing
  console.error("❌ Gorstan could not find the root element. Aborting launch.");
  const fallbackMessage = document.createElement('div');
  fallbackMessage.style.textAlign = 'center';
  fallbackMessage.style.padding = '2rem';
  fallbackMessage.style.backgroundColor = '#2e2e2e';
  fallbackMessage.style.color = '#ffffff';
  fallbackMessage.style.fontFamily = 'Arial, sans-serif';
  fallbackMessage.innerHTML = `
    <h1>🚨 Critical Error</h1>
    <p>Gorstan could not initialize because the root element is missing.</p>
    <p>Please check your HTML file or contact support.</p>
  `;
  document.body.appendChild(fallbackMessage);
} else {
  // Render the React application
  try {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>
    );
    console.log("✅ Gorstan successfully initialized and rendered.");
  } catch (err) {
    // Handle errors during rendering
    console.error("❌ Gorstan encountered an error during rendering:", err);

    // Display a fallback error message in the root element
    rootElement.innerHTML = `
      <div style="text-align: center; padding: 2rem; background-color: #2e2e2e; color: #ffffff; font-family: Arial, sans-serif;">
        <h1>🚨 Rendering Error</h1>
        <p>Gorstan encountered an error while rendering the application.</p>
        <p>Please refresh the page or contact support if the issue persists.</p>
        <pre style="text-align: left; margin-top: 1rem; color: #ff4d4d;">${err.toString()}</pre>
      </div>
    `;
  }
}
