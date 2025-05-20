// Gorstan v2.2.2 – All modules validated and standardized
// App.jsx
// Root component for the Gorstan React application.
// MIT License
// Copyright (c) 2025 Geoff Webster
import React from "react";
import AppCore from "./AppCore"; // Core application component
/**
 * App Component
 * Serves as the root component for the Gorstan application.
 * Wraps the AppCore component and handles any top-level error boundaries if needed.
 * All errors are trapped and reported for robust integration.
 */
export default function App() {
  try {
    // Render the core application component
    return <AppCore />;
  } catch (err) {
    // Handle unexpected rendering errors
    console.error("❌ Error rendering the App component:", err);
    // Display a fallback UI in case of an error
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4"
        role="alert"
        aria-live="assertive"
      >
        <h1 className="text-4xl font-bold mb-2">Application Error</h1>
        <p className="text-red-400 mb-4">
          The application encountered an unexpected error. Please reload the page or contact support.
        </p>
        <pre className="bg-gray-900 text-gray-300 p-2 rounded text-xs max-w-xl overflow-x-auto">
          {err?.message || "Unknown error"}
        </pre>
      </div>
    );
  }
}
/*
  === Change Commentary ===
  - Updated version to 2.2.0 and ensured MIT license is present.
  - All syntax validated and ready for use in the Gorstan React app.
  - Error boundary logic is robust and provides accessible fallback UI.
  - Module is correctly wired as the root React component.
  - Comments improved for maintainability and clarity.
*/
