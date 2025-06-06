"use client";
import React, { useState } from "react";
import { SurrenderButton } from "../buttons/SurrenderButton";
import { ScoreBoard } from "./ScoreBoard";
import { checkWin } from "@/utils/botLogic";
import { useGameStore } from "@/store";
import { MainMenuButton } from "../buttons/MainMenuButton";

export type Cell = string | null;

export interface BaseBoardProps {
  player1Char: string;
  player2Char: string;
  gameType: "single" | "multi";
}

export interface GameState {
  board: Cell[];
  player1Moves: number[];
  player2Moves: number[];
  currentTurn: string;
  winner: string | null;
  showPrompt: boolean;
}

export const useGameBoard = (
  initialTurn: string,
  onWin?: (player: string) => void
) => {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [player1Moves, setPlayer1Moves] = useState<number[]>([]);
  const [player2Moves, setPlayer2Moves] = useState<number[]>([]);
  const [currentTurn, setCurrentTurn] = useState<string>(initialTurn);
  const [winner, setWinner] = useState<string | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  // Get scores from Zustand store
  const player1Score = useGameStore(state => state.player1Score);
  const player2Score = useGameStore(state => state.player2Score);
  const incrementPlayer1Score = useGameStore(state => state.incrementPlayer1Score);
  const incrementPlayer2Score = useGameStore(state => state.incrementPlayer2Score);
  
  // Create setScore functions to maintain compatibility with existing code
  const setPlayer1Score = (score: number) => {
    if (score > player1Score) {
      incrementPlayer1Score();
    }
  };
  
  const setPlayer2Score = (score: number) => {
    if (score > player2Score) {
      incrementPlayer2Score();
    }
  };

  // Check if 3 moves form a win
  const checkForWin = (moves: number[]): boolean => {
    if (moves.length < 3) return false;
    return checkWin(moves);
  };

  // Reset game
  const handleRematch = () => {
    setBoard(Array(9).fill(null));
    setPlayer1Moves([]);
    setPlayer2Moves([]);
    setWinner(null);
    setCurrentTurn(initialTurn);
    setShowPrompt(false);
  };

  // Helper to update moves and check for win
  const updateMoves = (
    index: number,
    player: string,
    currentMoves: number[],
    setPlayerMoves: React.Dispatch<React.SetStateAction<number[]>>,
    winMessage: string,
    incrementScore: () => void
  ) => {
    const newBoard = [...board];
    const newMoves = [...currentMoves];

    // Sliding mechanic - remove oldest move if we already have 3
    if (newMoves.length === 3) {
      newBoard[newMoves[0]] = null;
      newMoves.shift();
    }

    // Place new marker
    newBoard[index] = player;
    newMoves.push(index);

    // Check for win
    if (newMoves.length === 3 && checkForWin(newMoves)) {
      setWinner(winMessage);
      incrementScore();
      setBoard(newBoard);
      setPlayerMoves(newMoves);
      return true;
    }

    setPlayerMoves(newMoves);
    setBoard(newBoard);
    return false;
  };

  return {
    board,
    setBoard,
    player1Moves,
    setPlayer1Moves,
    player2Moves,
    setPlayer2Moves,
    currentTurn,
    setCurrentTurn,
    winner,
    setWinner,
    showPrompt,
    setShowPrompt,
    player1Score,
    setPlayer1Score,
    player2Score,
    setPlayer2Score,
    checkForWin,
    handleRematch,
    updateMoves,
  };
};

export const BaseBoard: React.FC<
  BaseBoardProps & {
    children?: React.ReactNode;
    onSurrender: () => void;
    renderCell: (index: number) => React.ReactNode;
    renderLeftPanel: () => React.ReactNode;
    renderRightPanel: () => React.ReactNode;
    showRematchPrompt: boolean;
    onRematch: () => void;
    onClose: () => void;
    onShowPrompt: () => void;
    winner?: string | null;
  }
> = ({
  children,
  onSurrender,
  renderCell,
  renderLeftPanel,
  renderRightPanel,
  showRematchPrompt,
  onRematch,
  onClose,
  onShowPrompt,
  winner,
}) => {
  return (
    <div className="relative flex flex-col md:flex-row min-h-screen">
      {/* Game Buttons */}
      <div className="absolute -top-8 right-4 z-50 flex flex-row items-center">
        <SurrenderButton onClick={onSurrender} />
        <MainMenuButton onClick={onShowPrompt} visible={!!winner} />
      </div>

      {/* Left Panel */}
      <div className="w-full md:w-1/4 p-4 border-b md:border-b-0 md:border-r">
        {renderLeftPanel()}
      </div>

      {/* Center: Board */}
      <div className="w-full md:w-2/4 p-4 flex justify-center items-start">
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 9 }).map((_, i) => renderCell(i))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full md:w-1/4 p-4 border-t md:border-t-0 md:border-l">
        {renderRightPanel()}
      </div>

      {/* Modal: Play Again */}
      {showRematchPrompt && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-white p-32 rounded-lg shadow-lg text-center">
            {/* Close button - just closes the popup */}
            <button 
              className="absolute top-2 right-2 w-12 h-12 flex items-center justify-center text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100"
              onClick={onClose}
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4">Game Over</h2>
            <div className="flex flex-col gap-4">
              <button
                className="px-8 py-2 bg-green-500 text-white rounded"
                onClick={onRematch}
              >
                <p className="font-semibold">Rematch</p>
              </button>
              <button
                className="px-8 py-2 bg-gray-500 text-white rounded"
                onClick={() => window.location.reload()}
              >
                <p className="font-semibold">Quit</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {children}
    </div>
  );
};
