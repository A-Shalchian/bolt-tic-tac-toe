/**
 * @jest-environment jsdom
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useErrorHandler } from '../useErrorHandler';

// Mock console methods
const originalConsole = {
  group: console.group,
  groupEnd: console.groupEnd,
  error: console.error,
  log: console.log,
};

beforeAll(() => {
  console.group = jest.fn();
  console.groupEnd = jest.fn();
  console.error = jest.fn();
  console.log = jest.fn();
});

afterAll(() => {
  Object.assign(console, originalConsole);
});

describe('useErrorHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useErrorHandler());

      expect(result.current.error).toBe(null);
      expect(result.current.isError).toBe(false);
      expect(result.current.errorId).toBe(null);
    });
  });

  describe('Error Handling', () => {
    it('should handle Error objects', () => {
      const { result } = renderHook(() => useErrorHandler());
      const testError = new Error('Test error');

      act(() => {
        result.current.handleError(testError);
      });

      expect(result.current.error).toBe(testError);
      expect(result.current.isError).toBe(true);
      expect(result.current.errorId).toBeTruthy();
      expect(result.current.errorId).toMatch(/^async_error_/);
    });

    it('should handle string errors', () => {
      const { result } = renderHook(() => useErrorHandler());
      const errorMessage = 'String error message';

      act(() => {
        result.current.handleError(errorMessage);
      });

      expect(result.current.error?.message).toBe(errorMessage);
      expect(result.current.isError).toBe(true);
      expect(result.current.errorId).toBeTruthy();
    });

    it('should call custom onError callback', () => {
      const onError = jest.fn();
      const { result } = renderHook(() => useErrorHandler({ onError }));
      const testError = new Error('Test error');

      act(() => {
        result.current.handleError(testError);
      });

      expect(onError).toHaveBeenCalledWith(testError);
    });

    it('should generate unique error IDs', () => {
      const { result } = renderHook(() => useErrorHandler());

      act(() => {
        result.current.handleError('First error');
      });
      const firstErrorId = result.current.errorId;

      act(() => {
        result.current.resetError();
      });

      act(() => {
        result.current.handleError('Second error');
      });
      const secondErrorId = result.current.errorId;

      expect(firstErrorId).not.toBe(secondErrorId);
    });
  });

  describe('Error Reset', () => {
    it('should reset error state', () => {
      const { result } = renderHook(() => useErrorHandler());

      act(() => {
        result.current.handleError('Test error');
      });

      expect(result.current.isError).toBe(true);

      act(() => {
        result.current.resetError();
      });

      expect(result.current.error).toBe(null);
      expect(result.current.isError).toBe(false);
      expect(result.current.errorId).toBe(null);
    });
  });

  describe('Auto Reset', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should auto-reset after specified delay', () => {
      const { result } = renderHook(() => 
        useErrorHandler({ autoReset: true, autoResetDelay: 1000 })
      );

      act(() => {
        result.current.handleError('Test error');
      });

      expect(result.current.isError).toBe(true);

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(result.current.isError).toBe(false);
    });

    it('should use default delay when not specified', () => {
      const { result } = renderHook(() => 
        useErrorHandler({ autoReset: true })
      );

      act(() => {
        result.current.handleError('Test error');
      });

      expect(result.current.isError).toBe(true);

      act(() => {
        jest.advanceTimersByTime(5000); // Default delay
      });

      expect(result.current.isError).toBe(false);
    });
  });

  describe('withErrorHandling', () => {
    it('should wrap async functions and catch errors', async () => {
      const { result } = renderHook(() => useErrorHandler());
      
      const failingAsyncFn = jest.fn().mockRejectedValue(new Error('Async error'));
      const wrappedFn = result.current.withErrorHandling(failingAsyncFn);

      await expect(wrappedFn()).rejects.toThrow('Async error');
      
      await waitFor(() => {
        expect(result.current.isError).toBe(true);
        expect(result.current.error?.message).toBe('Async error');
      });
    });

    it('should not interfere with successful async functions', async () => {
      const { result } = renderHook(() => useErrorHandler());
      
      const successfulAsyncFn = jest.fn().mockResolvedValue('success');
      const wrappedFn = result.current.withErrorHandling(successfulAsyncFn);

      const response = await wrappedFn();
      
      expect(response).toBe('success');
      expect(result.current.isError).toBe(false);
    });
  });

  describe('safeAsync', () => {
    it('should return null on error and set error state', async () => {
      const { result } = renderHook(() => useErrorHandler());
      
      const failingAsyncFn = () => Promise.reject(new Error('Async error'));
      const response = await result.current.safeAsync(failingAsyncFn);

      expect(response).toBe(null);
      
      await waitFor(() => {
        expect(result.current.isError).toBe(true);
        expect(result.current.error?.message).toBe('Async error');
      });
    });

    it('should return result on success', async () => {
      const { result } = renderHook(() => useErrorHandler());
      
      const successfulAsyncFn = () => Promise.resolve('success');
      const response = await result.current.safeAsync(successfulAsyncFn);

      expect(response).toBe('success');
      expect(result.current.isError).toBe(false);
    });
  });

  describe('Development Logging', () => {
    it('should handle error logging', () => {
      const { result } = renderHook(() => useErrorHandler());

      act(() => {
        result.current.handleError('Test error');
      });

      // Verify error was handled
      expect(result.current.isError).toBe(true);
      expect(result.current.error?.message).toBe('Test error');
    });

    it('should report errors to monitoring service', () => {
      const { result } = renderHook(() => useErrorHandler());

      act(() => {
        result.current.handleError('Test error');
      });

      expect(console.log).toHaveBeenCalledWith(
        'Async Error Report (would be sent to monitoring service):',
        expect.any(Object)
      );
    });
  });

  describe('Error Reporting', () => {
    it('should create proper error report structure', () => {
      const { result } = renderHook(() => useErrorHandler());

      act(() => {
        result.current.handleError('Test error');
      });

      expect(console.log).toHaveBeenCalledWith(
        'Async Error Report (would be sent to monitoring service):',
        expect.objectContaining({
          type: 'async_error',
          message: 'Test error',
          timestamp: expect.any(String),
          userAgent: expect.any(String),
          url: expect.any(String),
          errorId: expect.any(String),
        })
      );
    });
  });
});
