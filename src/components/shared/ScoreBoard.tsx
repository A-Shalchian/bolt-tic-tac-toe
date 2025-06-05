"use client";
import React from "react";
import { useGameStore } from "@/store";

interface ScoreBoardProps {
  player1?: string;
  player2?: string;
  player1Score?: number;
  player2Score?: number;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  player1,
  player2,
  player1Score: propPlayer1Score,
  player2Score: propPlayer2Score,
}) => {
  const storePlayer1Score = useGameStore(state => state.player1Score);
  const storePlayer2Score = useGameStore(state => state.player2Score);
  const storePlayer1 = useGameStore(state => state.player1);
  const storePlayer2 = useGameStore(state => state.player2);
  
  // Access the symbols
  const player1Char = storePlayer1.symbol;
  const player2Char = storePlayer2.symbol;
  
  // Create aliases for context values for compatibility with existing code
  const contextPlayer1Score = storePlayer1Score;
  const contextPlayer2Score = storePlayer2Score;

  // Use props if provided, otherwise fall back to context values
  const p1Score =
    propPlayer1Score !== undefined ? propPlayer1Score : contextPlayer1Score;
  const p2Score =
    propPlayer2Score !== undefined ? propPlayer2Score : contextPlayer2Score;
  const p1Name = player1 || `Player 1 (${player1Char})`;
  const p2Name = player2 || `Player 2 (${player2Char})`;

  return (
    <div className="bg-indigo-200 p-6 rounded-lg shadow-md my-6">
      <h2 className="text-xl font-bold mb-2 text-center">Score</h2>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span>{p1Name}</span>
          <span className="font-semibold text-lg">{p1Score}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>{p2Name}</span>
          <span className="font-semibold text-lg">{p2Score}</span>
        </div>
      </div>
    </div>
  );
};
