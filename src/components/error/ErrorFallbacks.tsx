"use client";

import React from 'react';
import { AlertTriangle, Wifi, RefreshCw, GamepadIcon } from 'lucide-react';

interface ErrorFallbackProps {
  onRetry?: () => void;
  onGoHome?: () => void;
}

/**
 * Generic error fallback for general errors
 */
export const GenericErrorFallback: React.FC<ErrorFallbackProps> = ({ onRetry, onGoHome }) => (
  <div className="flex flex-col items-center justify-center min-h-[300px] p-6 text-center">
    <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
    <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
    <p className="text-gray-600 mb-6">
      We encountered an unexpected error. Please try again.
    </p>
    <div className="flex gap-3">
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </button>
      )}
      {onGoHome && (
        <button
          onClick={onGoHome}
          className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Go Home
        </button>
      )}
    </div>
  </div>
);

/**
 * Network error fallback for connection issues
 */
export const NetworkErrorFallback: React.FC<ErrorFallbackProps> = ({ onRetry }) => (
  <div className="flex flex-col items-center justify-center min-h-[300px] p-6 text-center">
    <Wifi className="h-16 w-16 text-orange-500 mb-4" />
    <h2 className="text-xl font-bold text-gray-900 mb-2">Connection Problem</h2>
    <p className="text-gray-600 mb-6">
      Unable to connect to the server. Please check your internet connection and try again.
    </p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Retry Connection
      </button>
    )}
  </div>
);

/**
 * Game-specific error fallback
 */
export const GameErrorFallback: React.FC<ErrorFallbackProps & { gameMode?: string }> = ({ 
  onRetry, 
  onGoHome, 
  gameMode 
}) => (
  <div className="flex flex-col items-center justify-center min-h-[300px] p-6 text-center">
    <GamepadIcon className="h-16 w-16 text-purple-500 mb-4" />
    <h2 className="text-xl font-bold text-gray-900 mb-2">Game Error</h2>
    <p className="text-gray-600 mb-6">
      Something went wrong with the {gameMode || 'game'}. Your progress has been saved.
    </p>
    <div className="flex gap-3">
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Restart Game
        </button>
      )}
      {onGoHome && (
        <button
          onClick={onGoHome}
          className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Main Menu
        </button>
      )}
    </div>
  </div>
);

/**
 * Loading error fallback for when components fail to load
 */
export const LoadingErrorFallback: React.FC<ErrorFallbackProps> = ({ onRetry }) => (
  <div className="flex flex-col items-center justify-center min-h-[200px] p-6 text-center">
    <div className="animate-pulse">
      <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Failed</h3>
    <p className="text-gray-600 mb-4">
      Failed to load this component. Please try again.
    </p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="flex items-center px-3 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
      >
        <RefreshCw className="mr-2 h-3 w-3" />
        Reload
      </button>
    )}
  </div>
);

/**
 * Inline error display for smaller errors
 */
export const InlineError: React.FC<{ 
  message: string; 
  onDismiss?: () => void;
  variant?: 'error' | 'warning' | 'info';
}> = ({ message, onDismiss, variant = 'error' }) => {
  const colors = {
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
  };

  return (
    <div className={`p-3 rounded-md border ${colors[variant]} mb-4`}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{message}</p>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-2 text-current opacity-70 hover:opacity-100"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};
