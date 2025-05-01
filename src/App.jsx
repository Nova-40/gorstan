// /src/App.jsx
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppCore from './AppCore';
import './tailwind.css';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* AppCore handles both the intro and the game logic */}
        <Route path="/" element={<AppCore />} />
        <Route path="/controlnexus" element={<AppCore />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}


