// Gorstan v2.4.0 – All modules validated and standardized
// MIT License © 2025 Geoff Webster
// ErrorBoundary Component
// React error boundary that catches JavaScript errors in child components.
// Prevents the entire application from crashing by displaying a fallback UI and logging error details for debugging.

/**
 * ErrorBoundary
 * Catches errors in child components, logs them, and displays a fallback UI.
 * Optionally calls a provided logError function for external error reporting.
 * Allows custom fallback UI via props.
 * Reports errors to telemetry in production.
 */
import React from 'react';

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
      // Call custom error logger if provided
      if (typeof this.props.logError === "function") {
        this.props.logError(error, errorInfo);
      }
      // Telemetry/reporting for production
      if (process.env.NODE_ENV === "production" && typeof window !== "undefined") {
        // Example: Google Analytics (gtag)
        if (window.gtag) {
          window.gtag("event", "exception", {
            description: error?.message || "Unknown error",
            fatal: true,
          });
        }
        // TODO: Add custom telemetry/reporting endpoint if needed
        // fetch("/api/reportError", { method: "POST", body: JSON.stringify({ error, errorInfo }) });
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
    const { hasError, error, errorInfo } = this.state;
    const { fallback } = this.props;
    if (hasError) {
      // Allow custom fallback UI via props
      if (typeof fallback === "function") return fallback(error, errorInfo, this.handleReset);
      if (React.isValidElement(fallback)) return fallback;
      // Default fallback UI
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
          {error && (
            <details style={{ whiteSpace: 'pre-wrap', marginTop: '1rem', color: '#ff4d4d' }}>
              <summary>Error Details</summary>
              {error.toString()}
              {errorInfo && errorInfo.componentStack}
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
  === MODULE REVIEW ===
  1. 🔍 VALIDATION
     - No syntax errors or deprecated patterns.
     - No broken imports/exports or circular dependencies.
     - No unreachable code.
  2. 🔁 REFACTORING
     - Updated version to 2.4.0 and MIT license header.
     - Allows custom fallback UI via props (function or element).
     - Telemetry/reporting for production errors.
     - Defensive error handling in componentDidCatch.
     - Improved comments and structure.
  3. 💬 COMMENTS & DOCUMENTATION
     - Module and function-level comments included.
     - MIT license and version header included.
  4. 🤝 INTEGRATION CHECK
     - Exports default ErrorBoundary for use in App.jsx or other components.
     - No side effects; safe for integration.
  5. 🧰 BONUS IMPROVEMENTS
     - Could add support for error boundary reset via props.
     - Could allow for error boundary nesting for finer granularity.
     - Could add analytics hooks for error frequency.
*/
