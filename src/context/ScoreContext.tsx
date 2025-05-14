"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface ScoreContextType {
  player1Score: number;
  setPlayer1Score: React.Dispatch<React.SetStateAction<number>>;
  player2Score: number;
  setPlayer2Score: React.Dispatch<React.SetStateAction<number>>;
}

const ScoreContext = createContext<ScoreContextType | undefined>(undefined);

export const ScoreProvider = ({ children }: { children: ReactNode }) => {
  const [player1Score, setPlayer1Score] = useState<number>(0);
  const [player2Score, setPlayer2Score] = useState<number>(0);

  const value = {
    player1Score,
    setPlayer1Score,
    player2Score,
    setPlayer2Score,
  };

  return (
    <ScoreContext.Provider value={value}>{children}</ScoreContext.Provider>
  );
};

export const useScoreContext = () => {
  const context = useContext(ScoreContext);
  if (!context) {
    throw new Error("useScoreContext must be used within a ScoreProvider");
  }
  return context;
};
