"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

/**
 * ErrorBoundary - Catches JavaScript errors in child components
 * 
 * Key concepts:
 * 1. Error boundaries catch errors during rendering, in lifecycle methods, and in constructors
 * 2. They do NOT catch errors in event handlers, async code, or during server-side rendering
 * 3. They provide a fallback UI when errors occur
 * 4. They help prevent the entire app from crashing due to a single component error
 */
export class ErrorBoundary extends Component<Props, State> {
  private retryTimeoutId: number | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    };
  }

  /**
   * Static method called when an error occurs
   * Updates state to trigger fallback UI
   */
  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  /**
   * Called after an error has been thrown by a descendant component
   * Used for error logging and reporting
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Boundary Caught an Error');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Component Stack:', errorInfo.componentStack);
      console.groupEnd();
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production, you would send this to an error reporting service
    // Example: Sentry, LogRocket, Bugsnag, etc.
    this.reportError(error, errorInfo);
  }

  /**
   * Report error to monitoring service
   * In a real app, this would send to Sentry, LogRocket, etc.
   */
  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    // Example error reporting (replace with your service)
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      errorId: this.state.errorId,
    };

    // In production, send to your error monitoring service:
    // Sentry.captureException(error, { contexts: { react: errorInfo } });
    // LogRocket.captureException(error);
    
    console.log('Error Report (would be sent to monitoring service):', errorReport);
  };

  /**
   * Retry mechanism - attempts to recover from the error
   */
  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    });
  };

  /**
   * Navigate back to home/main menu
   */
  private handleGoHome = () => {
    // Reset error state
    this.handleRetry();
    
    // Navigate to home - in a real app you might use router
    window.location.href = '/';
  };

  /**
   * Auto-retry after a delay (useful for transient errors)
   */
  private handleAutoRetry = () => {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }

    this.retryTimeoutId = window.setTimeout(() => {
      this.handleRetry();
    }, 3000);
  };

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI provided by parent
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="mb-4">
              <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
            </div>
            
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              Oops! Something went wrong
            </h1>
            
            <p className="text-gray-600 mb-6">
              We encountered an unexpected error. Don&apos;t worry, your game progress is safe.
            </p>

            {/* Error details in development */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left bg-gray-100 rounded p-3">
                <summary className="cursor-pointer font-medium text-sm text-gray-700 mb-2">
                  Error Details (Development Only)
                </summary>
                <div className="text-xs text-gray-600 font-mono">
                  <div className="mb-2">
                    <strong>Error:</strong> {this.state.error.message}
                  </div>
                  <div className="mb-2">
                    <strong>Error ID:</strong> {this.state.errorId}
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong>Component Stack:</strong>
                      <pre className="whitespace-pre-wrap text-xs mt-1">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            {/* Action buttons */}
            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="w-full flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                <Home className="mr-2 h-4 w-4" />
                Go to Main Menu
              </button>

              <button
                onClick={this.handleAutoRetry}
                className="w-full text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Auto-retry in 3 seconds
              </button>
            </div>

            {/* Error ID for support */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Error ID: {this.state.errorId}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Please include this ID when reporting the issue
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
