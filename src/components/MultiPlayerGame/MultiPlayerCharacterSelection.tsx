"use client";
import React, { useState } from "react";

type Props = {
  symbols: string[];
  onSelectPlayer1: (char: string) => void;
  onSelectPlayer2: (char: string) => void;
  onBothSelected: () => void;
};

export const MultiPlayerCharacterSelection: React.FC<Props> = ({
  symbols,
  onSelectPlayer1,
  onSelectPlayer2,
  onBothSelected,
}) => {
  const [player1Selected, setPlayer1Selected] = useState(false);
  const [player2Selected, setPlayer2Selected] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {!player1Selected ? (
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
                  onSelectPlayer1(symbol);
                  setPlayer1Selected(true);
                }}
              >
                {symbol}
              </button>
            ))}
          </div>
        </>
      ) : !player2Selected ? (
        <>
          <h2 className="text-2xl font-semibold mb-4">
            Player 2: Choose Your Character
          </h2>
          <div className="flex gap-4">
            {symbols.map((symbol, idx) => (
              <button
                key={idx}
                className="p-4 border rounded hover:bg-gray-200 transition"
                onClick={() => {
                  onSelectPlayer2(symbol);
                  setPlayer2Selected(true);
                  onBothSelected();
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
