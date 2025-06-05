"use client";

import React, { ReactNode } from 'react';
import { useGameStore } from './index';

// This file provides compatibility hooks that match the original context API
// to make migration easier

// Game Phase compatibility hook
export const useGamePhase = () => {
  const { phase, setPhase, gameMode, setGameMode } = useGameStore();
  return { phase, setPhase, gameMode, setGameMode };
};

// Player compatibility hook
export const usePlayerContext = () => {
  const { currentPlayer, player1, player2, setCurrentPlayer, setPlayer1, setPlayer2 } = useGameStore();
  return { currentPlayer, player1, player2, setCurrentPlayer, setPlayer1, setPlayer2 };
};

// Game Settings compatibility hook
export const useGameSettings = () => {
  const { 
    difficulty, timeLimit, boardSize, winCondition,
    setDifficulty, setTimeLimit, setBoardSize, setWinCondition 
  } = useGameStore();
  
  return { 
    difficulty, timeLimit, boardSize, winCondition,
    setDifficulty, setTimeLimit, setBoardSize, setWinCondition 
  };
};

// Score compatibility hook
export const useScoreContext = () => {
  const { 
    player1Score, player2Score, incrementPlayer1Score, incrementPlayer2Score, resetScores 
  } = useGameStore();
  
  return { 
    player1Score, player2Score, incrementPlayer1Score, incrementPlayer2Score, resetScores 
  };
};

// Combined hook (similar to the original useGameContext)
export const useGameContext = () => {
  return useGameStore();
};

// Empty providers for compatibility
export const GamePhaseProvider = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export const GameSettingsProvider = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export const ScoreProvider = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export const GameProvider = AppProviders;
