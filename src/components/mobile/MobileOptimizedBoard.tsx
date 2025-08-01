"use client";

import React, { useCallback, useEffect, useMemo } from 'react';
import { useMobileDetection } from '@/hooks/useMobileDetection';
import { useRenderPerformance } from '@/hooks/usePerformance';

export interface MobileOptimizedBoardProps {
  board: (string | null)[];
  onCellClick: (index: number) => void;
  disabled?: boolean;
  highlightedCells?: number[];
  player1Char: string;
  player2Char: string;
  currentPlayer?: string;
  className?: string;
}

/**
 * Mobile-optimized game board with adaptive sizing and enhanced touch interactions
 */
export const MobileOptimizedBoard: React.FC<MobileOptimizedBoardProps> = ({
  board,
  onCellClick,
  disabled = false,
  highlightedCells = [],
  player1Char,
  player2Char,
  currentPlayer,
  className = '',
}) => {
  useRenderPerformance('MobileOptimizedBoard');

  const {
    capabilities,
    viewport,
    triggerHapticFeedback,
    getOptimalBoardSize,
    needsEnhancedTouch,
  } = useMobileDetection();

  // Calculate optimal board dimensions
  const boardDimensions = useMemo(() => {
    return getOptimalBoardSize();
  }, [getOptimalBoardSize]);

  // Enhanced cell click handler with haptic feedback
  const handleCellClick = useCallback((index: number) => {
    if (disabled || board[index] !== null) return;

    // Trigger haptic feedback on mobile
    if (capabilities.isTouchDevice) {
      triggerHapticFeedback('light');
    }

    onCellClick(index);
  }, [disabled, board, onCellClick, capabilities.isTouchDevice, triggerHapticFeedback]);

  // Handle touch interactions
  const handleTouchStart = useCallback((event: React.TouchEvent, index: number) => {
    if (disabled || board[index] !== null) return;

    const target = event.currentTarget as HTMLElement;
    target.style.transform = 'scale(0.95)';
    target.style.transition = 'transform 0.1s ease';

    // Add haptic feedback class for visual indication
    target.classList.add('haptic-feedback', 'active');
  }, [disabled, board]);

  const handleTouchEnd = useCallback((event: React.TouchEvent) => {
    const target = event.currentTarget as HTMLElement;
    target.style.transform = '';
    target.classList.remove('active');
    
    // Remove haptic feedback class after animation
    setTimeout(() => {
      target.classList.remove('haptic-feedback');
    }, 200);
  }, []);

  const handleTouchCancel = useCallback((event: React.TouchEvent) => {
    const target = event.currentTarget as HTMLElement;
    target.style.transform = '';
    target.classList.remove('active', 'haptic-feedback');
  }, []);

  // Render individual cell
  const renderCell = useCallback((index: number) => {
    const cellValue = board[index];
    const isHighlighted = highlightedCells.includes(index);
    const isDisabled = disabled || cellValue !== null;
    
    // Determine cell content and color
    let content = '';
    let textColor = 'text-gray-400';
    
    if (cellValue === 'HUMAN' || cellValue === 'P1') {
      content = player1Char;
      textColor = 'text-blue-600';
    } else if (cellValue === 'BOT' || cellValue === 'P2') {
      content = player2Char;
      textColor = 'text-red-600';
    }

    const cellStyle = {
      width: `${boardDimensions.cellSize}px`,
      height: `${boardDimensions.cellSize}px`,
      fontSize: `${Math.floor(boardDimensions.cellSize * 0.4)}px`,
    };

    return (
      <div
        key={index}
        data-cell-index={index}
        onClick={() => handleCellClick(index)}
        onTouchStart={(e) => handleTouchStart(e, index)}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
        className={`
          game-cell
          border-4 border-gray-400 
          flex items-center justify-center 
          font-bold
          select-none
          transition-all duration-150 ease-in-out
          ${isDisabled ? 'cursor-not-allowed opacity-60 disabled' : 'cursor-pointer hover:bg-gray-100 active:bg-gray-200'}
          ${isHighlighted ? 'flash-highlight' : ''}
          ${textColor}
          ${needsEnhancedTouch() ? 'touch-target' : ''}
        `}
        style={{
          ...cellStyle,
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTouchCallout: 'none',
          WebkitTapHighlightColor: 'transparent',
        }}
        role="button"
        tabIndex={isDisabled ? -1 : 0}
        aria-label={`Cell ${index + 1}, ${cellValue ? `occupied by ${cellValue}` : 'empty'}`}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !isDisabled) {
            e.preventDefault();
            handleCellClick(index);
          }
        }}
      >
        {content}
      </div>
    );
  }, [
    board,
    highlightedCells,
    disabled,
    player1Char,
    player2Char,
    boardDimensions,
    handleCellClick,
    handleTouchStart,
    handleTouchEnd,
    handleTouchCancel,
    needsEnhancedTouch,
  ]);

  // Add viewport meta tag for mobile optimization
  useEffect(() => {
    if (capabilities.isMobile && typeof document !== 'undefined') {
      let viewportMeta = document.querySelector('meta[name="viewport"]');
      if (!viewportMeta) {
        viewportMeta = document.createElement('meta');
        viewportMeta.setAttribute('name', 'viewport');
        document.head.appendChild(viewportMeta);
      }
      viewportMeta.setAttribute(
        'content',
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
      );
    }
  }, [capabilities.isMobile]);

  const gridStyle = {
    gap: `${boardDimensions.gap}px`,
    maxWidth: `${(boardDimensions.cellSize * 3) + (boardDimensions.gap * 2)}px`,
  };

  return (
    <div className={`game-board mx-auto ${className}`}>
      {/* Mobile-specific status indicator */}
      {capabilities.isMobile && currentPlayer && (
        <div className="mb-4 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
            <div className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></div>
            {currentPlayer}&apos;s Turn
          </div>
        </div>
      )}

      {/* Game Board Grid */}
      <div 
        className="grid grid-cols-3 mx-auto"
        style={gridStyle}
        role="grid"
        aria-label="Tic-tac-toe game board"
      >
        {Array.from({ length: 9 }).map((_, index) => renderCell(index))}
      </div>

      {/* Mobile-specific game info */}
      {capabilities.isMobile && (
        <div className="mt-4 text-center text-sm text-gray-600">
          <div className="flex justify-center items-center gap-4">
            <div className="flex items-center">
              <span className="w-3 h-3 bg-blue-600 rounded mr-1"></span>
              <span>{player1Char}</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-red-600 rounded mr-1"></span>
              <span>{player2Char}</span>
            </div>
          </div>
          {capabilities.supportsVibration && (
            <div className="mt-2 text-xs text-gray-500">
              Haptic feedback enabled
            </div>
          )}
        </div>
      )}
    </div>
  );
};
