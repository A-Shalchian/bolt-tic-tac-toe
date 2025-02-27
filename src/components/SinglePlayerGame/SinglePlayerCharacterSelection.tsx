"use client";
import React from "react";

type Props = {
  symbols: string[];
  onPlayerSelect: (char: string) => void;
};

export const SinglePlayerCharacterSelection: React.FC<Props> = ({
  symbols,
  onPlayerSelect,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-semibold mb-4">
        Choose Your Character (Single Player)
      </h2>
      <div className="flex gap-4">
        {symbols.map((symbol, idx) => (
          <button
            key={idx}
            className="p-4 border rounded hover:bg-gray-200 transition"
            onClick={() => onPlayerSelect(symbol)}
          >
            {symbol}
          </button>
        ))}
      </div>
    </div>
  );
};
