"use client";

import { useCallback, useEffect, useRef } from 'react';

export interface TouchGestureOptions {
  onTap?: (event: TouchEvent) => void;
  onLongPress?: (event: TouchEvent) => void;
  onSwipe?: (direction: 'up' | 'down' | 'left' | 'right', event: TouchEvent) => void;
  enableHaptic?: boolean;
  longPressDelay?: number;
  swipeThreshold?: number;
}

export interface TouchPosition {
  x: number;
  y: number;
  timestamp: number;
}

/**
 * Custom hook for mobile touch interactions with haptic feedback
 * Optimized for game board interactions and mobile UX
 */
export const useMobileTouch = (options: TouchGestureOptions = {}) => {
  const {
    onTap,
    onLongPress,
    onSwipe,
    enableHaptic = true,
    longPressDelay = 500,
    swipeThreshold = 50
  } = options;

  const touchStartRef = useRef<TouchPosition | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressRef = useRef(false);

  // Haptic feedback function
  const triggerHaptic = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!enableHaptic) return;
    
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [50]
    };
    
    // Check if the device supports haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(patterns[type]);
    }
    
    // For iOS devices with haptic feedback API
    if ('hapticFeedback' in window && typeof (window as unknown as { hapticFeedback?: unknown }).hapticFeedback === 'object') {
      const hapticTypes = {
        light: 'impactLight',
        medium: 'impactMedium', 
        heavy: 'impactHeavy'
      };
      try {
        const hapticAPI = (window as unknown as { hapticFeedback: Record<string, () => void> }).hapticFeedback;
        hapticAPI[hapticTypes[type]]();
      } catch (error) {
        // Fallback to vibration
        if ('vibrate' in navigator) {
          navigator.vibrate(patterns[type]);
        }
      }
    }
  }, [enableHaptic]);

  const handleTouchStart = useCallback((event: TouchEvent) => {
    const touch = event.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now()
    };

    isLongPressRef.current = false;

    if (onLongPress) {
      longPressTimerRef.current = setTimeout(() => {
        isLongPressRef.current = true;
        triggerHaptic('medium');
        onLongPress(event);
      }, longPressDelay);
    }
  }, [onLongPress, longPressDelay, triggerHaptic]);

  const handleTouchEnd = useCallback((event: TouchEvent) => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    if (!touchStartRef.current) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // If it was a long press, don't trigger other actions
    if (isLongPressRef.current) {
      touchStartRef.current = null;
      return;
    }

    if (distance > swipeThreshold && onSwipe) {
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);
      
      let direction: 'up' | 'down' | 'left' | 'right';
      
      if (absX > absY) {
        direction = deltaX > 0 ? 'right' : 'left';
      } else {
        direction = deltaY > 0 ? 'down' : 'up';
      }
      
      triggerHaptic('light');
      onSwipe(direction, event);
    } else if (distance <= swipeThreshold && onTap) {
      triggerHaptic('light');
      onTap(event);
    }

    touchStartRef.current = null;
  }, [onTap, onSwipe, swipeThreshold, triggerHaptic]);

  const handleTouchCancel = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    touchStartRef.current = null;
    isLongPressRef.current = false;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

  return {
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd,
      onTouchCancel: handleTouchCancel,
    },
    triggerHaptic,
    // Utility function to check if device is mobile
    isMobile: () => {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
    supportsTouch: () => {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
  };
};

/**
 * Hook specifically for game board cell interactions
 * Provides optimized touch handling for tic-tac-toe cells
 */
export const useBoardCellTouch = (
  onCellTap: (cellIndex: number) => void,
  cellIndex: number,
  disabled: boolean = false
) => {
  const { touchHandlers, triggerHaptic, isMobile, supportsTouch } = useMobileTouch({
    onTap: useCallback(() => {
      if (!disabled) {
        onCellTap(cellIndex);
      }
    }, [onCellTap, cellIndex, disabled]),
    enableHaptic: true
  });

  const cellTouchHandlers = {
    ...touchHandlers,
    onTouchStart: (event: TouchEvent) => {
      if (!disabled) {
        const target = event.currentTarget as HTMLElement;
        target.style.transform = 'scale(0.95)';
        target.style.transition = 'transform 0.1s ease';
      }
      touchHandlers.onTouchStart(event);
    },
    onTouchEnd: (event: TouchEvent) => {
      const target = event.currentTarget as HTMLElement;
      target.style.transform = '';
      touchHandlers.onTouchEnd(event);
    },
    onTouchCancel: (event: TouchEvent) => {
      const target = event.currentTarget as HTMLElement;
      target.style.transform = '';
      touchHandlers.onTouchCancel();
    }
  };

  return {
    cellTouchHandlers,
    triggerHaptic,
    isMobile: isMobile(),
    supportsTouch: supportsTouch()
  };
};
