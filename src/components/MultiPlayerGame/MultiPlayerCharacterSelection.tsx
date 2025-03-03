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
