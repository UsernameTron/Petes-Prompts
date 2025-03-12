import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-xl font-bold text-red-800 mb-4">Something went wrong</h2>
          <div className="mb-4 p-4 bg-white rounded-md border border-red-100">
            <p className="font-mono text-red-600 text-sm overflow-auto whitespace-pre-wrap">
              {this.state.error && this.state.error.toString()}
            </p>
          </div>
          <details className="mt-4">
            <summary className="text-sm font-medium cursor-pointer">Technical Details</summary>
            <div className="mt-2 p-4 bg-gray-100 rounded-md">
              <pre className="font-mono text-gray-800 text-xs overflow-auto whitespace-pre-wrap">
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </div>
          </details>
          <button
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        </div>
      );
    }

    // If there's no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;