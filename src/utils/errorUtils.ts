/**
 * Error handling utilities for the Tic-Tac-Toe game
 * 
 * This module provides:
 * 1. Error classification and categorization
 * 2. Error logging and reporting utilities
 * 3. Error recovery strategies
 * 4. User-friendly error messages
 */

export enum ErrorType {
  NETWORK = 'NETWORK',
  VALIDATION = 'VALIDATION', 
  GAME_LOGIC = 'GAME_LOGIC',
  STORAGE = 'STORAGE',
  RENDER = 'RENDER',
  UNKNOWN = 'UNKNOWN',
}

export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export interface GameError {
  type: ErrorType;
  severity: ErrorSeverity;
  message: string;
  originalError?: Error;
  context?: Record<string, unknown>;
  timestamp: Date;
  errorId: string;
  userMessage: string;
  recoverable: boolean;
}

/**
 * Create a standardized game error
 */
export const createGameError = (
  type: ErrorType,
  message: string,
  originalError?: Error,
  context?: Record<string, unknown>
): GameError => {
  const errorId = `${type.toLowerCase()}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    type,
    severity: determineSeverity(type, originalError),
    message,
    originalError,
    context,
    timestamp: new Date(),
    errorId,
    userMessage: getUserFriendlyMessage(type, message),
    recoverable: isRecoverable(type),
  };
};

/**
 * Determine error severity based on type and error details
 */
const determineSeverity = (type: ErrorType, error?: Error): ErrorSeverity => {
  switch (type) {
    case ErrorType.RENDER:
      return ErrorSeverity.CRITICAL;
    
    case ErrorType.GAME_LOGIC:
      return ErrorSeverity.HIGH;
    
    case ErrorType.NETWORK:
    case ErrorType.STORAGE:
      return ErrorSeverity.MEDIUM;
    
    case ErrorType.VALIDATION:
      return ErrorSeverity.LOW;
    
    default:
      return ErrorSeverity.MEDIUM;
  }
};

/**
 * Check if an error type is recoverable
 */
const isRecoverable = (type: ErrorType): boolean => {
  switch (type) {
    case ErrorType.NETWORK:
    case ErrorType.VALIDATION:
    case ErrorType.STORAGE:
      return true;
    
    case ErrorType.GAME_LOGIC:
      return true; // Usually recoverable by restarting the game
    
    case ErrorType.RENDER:
      return false; // Usually requires page reload
    
    default:
      return false;
  }
};

/**
 * Get user-friendly error messages
 */
const getUserFriendlyMessage = (type: ErrorType, originalMessage: string): string => {
  switch (type) {
    case ErrorType.NETWORK:
      return "Connection problem. Please check your internet connection and try again.";
    
    case ErrorType.VALIDATION:
      return "Invalid input. Please check your entries and try again.";
    
    case ErrorType.GAME_LOGIC:
      return "Game error occurred. Don't worry, we can restart the game safely.";
    
    case ErrorType.STORAGE:
      return "Unable to save your progress. Please try again.";
    
    case ErrorType.RENDER:
      return "Display error occurred. Please refresh the page.";
    
    default:
      return "An unexpected error occurred. Please try again.";
  }
};

/**
 * Error classification based on error message or type
 */
export const classifyError = (error: Error): ErrorType => {
  const message = error.message.toLowerCase();
  
  if (message.includes('network') || message.includes('fetch') || message.includes('connection')) {
    return ErrorType.NETWORK;
  }
  
  if (message.includes('validation') || message.includes('invalid')) {
    return ErrorType.VALIDATION;
  }
  
  if (message.includes('game') || message.includes('move') || message.includes('board')) {
    return ErrorType.GAME_LOGIC;
  }
  
  if (message.includes('storage') || message.includes('localstorage') || message.includes('save')) {
    return ErrorType.STORAGE;
  }
  
  if (message.includes('render') || message.includes('component') || error.name === 'ChunkLoadError') {
    return ErrorType.RENDER;
  }
  
  return ErrorType.UNKNOWN;
};

/**
 * Log error to console with proper formatting
 */
export const logError = (gameError: GameError): void => {
  const logLevel = gameError.severity === ErrorSeverity.CRITICAL ? 'error' : 'warn';
  
  console.group(`🚨 ${gameError.type} Error [${gameError.severity}]`);
  console[logLevel]('Message:', gameError.message);
  console[logLevel]('User Message:', gameError.userMessage);
  console[logLevel]('Error ID:', gameError.errorId);
  console[logLevel]('Timestamp:', gameError.timestamp.toISOString());
  console[logLevel]('Recoverable:', gameError.recoverable);
  
  if (gameError.context) {
    console[logLevel]('Context:', gameError.context);
  }
  
  if (gameError.originalError) {
    console[logLevel]('Original Error:', gameError.originalError);
    console[logLevel]('Stack:', gameError.originalError.stack);
  }
  
  console.groupEnd();
};

/**
 * Report error to external monitoring service
 */
export const reportError = (gameError: GameError): void => {
  // In production, send to monitoring service
  if (process.env.NODE_ENV === 'production') {
    // Example integrations:
    // Sentry.captureException(gameError.originalError || new Error(gameError.message), {
    //   tags: { errorType: gameError.type, severity: gameError.severity },
    //   extra: { context: gameError.context, errorId: gameError.errorId }
    // });
    
    // LogRocket.captureException(gameError.originalError || new Error(gameError.message));
    
    // Custom analytics
    // analytics.track('Error Occurred', {
    //   errorType: gameError.type,
    //   severity: gameError.severity,
    //   errorId: gameError.errorId,
    //   recoverable: gameError.recoverable
    // });
  }
  
  // Always log locally
  logError(gameError);
};

/**
 * Handle errors with automatic classification and reporting
 */
export const handleError = (
  error: Error | string,
  context?: Record<string, unknown>
): GameError => {
  const errorObj = typeof error === 'string' ? new Error(error) : error;
  const errorType = classifyError(errorObj);
  const gameError = createGameError(errorType, errorObj.message, errorObj, context);
  
  reportError(gameError);
  
  return gameError;
};

/**
 * Retry mechanism for recoverable errors
 */
export const createRetryHandler = <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
) => {
  return async (): Promise<T> => {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        const gameError = handleError(lastError, { attempt, maxRetries });
        
        if (attempt === maxRetries || !gameError.recoverable) {
          throw lastError;
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
    
    throw lastError!;
  };
};

/**
 * Safe wrapper for operations that might throw
 */
export const safeOperation = async <T>(
  operation: () => Promise<T>,
  fallbackValue: T,
  context?: Record<string, unknown>
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    handleError(error as Error, context);
    return fallbackValue;
  }
};

/**
 * Validation error helper
 */
export const createValidationError = (field: string, message: string): GameError => {
  return createGameError(
    ErrorType.VALIDATION,
    `Validation failed for ${field}: ${message}`,
    undefined,
    { field }
  );
};

/**
 * Game logic error helper
 */
export const createGameLogicError = (action: string, details: string): GameError => {
  return createGameError(
    ErrorType.GAME_LOGIC,
    `Game logic error during ${action}: ${details}`,
    undefined,
    { action }
  );
};

/**
 * Network error helper
 */
export const createNetworkError = (url: string, status?: number): GameError => {
  return createGameError(
    ErrorType.NETWORK,
    `Network request failed for ${url}${status ? ` (Status: ${status})` : ''}`,
    undefined,
    { url, status }
  );
};
