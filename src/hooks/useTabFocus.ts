"use client";

import { useEffect } from 'react';

interface TabTitleOptions {
  defaultTitle: string;
  awayTitle?: string;
}

/**
 * Hook that changes the page title when the user switches tabs
 * @param options - Configuration options
 * @param options.defaultTitle - The title to display when the page is focused
 * @param options.awayTitle - The title to display when the page is not focused
 */
export const useTabFocus = ({ defaultTitle, awayTitle = "Come back to play! 🎮" }: TabTitleOptions) => {
  useEffect(() => {
    // Set initial title
    document.title = defaultTitle;
    
    // Function to handle visibility change
    const handleVisibilityChange = () => {
      if (document !== undefined) {
        document.title = document.hidden ? awayTitle : defaultTitle;
      }
    };

    // Add event listener
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [defaultTitle, awayTitle]);
};
