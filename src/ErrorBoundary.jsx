// ErrorBoundary Component
// This component is a React error boundary that catches JavaScript errors in its child components.
// It prevents the entire application from crashing by displaying a fallback UI and logging error details for debugging.

// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0

import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    // Initialize state to track whether an error has occurred
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  // Update state when an error is caught
  static getDerivedStateFromError(error) {
    // Update state to display fallback UI
    return { hasError: true, error };
  }

  // Log error details for debugging
  componentDidCatch(error, errorInfo) {
    // Save error details to state for potential future use
    this.setState({ error, errorInfo });

    // Log the error and additional information to the console
    console.error("⚠️ Gorstan crashed unexpectedly:", error, errorInfo);

    // Optionally, send error details to an external logging service
    if (this.props.logError) {
      this.props.logError(error, errorInfo);
    }
  }

  // Reset the error boundary to its initial state
  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // Render fallback UI when an error occurs
      return (
        <div style={{ textAlign: 'centre', padding: '2rem', backgroundColor: '#2e2e2e', color: '#ffffff' }}>
          <h1>🚨 Reality distortion detected.</h1>
          <p>Gorstan cannot stabilize this timeline. Please refresh the page or try again later.</p>
          {this.state.error && (
            <details style={{ whiteSpace: 'pre-wrap', marginTop: '1rem', color: '#ff4d4d' }}>
              <summary>Error Details</summary>
              {this.state.error.toString()}
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </details>
          )}
          <button
            onClick={this.handleReset}
            style={{
              marginTop: '1rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#646cff',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'background-colour 200ms ease-in-out',
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    // Render children if no error occurred
    return this.props.children;
  }
}

export default ErrorBoundary;
