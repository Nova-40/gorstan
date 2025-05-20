// Gorstan v2.2.2 – All modules validated and standardized
// ErrorBoundary Component
// React error boundary that catches JavaScript errors in child components.
// Prevents the entire application from crashing by displaying a fallback UI and logging error details for debugging.
//
// MIT License
// Copyright (c) 2025 Geoff Webster
import React from 'react';
/**
 * ErrorBoundary
 * Catches errors in child components, logs them, and displays a fallback UI.
 * Optionally calls a provided logError function for external error reporting.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    // Track error state and details
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  // Update state when an error is caught
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  // Log error details for debugging and optionally external reporting
  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    try {
      console.error("❌ Gorstan crashed unexpectedly:", error, errorInfo);
      if (typeof this.props.logError === "function") {
        this.props.logError(error, errorInfo);
      }
    } catch (err) {
      // Defensive: Prevent error boundary from crashing itself
      console.error("❌ ErrorBoundary failed to log error:", err);
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
        <div
          style={{
            textAlign: 'center',
            padding: '2rem',
            backgroundColor: '#2e2e2e',
            color: '#ffffff',
            minHeight: '60vh',
            borderRadius: '8px',
            margin: '2rem auto',
            maxWidth: 600,
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
          }}
          role="alert"
          aria-live="assertive"
        >
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5em' }}>🚨 Reality distortion detected.</h1>
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
              fontWeight: 600,
              fontSize: '1rem',
              transition: 'background-color 200ms ease-in-out',
            }}
            aria-label="Try to recover from error"
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
/*
  === Change Commentary ===
  - Updated version to 2.2.0 and ensured MIT license is present.
  - All syntax validated and ready for use in the Gorstan React app.
  - Defensive: Error logging and fallback UI are robust and accessible.
  - Module is correctly wired for use as a React error boundary.
  - Comments improved for maintainability and clarity.
*/
