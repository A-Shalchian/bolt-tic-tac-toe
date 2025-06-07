"use client";

import { useEffect } from "react";
import { useGameStore } from "@/store";

/**
 * Component that manages the document title based on game state
 * Changes the title when user switches tabs
 */
export const PageTitleManager: React.FC = () => {
  // Get game state from the store
  const phase = useGameStore(state => state.phase);
  const gameMode = useGameStore(state => state.gameMode);
  
  useEffect(() => {
    // Set the default title based on current game state
    let defaultTitle = "Bolt Tic-Tac-Toe";
    
    if (phase === "game") {
      defaultTitle = `${gameMode === "single" ? "Single Player" : "Multiplayer"} Game - Bolt Tic-Tac-Toe`;
    } else if (phase === "mainMenu") {
      defaultTitle = "Bolt Tic-Tac-Toe";
    } else {
      defaultTitle = `Game Setup - Bolt Tic-Tac-Toe`;
    }
    
    // Set the document title
    document.title = defaultTitle;
    
    // Set up the visibility change event
    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.title = "Come back to play! 🎮";
      } else {
        document.title = defaultTitle;
      }
    };
    
    // Add event listener
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    // Cleanup
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [phase, gameMode]);
  
  // This component doesn't render anything
  return null;
};
