"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

type GameMode = "multi" | "single" | "online" | "tutorial" | null;
export type Phase =
  | "mainMenu"
  // Single player phases
  | "difficultySelection"
  | "characterSelection" // for single player
  // Multiplayer phases
  | "timeOptionSelection"
  | "timeSettings"
  | "characterSelectionMulti" // optional if you want to differentiate
  | "countdown"
  | "game";

interface GamePhaseContextType {
  phase: Phase;
  setPhase: React.Dispatch<React.SetStateAction<Phase>>;
  gameMode: GameMode;
  setGameMode: React.Dispatch<React.SetStateAction<GameMode>>;
}

const GamePhaseContext = createContext<GamePhaseContextType | undefined>(
  undefined
);

export const GamePhaseProvider = ({ children }: { children: ReactNode }) => {
  const [phase, setPhase] = useState<Phase>("mainMenu");
  const [gameMode, setGameMode] = useState<GameMode>(null);

  const value = {
    phase,
    setPhase,
    gameMode,
    setGameMode,
  };

  return (
    <GamePhaseContext.Provider value={value}>
      {children}
    </GamePhaseContext.Provider>
  );
};

export const useGamePhase = () => {
  const context = useContext(GamePhaseContext);
  if (!context) {
    throw new Error("useGamePhase must be used within a GamePhaseProvider");
  }
  return context;
};
