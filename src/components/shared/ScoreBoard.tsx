"use client";
import React from "react";
import { useGameContext } from "@/context/GameContext";

export const ScoreBoard: React.FC = () => {
  const { player1Score, player2Score, player1Char, player2Char } =
    useGameContext();

  return (
    <div className="bg-indigo-200 p-6 rounded-lg shadow-md my-6">
      <h2 className="text-xl font-bold mb-2 text-center">Score</h2>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span>Player 1 ({player1Char})</span>
          <span className="font-semibold text-lg">{player1Score}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Player 2 ({player2Char})</span>
          <span className="font-semibold text-lg">{player2Score}</span>
        </div>
      </div>
    </div>
  );
};
