"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

type GameMode = "multi" | "single" | null;
type Difficulty = "easy" | "medium" | "hard" | null;
type Phase =
  | "mainMenu"
  | "timeOptionSelection"
  | "timeSettings"
  | "difficultySelection"
  | "characterSelection"
  | "countdown"
  | "game";

interface GameContextType {
  phase: Phase;
  setPhase: React.Dispatch<React.SetStateAction<Phase>>;
  gameMode: GameMode;
  setGameMode: React.Dispatch<React.SetStateAction<GameMode>>;
  multiplayerTimer: number;
  setMultiplayerTimer: React.Dispatch<React.SetStateAction<number>>;
  difficulty: Difficulty;
  setDifficulty: React.Dispatch<React.SetStateAction<Difficulty>>;
  player1Char: string | null;
  setPlayer1Char: React.Dispatch<React.SetStateAction<string | null>>;
  player2Char: string | null;
  setPlayer2Char: React.Dispatch<React.SetStateAction<string | null>>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [phase, setPhase] = useState<Phase>("mainMenu");
  const [gameMode, setGameMode] = useState<GameMode>(null);
  const [multiplayerTimer, setMultiplayerTimer] = useState<number>(0);
  const [difficulty, setDifficulty] = useState<Difficulty>(null);
  const [player1Char, setPlayer1Char] = useState<string | null>(null);
  const [player2Char, setPlayer2Char] = useState<string | null>(null);

  const value = {
    phase,
    setPhase,
    gameMode,
    setGameMode,
    multiplayerTimer,
    setMultiplayerTimer,
    difficulty,
    setDifficulty,
    player1Char,
    setPlayer1Char,
    player2Char,
    setPlayer2Char,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};
