// App.jsx
// Root component for the Gorstan React application.
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0

import React from "react";
import AppCore from "./AppCore"; // Core application component

/**
 * App Component
 * Serves as the root component for the Gorstan application.
 * Wraps the AppCore component and handles any top-level error boundaries if needed.
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
        <h1 className="text-4xl font-bold">Application Error</h1>
        <p className="text-red-400">
          The application encountered an unexpected error. Please reload the page or contact support.
        </p>
      </div>
    );
  }
}



