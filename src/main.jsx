import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import ErrorBoundary from './ErrorBoundary' // 👈 import the boundary
import './index.css'

// Simple iframe detection
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
      <ErrorBoundary> {/* 👈 wrap the app in the boundary */}
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
}
