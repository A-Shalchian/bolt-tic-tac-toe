"use client";

import { create } from 'zustand';

// Types from the existing contexts
type GameMode = "multi" | "single" | "online" | "tutorial" | null;
export type Phase =
  | "mainMenu"
  | "difficultySelection"
  | "characterSelection" 
  | "timeOptionSelection"
  | "timeSettings"
  | "characterSelectionMulti"
  | "countdown"
  | "game";

// Game Phase State
interface GamePhaseState {
  phase: Phase;
  gameMode: GameMode;
  setPhase: (phase: Phase) => void;
  setGameMode: (gameMode: GameMode) => void;
}

// Player State (based on your PlayerContext)
interface PlayerState {
  currentPlayer: string;
  player1: { name: string; symbol: string };
  player2: { name: string; symbol: string };
  setCurrentPlayer: (player: string) => void;
  setPlayer1: (player: { name: string; symbol: string }) => void;
  setPlayer2: (player: { name: string; symbol: string }) => void;
}

// Game Settings State
type Difficulty = "easy" | "medium" | "hard";
interface GameSettingsState {
  difficulty: Difficulty;
  timeLimit: number;
  isTimed: boolean;
  boardSize: number;
  winCondition: number;
  setDifficulty: (difficulty: Difficulty) => void;
  setTimeLimit: (timeLimit: number) => void;
  setIsTimed: (isTimed: boolean) => void;
  setBoardSize: (size: number) => void;
  setWinCondition: (count: number) => void;
}

// Score State
interface ScoreState {
  player1Score: number;
  player2Score: number;
  incrementPlayer1Score: () => void;
  incrementPlayer2Score: () => void;
  resetScores: () => void;
}

// Combined State
interface GameState extends GamePhaseState, PlayerState, GameSettingsState, ScoreState {}

// Create the combined store
export const useGameStore = create<GameState>((set) => ({
  // Game Phase State
  phase: "mainMenu",
  gameMode: null,
  setPhase: (phase) => set({ phase }),
  setGameMode: (gameMode) => set({ gameMode }),
  
  // Player State
  currentPlayer: "X",
  player1: { name: "Player 1", symbol: "X" },
  player2: { name: "Player 2", symbol: "O" },
  setCurrentPlayer: (player) => set({ currentPlayer: player }),
  setPlayer1: (player) => set({ player1: player }),
  setPlayer2: (player) => set({ player2: player }),
  
  // Game Settings State
  difficulty: "medium",
  timeLimit: 30,
  isTimed: false,
  boardSize: 3,
  winCondition: 3,
  setDifficulty: (difficulty) => set({ difficulty }),
  setTimeLimit: (timeLimit) => set({ timeLimit }),
  setIsTimed: (isTimed) => set({ isTimed }),
  setBoardSize: (size) => set({ boardSize: size }),
  setWinCondition: (count) => set({ winCondition: count }),
  
  // Score State
  player1Score: 0,
  player2Score: 0,
  incrementPlayer1Score: () => set((state) => ({ player1Score: state.player1Score + 1 })),
  incrementPlayer2Score: () => set((state) => ({ player2Score: state.player2Score + 1 })),
  resetScores: () => set({ player1Score: 0, player2Score: 0 }),
}));
