/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '../../../__tests__/utils/test-utils';
import { ErrorBoundary } from '../ErrorBoundary';

// Component that throws an error for testing
const ThrowError: React.FC<{ shouldThrow?: boolean }> = ({ shouldThrow = true }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div data-testid="no-error">No error occurred</div>;
};

// Mock console methods to avoid noise in tests
const originalError = console.error;
const originalGroup = console.group;
const originalGroupEnd = console.groupEnd;
const originalLog = console.log;

beforeAll(() => {
  console.error = jest.fn();
  console.group = jest.fn();
  console.groupEnd = jest.fn();
  console.log = jest.fn();
});

afterAll(() => {
  console.error = originalError;
  console.group = originalGroup;
  console.groupEnd = originalGroupEnd;
  console.log = originalLog;
});

describe('ErrorBoundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Normal Operation', () => {
    it('should render children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('no-error')).toBeInTheDocument();
    });

    it('should not show error UI when children render successfully', () => {
      render(
        <ErrorBoundary>
          <div data-testid="success">Success!</div>
        </ErrorBoundary>
      );

      expect(screen.getByTestId('success')).toBeInTheDocument();
      expect(screen.queryByText('Oops! Something went wrong')).not.toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should catch errors and display error UI', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
      expect(screen.getByText(/We encountered an unexpected error/)).toBeInTheDocument();
      expect(screen.queryByTestId('no-error')).not.toBeInTheDocument();
    });

    it('should display action buttons in error state', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText('Try Again')).toBeInTheDocument();
      expect(screen.getByText('Go to Main Menu')).toBeInTheDocument();
      expect(screen.getByText('Auto-retry in 3 seconds')).toBeInTheDocument();
    });

    it('should call onError callback when error occurs', () => {
      const onError = jest.fn();
      
      render(
        <ErrorBoundary onError={onError}>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(onError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          componentStack: expect.any(String)
        })
      );
    });

    it('should generate unique error IDs', () => {
      const { unmount } = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const firstErrorId = screen.getByText(/Error ID:/).textContent;
      unmount();

      // Render a new ErrorBoundary instance
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const secondErrorId = screen.getByText(/Error ID:/).textContent;
      expect(firstErrorId).not.toBe(secondErrorId);
    });
  });

  describe('Custom Fallback', () => {
    it('should render custom fallback when provided', () => {
      const customFallback = <div data-testid="custom-fallback">Custom Error UI</div>;

      render(
        <ErrorBoundary fallback={customFallback}>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
      expect(screen.queryByText('Oops! Something went wrong')).not.toBeInTheDocument();
    });
  });

  describe('Recovery Actions', () => {
    it('should have Try Again button that is clickable', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const tryAgainButton = screen.getByText('Try Again');
      expect(tryAgainButton).toBeInTheDocument();
      
      // Test that the button is clickable (doesn't throw)
      expect(() => fireEvent.click(tryAgainButton)).not.toThrow();
    });

    it('should have Go to Main Menu button that is clickable', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const goHomeButton = screen.getByText('Go to Main Menu');
      expect(goHomeButton).toBeInTheDocument();
      
      // Test that the button is clickable (doesn't throw)
      expect(() => fireEvent.click(goHomeButton)).not.toThrow();
    });
  });

  describe('Development Mode', () => {
    it('should render error UI when error occurs', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      // Basic error UI should always be present
      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
      expect(screen.getByText('Try Again')).toBeInTheDocument();
      expect(screen.getByText('Go to Main Menu')).toBeInTheDocument();
    });
  });

  describe('Error Logging', () => {
    it('should handle error reporting', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      // Check that error reporting console.log was called
      expect(console.log).toHaveBeenCalledWith(
        'Error Report (would be sent to monitoring service):',
        expect.any(Object)
      );
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA structure', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      // Check for proper heading structure
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      
      // Check for button accessibility
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
      
      buttons.forEach(button => {
        expect(button).toBeInTheDocument();
      });
    });
  });
});
