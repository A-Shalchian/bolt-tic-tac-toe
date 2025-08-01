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

// Player State (based on PlayerContext)
interface PlayerState {
  currentPlayer: string;
  player1: { name: string; symbol: string };
  player2: { name: string; symbol: string };
  player1Char: string | null;
  player2Char: string | null;
  setCurrentPlayer: (player: string) => void;
  setPlayer1: (player: { name: string; symbol: string }) => void;
  setPlayer2: (player: { name: string; symbol: string }) => void;
  setPlayer1Char: (char: string | null) => void;
  setPlayer2Char: (char: string | null) => void;
}

// Game Settings State
type Difficulty = "easy" | "medium" | "hard" | null;
interface GameSettingsState {
  difficulty: Difficulty;
  timeLimit: number;
  isTimed: boolean;
  timed: boolean; // Alias for isTimed for compatibility
  multiplayerTimer: number; // Alias for timeLimit for compatibility
  boardSize: number;
  winCondition: number;
  setDifficulty: (difficulty: Difficulty) => void;
  setTimeLimit: (timeLimit: number) => void;
  setIsTimed: (isTimed: boolean) => void;
  setTimed: (timed: boolean) => void; // Alias setter
  setMultiplayerTimer: (timer: number) => void; // Alias setter
  setBoardSize: (size: number) => void;
  setWinCondition: (count: number) => void;
}

// Score State
interface ScoreState {
  player1Score: number;
  player2Score: number;
  setPlayer1Score: (score: number) => void;
  setPlayer2Score: (score: number) => void;
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
  player1Char: null,
  player2Char: null,
  setCurrentPlayer: (player) => set({ currentPlayer: player }),
  setPlayer1: (player) => set({ player1: player }),
  setPlayer2: (player) => set({ player2: player }),
  setPlayer1Char: (char) => set({ player1Char: char }),
  setPlayer2Char: (char) => set({ player2Char: char }),
  
  // Game Settings State
  difficulty: "medium",  // Default value
  timeLimit: 30,        // Default value
  isTimed: false,       // Default value
  timed: false,         // Alias for isTimed
  multiplayerTimer: 30, // Alias for timeLimit
  boardSize: 3,         // Default value
  winCondition: 3,      // Default value  
  setDifficulty: (difficulty) => set({ difficulty }),
  setTimeLimit: (timeLimit) => set({ timeLimit, multiplayerTimer: timeLimit }),
  setIsTimed: (isTimed) => set({ isTimed, timed: isTimed }),
  setTimed: (timed) => set({ isTimed: timed, timed }), // Alias setter
  setMultiplayerTimer: (timer) => set({ timeLimit: timer, multiplayerTimer: timer }), // Alias setter
  setBoardSize: (size) => set({ boardSize: size }),
  setWinCondition: (count) => set({ winCondition: count }),
  
  // Score State
  player1Score: 0,
  player2Score: 0,
  setPlayer1Score: (score) => set({ player1Score: score }),
  setPlayer2Score: (score) => set({ player2Score: score }),
  incrementPlayer1Score: () => set((state) => ({ player1Score: state.player1Score + 1 })),
  incrementPlayer2Score: () => set((state) => ({ player2Score: state.player2Score + 1 })),
  resetScores: () => set({ player1Score: 0, player2Score: 0 }),
}));
