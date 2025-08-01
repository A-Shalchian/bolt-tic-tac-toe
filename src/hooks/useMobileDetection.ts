"use client";

import { useState, useEffect, useCallback } from 'react';

export interface MobileCapabilities {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouchDevice: boolean;
  supportsHaptics: boolean;
  supportsVibration: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isStandalone: boolean; // PWA mode
  screenSize: 'small' | 'medium' | 'large';
  orientation: 'portrait' | 'landscape';
  pixelRatio: number;
}

export interface ViewportInfo {
  width: number;
  height: number;
  availableHeight: number; // Excluding browser UI
}

/**
 * Hook for detecting mobile device capabilities and optimizing the experience
 */
export const useMobileDetection = () => {
  const [capabilities, setCapabilities] = useState<MobileCapabilities>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isTouchDevice: false,
    supportsHaptics: false,
    supportsVibration: false,
    isIOS: false,
    isAndroid: false,
    isStandalone: false,
    screenSize: 'large',
    orientation: 'landscape',
    pixelRatio: 1,
  });

  const [viewport, setViewport] = useState<ViewportInfo>({
    width: 0,
    height: 0,
    availableHeight: 0,
  });

  // Detect device capabilities
  const detectCapabilities = useCallback((): MobileCapabilities => {
    if (typeof window === 'undefined') {
      return capabilities; // Return default for SSR
    }

    const userAgent = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isAndroid = /Android/.test(userAgent);
    const isMobile = /Mobi|Android/i.test(userAgent) || isIOS;
    const isTablet = /iPad/.test(userAgent) || (isAndroid && !/Mobi/.test(userAgent));
    const isDesktop = !isMobile && !isTablet;
    
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const supportsVibration = 'vibrate' in navigator;
    const supportsHaptics = isIOS && 'DeviceMotionEvent' in window;
    
    // Check if running as standalone PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as { standalone?: boolean }).standalone === true;

    // Determine screen size
    const width = window.innerWidth;
    let screenSize: 'small' | 'medium' | 'large' = 'large';
    if (width < 640) screenSize = 'small';
    else if (width < 1024) screenSize = 'medium';

    // Determine orientation
    const orientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';

    // Get pixel ratio
    const pixelRatio = window.devicePixelRatio || 1;

    return {
      isMobile,
      isTablet,
      isDesktop,
      isTouchDevice,
      supportsHaptics,
      supportsVibration,
      isIOS,
      isAndroid,
      isStandalone,
      screenSize,
      orientation,
      pixelRatio,
    };
  }, [capabilities]);

  // Update viewport information
  const updateViewport = useCallback(() => {
    if (typeof window === 'undefined') return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    // Available height excludes browser UI (address bar, etc.)
    const availableHeight = window.screen.availHeight || height;

    setViewport({ width, height, availableHeight });
  }, []);

  // Initialize and set up listeners
  useEffect(() => {
    const newCapabilities = detectCapabilities();
    setCapabilities(newCapabilities);
    updateViewport();

    // Listen for orientation and resize changes
    const handleResize = () => {
      const newCapabilities = detectCapabilities();
      setCapabilities(newCapabilities);
      updateViewport();
    };

    const handleOrientationChange = () => {
      // Small delay to ensure dimensions are updated
      setTimeout(() => {
        const newCapabilities = detectCapabilities();
        setCapabilities(newCapabilities);
        updateViewport();
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [detectCapabilities, updateViewport]);

  // Utility functions
  const triggerHapticFeedback = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (capabilities.supportsVibration) {
      const patterns = {
        light: 50,
        medium: 100,
        heavy: 200,
      };
      navigator.vibrate(patterns[type]);
    }
  }, [capabilities.supportsVibration]);

  const isSmallScreen = useCallback(() => {
    return capabilities.screenSize === 'small';
  }, [capabilities.screenSize]);

  const isMediumScreen = useCallback(() => {
    return capabilities.screenSize === 'medium';
  }, [capabilities.screenSize]);

  const isLargeScreen = useCallback(() => {
    return capabilities.screenSize === 'large';
  }, [capabilities.screenSize]);

  const isPortrait = useCallback(() => {
    return capabilities.orientation === 'portrait';
  }, [capabilities.orientation]);

  const isLandscape = useCallback(() => {
    return capabilities.orientation === 'landscape';
  }, [capabilities.orientation]);

  // Get optimal board size based on device
  const getOptimalBoardSize = useCallback(() => {
    const { width, height } = viewport;
    const { isMobile, orientation } = capabilities;

    if (!isMobile) {
      return { cellSize: 120, gap: 8 }; // Desktop
    }

    // Mobile optimizations
    const availableSpace = Math.min(width * 0.9, height * 0.6);
    const cellSize = Math.floor((availableSpace - 16) / 3); // 3x3 grid with gaps
    const gap = Math.max(2, Math.floor(cellSize * 0.05));

    return {
      cellSize: Math.max(60, Math.min(cellSize, 100)), // Min 60px, max 100px
      gap: Math.max(2, Math.min(gap, 8)), // Min 2px, max 8px
    };
  }, [viewport, capabilities]);

  // Check if device needs special touch handling
  const needsEnhancedTouch = useCallback(() => {
    return capabilities.isTouchDevice && (capabilities.isMobile || capabilities.isTablet);
  }, [capabilities]);

  return {
    capabilities,
    viewport,
    triggerHapticFeedback,
    isSmallScreen,
    isMediumScreen,
    isLargeScreen,
    isPortrait,
    isLandscape,
    getOptimalBoardSize,
    needsEnhancedTouch,
  };
};
