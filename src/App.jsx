// /src/App.jsx
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0

// This is the main entry point for the Gorstan Text Adventure game.
// It handles routing, player input, game state, and rendering the UI.

// /src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import IntroSequence from './components/IntroSequence';
import AppCore from './AppCore';
import './tailwind.css';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/intro" element={<IntroSequence />} />
        <Route path="/controlnexus" element={<AppCore />} />
        <Route path="*" element={<Navigate to="/intro" replace />} />
      </Routes>
    </Router>
  );
}

