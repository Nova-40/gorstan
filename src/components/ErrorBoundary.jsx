// Gorstan v2.4.0 – All modules validated and standardized
// MIT License © 2025 Geoff Webster
// ErrorBoundary.jsx
// React error boundary for Gorstan. Catches JavaScript errors in child components,
// prevents the app from crashing, displays a fallback UI, and logs error details.

/*
  === MODULE REVIEW ===
  1. 🔍 VALIDATION
     - No syntax errors or deprecated patterns.
     - No broken imports/exports or circular dependencies.
     - No unreachable code.
  2. 🔁 REFACTORING
     - Uses modern React patterns for error boundaries (class component).
     - Efficient and readable; no unused variables.
     - Naming is clear and consistent.
     - Defensive error handling in error boundary itself.
  3. 💬 COMMENTS & DOCUMENTATION
     - Added module and function-level comments.
     - MIT license and version header included.
     - PropTypes added for clarity.
  4. 🤝 INTEGRATION CHECK
     - Can wrap any React subtree; expects children and optional logError prop.
     - No side effects; safe for integration.
  5. 🧰 BONUS IMPROVEMENTS
     - Could extract error logging to a utility if used elsewhere.
     - Could add unit tests for error boundary behavior.
*/

import React from "react";
import PropTypes from "prop-types";

/**
 * ErrorBoundary
 * Catches errors in child components and displays a fallback UI.
 * Optionally logs errors via a provided logError function prop.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    // Track error state and details
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  // React lifecycle: update state when an error is caught
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // React lifecycle: log error details and optionally report externally
  componentDidCatch(error, errorInfo) {
    try {
      this.setState({ error, errorInfo });
      // Log to console for developer visibility
      console.error("⚠️ Gorstan crashed unexpectedly:", error, errorInfo);
      // Optionally send error to external logging service
      if (typeof this.props.logError === "function") {
        this.props.logError(error, errorInfo);
      }
    } catch (err) {
      // Defensive: catch errors in error handling itself
      console.error("❌ ErrorBoundary: Failed during error reporting.", err);
    }
  }

  // Allow user to reset the error boundary
  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI for error state
      return (
        <div style={{
          textAlign: "center",
          padding: "2rem",
          backgroundColor: "#2e2e2e",
          color: "#ffffff",
          minHeight: "100vh"
        }}>
          <h1>🚨 Reality distortion detected.</h1>
          <p>Gorstan cannot stabilize this timeline. Please refresh the page or try again later.</p>
          {this.state.error && (
            <details style={{ whiteSpace: "pre-wrap", marginTop: "1rem", color: "#ff4d4d" }}>
              <summary>Error Details</summary>
              {this.state.error.toString()}
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </details>
          )}
          <button
            onClick={this.handleReset}
            style={{
              marginTop: "1rem",
              padding: "0.75rem 1.5rem",
              backgroundColor: "#646cff",
              color: "#ffffff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              transition: "background-color 200ms ease-in-out",
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

// PropTypes for documentation and runtime validation
ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  logError: PropTypes.func, // Optional external error logger
};

export default ErrorBoundary;
