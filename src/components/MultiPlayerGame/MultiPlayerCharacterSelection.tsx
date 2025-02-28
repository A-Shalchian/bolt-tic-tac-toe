"use client";
import React from "react";
import { useGameContext } from "@/context/GameContext";

type Props = {
  symbols: string[];
};

export const MultiPlayerCharacterSelection: React.FC<Props> = ({ symbols }) => {
  const { player1Char, setPlayer1Char, player2Char, setPlayer2Char, setPhase } =
    useGameContext();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {!player1Char ? (
        <>
          <h2 className="text-2xl font-semibold mb-4">
            Player 1: Choose Your Character
          </h2>
          <div className="flex gap-4">
            {symbols.map((symbol, idx) => (
              <button
                key={idx}
                className="p-4 border rounded hover:bg-gray-200 transition"
                onClick={() => {
                  setPlayer1Char(symbol);
                }}
              >
                {symbol}
              </button>
            ))}
          </div>
        </>
      ) : !player2Char ? (
        <>
          <h2 className="text-2xl font-semibold mb-4">
            Player 2: Choose Your Character
          </h2>
          <div className="flex gap-4">
            {symbols
              .filter((symbol) => symbol !== player1Char)
              .map((symbol, idx) => (
                <button
                  key={idx}
                  className="p-4 border rounded hover:bg-gray-200 transition"
                  onClick={() => {
                    setPlayer2Char(symbol);
                    setPhase("countdown");
                  }}
                >
                  {symbol}
                </button>
              ))}
          </div>
        </>
      ) : null}
    </div>
  );
};
