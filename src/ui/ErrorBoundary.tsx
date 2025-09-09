import React, { Component, ReactNode } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: string;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: string) => void;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const errorDetails = errorInfo.componentStack || 'Unknown component stack';

    this.setState({
      errorInfo: errorDetails,
    });

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary caught an error:', error);
      console.error('Component stack:', errorDetails);
    }

    // Call custom error handler if provided
    this.props.onError?.(error, errorDetails);
  }

  private handleRetry = () => {
    this.setState({ hasError: false });
  };

  private handleBugReport = () => {
    const { error, errorInfo } = this.state;

    // Prepare bug report data
    const bugReportData = {
      error: error?.message || 'Unknown error',
      stack: error?.stack || '',
      componentStack: errorInfo || '',
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      gameVersion: process.env.REACT_APP_VERSION || 'unknown',
    };

    // Create GitHub issue URL with prefilled data
    const issueTitle = encodeURIComponent(`[Bug Report] ${error?.message || 'Render Error'}`);
    const issueBody = encodeURIComponent(`## Error Details

**Error Message:** ${bugReportData.error}

**URL:** ${bugReportData.url}

**Timestamp:** ${bugReportData.timestamp}

**Game Version:** ${bugReportData.gameVersion}

## Stack Trace
\`\`\`
${bugReportData.stack}
\`\`\`

## Component Stack
\`\`\`
${bugReportData.componentStack}
\`\`\`

## Browser Info
${bugReportData.userAgent}

## Steps to Reproduce
1. 
2. 
3. 

## Expected Behavior


## Additional Context

`);

    const githubUrl = `https://github.com/Nova-40/gorstan-game/issues/new?title=${issueTitle}&body=${issueBody}&labels=bug,error-boundary`;

    window.open(githubUrl, '_blank');
  };

  override render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="error-boundary p-6 max-w-lg mx-auto bg-red-50 border border-red-200 rounded-lg shadow-sm">
          <div className="flex items-center mb-4">
            <div className="text-red-500 mr-3">⚠️</div>
            <h2 className="text-lg font-semibold text-red-800">Something went wrong</h2>
          </div>

          <div className="text-red-700 mb-4">
            {this.state.error?.message || 'An unexpected error occurred'}
          </div>

          {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
            <details className="mb-4">
              <summary className="text-sm text-red-600 cursor-pointer hover:text-red-800">
                Error Details (Development)
              </summary>
              <pre className="mt-2 text-xs text-red-600 bg-red-100 p-2 rounded overflow-auto max-h-32">
                {this.state.error?.stack}
                {this.state.errorInfo}
              </pre>
            </details>
          )}

          <div className="flex gap-2">
            <button
              onClick={this.handleRetry}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Reload Page
            </button>
            <button
              onClick={this.handleBugReport}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              🐛 Report Bug
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook version for functional components (React 18+)
 */
export function useErrorBoundary() {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error: Error) => {
    setError(error);
  }, []);

  if (error) {
    throw error;
  }

  return { resetError, captureError };
}
