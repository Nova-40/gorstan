// App Component
// This file defines the main application component, which sets up routing for the Gorstan game.
// It uses React Router to navigate between different parts of the application, including the introductory sequence and the main game interface.

// MIT License
// Copyright (c) 2025 Geoff Webster
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"),
// to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
// and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AppCore from "./AppCore"; // Core component for the introductory sequence
import Game from "./engine/Game"; // Main game component
import "./tailwind.css"; // Tailwind CSS for styling

export default function App() {
  try {
    return (
      // Set up the router for navigation
      <Router>
        <Routes>
          {/* Route for the introductory sequence */}
          <Route path="/" element={<AppCore />} />

          {/* Route for the Control Nexus game interface */}
          <Route path="/controlnexus" element={<Game startRoom="controlnexus" />} />

          {/* Catch-all route to redirect invalid paths to the home page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    );
  } catch (err) {
    // Handle errors during rendering
    console.error("❌ Error rendering App component:", err);
    return (
      <div className="min-h-screen bg-red-900 text-white flex items-center justify-center">
        <h1 className="text-2xl font-bold">An error occurred while loading the application.</h1>
        <p className="mt-4">Please try refreshing the page or contact support if the issue persists.</p>
      </div>
    );
  }
}



