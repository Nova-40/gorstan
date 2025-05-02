// /src/App.jsx
// MIT License
// Gorstan v2.0.0
// This file defines the main application component, which sets up routing for the Gorstan game.
// It uses React Router to navigate between different parts of the application.

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppCore from './AppCore'; // Core component for the introductory sequence
import Game from './engine/Game'; // Main game component
import './tailwind.css'; // Tailwind CSS for styling

export default function App() {
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
}



