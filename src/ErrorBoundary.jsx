// /src/ErrorBoundary.jsx
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0

import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state to display fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error("⚠️ Gorstan crashed unexpectedly:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h1>🚨 Reality distortion detected.</h1>
          <p>Gorstan cannot stabilize this timeline. Please refresh the page or try again later.</p>
        </div>
      );
    }

    // Render children if no error occurred
    return this.props.children;
  }
}

export default ErrorBoundary;
