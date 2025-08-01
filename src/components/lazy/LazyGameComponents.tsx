"use client";
import React, { Suspense, lazy } from 'react';
import { useRenderPerformance } from '@/hooks/usePerformance';

const SinglePlayerGameLazy = lazy(() => 
  import('../SinglePlayerGame/SinglePlayerGame').then(module => ({
    default: module.SinglePlayerGame
  }))
);

const MultiPlayerGameLazy = lazy(() => 
  import('../MultiPlayerGame/MultiPlayerGame').then(module => ({
    default: module.MultiPlayerGame
  }))
);

const GameLoadingFallback: React.FC<{ gameType: string }> = ({ gameType }) => {
  useRenderPerformance('GameLoadingFallback');
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-lg text-gray-600 font-medium">
        Loading {gameType} Game...
      </p>
      <p className="text-sm text-gray-500 mt-2">
        Optimizing for your device
      </p>
    </div>
  );
};

export const LazySinglePlayerGame: React.FC = () => (
  <Suspense fallback={<GameLoadingFallback gameType="Single Player" />}>
    <SinglePlayerGameLazy />
  </Suspense>
);

export const LazyMultiPlayerGame: React.FC = () => (
  <Suspense fallback={<GameLoadingFallback gameType="Multiplayer" />}>
    <MultiPlayerGameLazy />
  </Suspense>
);

export class LazyLoadErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ComponentType }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Lazy loading error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const Fallback = this.props.fallback;
      if (Fallback) {
        return <Fallback />;
      }
      
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Loading Error
          </h2>
          <p className="text-gray-600 mb-4 text-center max-w-md">
            Failed to load the game component. Please refresh the page or try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export const SafeLazySinglePlayerGame: React.FC = () => (
  <LazyLoadErrorBoundary>
    <LazySinglePlayerGame />
  </LazyLoadErrorBoundary>
);

export const SafeLazyMultiPlayerGame: React.FC = () => (
  <LazyLoadErrorBoundary>
    <LazyMultiPlayerGame />
  </LazyLoadErrorBoundary>
);
