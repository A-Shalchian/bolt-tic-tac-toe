"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

type GameMode = "multi" | "single" | "online" | null;
type Difficulty = "easy" | "medium" | "hard" | null;
type Phase =
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

interface GameContextType {
  phase: Phase;
  setPhase: React.Dispatch<React.SetStateAction<Phase>>;
  gameMode: GameMode;
  setGameMode: React.Dispatch<React.SetStateAction<GameMode>>;
  timed: boolean;
  setTimed: React.Dispatch<React.SetStateAction<boolean>>;
  multiplayerTimer: number;
  setMultiplayerTimer: React.Dispatch<React.SetStateAction<number>>;
  difficulty: Difficulty;
  setDifficulty: React.Dispatch<React.SetStateAction<Difficulty>>;
  player1Char: string | null;
  setPlayer1Char: React.Dispatch<React.SetStateAction<string | null>>;
  player2Char: string | null;
  setPlayer2Char: React.Dispatch<React.SetStateAction<string | null>>;
  player1Score: number;
  setPlayer1Score: React.Dispatch<React.SetStateAction<number>>;
  player2Score: number;
  setPlayer2Score: React.Dispatch<React.SetStateAction<number>>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [phase, setPhase] = useState<Phase>("mainMenu");
  const [gameMode, setGameMode] = useState<GameMode>(null);
  const [timed, setTimed] = useState<boolean>(false);
  const [multiplayerTimer, setMultiplayerTimer] = useState<number>(0);
  const [difficulty, setDifficulty] = useState<Difficulty>(null);
  const [player1Char, setPlayer1Char] = useState<string | null>(null);
  const [player2Char, setPlayer2Char] = useState<string | null>(null);
  const [player1Score, setPlayer1Score] = useState<number>(0);
  const [player2Score, setPlayer2Score] = useState<number>(0);
  const value = {
    phase,
    setPhase,
    gameMode,
    setGameMode,
    timed,
    setTimed,
    multiplayerTimer,
    setMultiplayerTimer,
    difficulty,
    setDifficulty,
    player1Char,
    setPlayer1Char,
    player2Char,
    setPlayer2Char,
    player1Score,
    setPlayer1Score,
    player2Score,
    setPlayer2Score,
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
