"use client";

import React, { useCallback, useState } from 'react';

export interface ErrorState {
  error: Error | null;
  isError: boolean;
  errorId: string | null;
}

export interface ErrorHandlerOptions {
  onError?: (error: Error) => void;
  fallbackMessage?: string;
  autoReset?: boolean;
  autoResetDelay?: number;
}

/**
 * useErrorHandler - Custom hook for handling async errors and error states
 * 
 * Why we need this:
 * 1. Error Boundaries only catch errors in render methods and lifecycle methods
 * 2. They don't catch errors in event handlers, async code, or promises
 * 3. This hook provides a way to handle those errors manually
 * 
 * Usage examples:
 * - API calls that might fail
 * - Event handler errors
 * - Promise rejections
 * - Async operations
 */
export const useErrorHandler = (options: ErrorHandlerOptions = {}) => {
  const [errorState, setErrorState] = useState<ErrorState>({
    error: null,
    isError: false,
    errorId: null,
  });

  /**
   * Reset error state
   */
  const resetError = useCallback(() => {
    setErrorState({
      error: null,
      isError: false,
      errorId: null,
    });
  }, []);

  /**
   * Handle an error - call this when you catch an error
   */
  const handleError = useCallback((error: Error | string) => {
    const errorObj = typeof error === 'string' ? new Error(error) : error;
    const errorId = `async_error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    setErrorState({
      error: errorObj,
      isError: true,
      errorId,
    });

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Async Error Caught');
      console.error('Error:', errorObj);
      console.error('Stack:', errorObj.stack);
      console.groupEnd();
    }

    // Call custom error handler
    if (options.onError) {
      options.onError(errorObj);
    }

    // Report to monitoring service (in production)
    reportAsyncError(errorObj, errorId);

    // Auto-reset if enabled
    if (options.autoReset) {
      setTimeout(() => {
        resetError();
      }, options.autoResetDelay || 5000);
    }
  }, [options, resetError]);

  /**
   * Wrapper for async functions that automatically handles errors
   */
  const withErrorHandling = useCallback(
    <T extends (...args: unknown[]) => Promise<unknown>>(asyncFn: T): T => {
      return ((...args: unknown[]) => {
        return asyncFn(...args).catch((error: Error) => {
          handleError(error);
          throw error; // Re-throw so calling code can handle it too
        });
      }) as T;
    },
    [handleError]
  );

  /**
   * Safe async wrapper that doesn't re-throw errors
   */
  const safeAsync = useCallback(
    async <T>(asyncFn: () => Promise<T>): Promise<T | null> => {
      try {
        return await asyncFn();
      } catch (error) {
        handleError(error as Error);
        return null;
      }
    },
    [handleError]
  );

  return {
    ...errorState,
    handleError,
    resetError,
    withErrorHandling,
    safeAsync,
  };
};

/**
 * Report async errors to monitoring service
 */
const reportAsyncError = (error: Error, errorId: string) => {
  const errorReport = {
    type: 'async_error',
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    errorId,
  };

  // In production, send to your error monitoring service:
  // Sentry.captureException(error);
  // LogRocket.captureException(error);
  
  console.log('Async Error Report (would be sent to monitoring service):', errorReport);
};


