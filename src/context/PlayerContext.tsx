"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

type Difficulty = "easy" | "medium" | "hard" | null;

interface PlayerContextType {
  difficulty: Difficulty;
  setDifficulty: React.Dispatch<React.SetStateAction<Difficulty>>;
  player1Char: string | null;
  setPlayer1Char: React.Dispatch<React.SetStateAction<string | null>>;
  player2Char: string | null;
  setPlayer2Char: React.Dispatch<React.SetStateAction<string | null>>;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [difficulty, setDifficulty] = useState<Difficulty>(null);
  const [player1Char, setPlayer1Char] = useState<string | null>(null);
  const [player2Char, setPlayer2Char] = useState<string | null>(null);

  const value = {
    difficulty,
    setDifficulty,
    player1Char,
    setPlayer1Char,
    player2Char,
    setPlayer2Char,
  };

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
};

export const usePlayerContext = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayerContext must be used within a PlayerProvider");
  }
  return context;
};
