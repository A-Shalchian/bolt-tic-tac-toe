"use client";
import React from "react";
import { useGameStore } from "@/store";

type Props = {
  symbols: string[];
};

export const MultiPlayerCharacterSelection: React.FC<Props> = ({ symbols }) => {
  // Get player state and setter functions from Zustand store
  const player1 = useGameStore(state => state.player1);
  const player2 = useGameStore(state => state.player2);
  const setPlayer1 = useGameStore(state => state.setPlayer1);
  const setPlayer2 = useGameStore(state => state.setPlayer2);
  const setPhase = useGameStore(state => state.setPhase);
  
  // Extract symbols from player objects for compatibility with existing code
  const player1Char = player1.symbol;
  const player2Char = player2.symbol;
  
  // Create setter functions that match the original context API
  const setPlayer1Char = (symbol: string) => setPlayer1({ ...player1, symbol });
  const setPlayer2Char = (symbol: string) => setPlayer2({ ...player2, symbol });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {!player1Char ? (
        <>
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Player 1: Choose Your Character <br /> (Multiplayer)
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {symbols.map((symbol, idx) => (
              <button
                key={idx}
                className="p-3 md:p-6 border rounded hover:bg-gray-200 transition text-2xl md:text-4xl w-20 h-20 md:w-28 md:h-28 flex items-center justify-center"
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
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Player 2: Choose Your Character <br /> (Multiplayer)
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {symbols
              .filter((symbol) => symbol !== player1Char)
              .map((symbol, idx) => (
                <button
                  key={idx}
                  className="p-3 md:p-6 border rounded hover:bg-gray-200 transition text-2xl md:text-4xl w-20 h-20 md:w-28 md:h-28 flex items-center justify-center"
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
