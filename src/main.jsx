// /src/main.jsx
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './ErrorBoundary'; // Wrap the app in an error boundary
import './tailwind.css';

// Detect if running inside an iframe
if (window.self !== window.top) {
  console.log("✅ Gorstan running inside an iframe.");
} else {
  console.log("✅ Gorstan running directly (not framed).");
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("❌ Gorstan could not find the root element. Aborting launch.");
} else {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
}
