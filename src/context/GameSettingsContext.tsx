"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface GameSettingsContextType {
  timed: boolean;
  setTimed: React.Dispatch<React.SetStateAction<boolean>>;
  multiplayerTimer: number;
  setMultiplayerTimer: React.Dispatch<React.SetStateAction<number>>;
}

const GameSettingsContext = createContext<GameSettingsContextType | undefined>(
  undefined
);

export const GameSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [timed, setTimed] = useState<boolean>(false);
  const [multiplayerTimer, setMultiplayerTimer] = useState<number>(0);

  const value = {
    timed,
    setTimed,
    multiplayerTimer,
    setMultiplayerTimer,
  };

  return (
    <GameSettingsContext.Provider value={value}>
      {children}
    </GameSettingsContext.Provider>
  );
};

export const useGameSettings = () => {
  const context = useContext(GameSettingsContext);
  if (!context) {
    throw new Error(
      "useGameSettings must be used within a GameSettingsProvider"
    );
  }
  return context;
};
