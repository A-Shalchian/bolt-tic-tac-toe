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
      <h2 className="text-xl md:text-2xl font-semibold mb-4 text-center">
        Choose Your Character <br /> (Single Player)
      </h2>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {symbols.map((symbol, idx) => (
          <button
            key={idx}
            className="p-3 md:p-6 border rounded hover:bg-gray-200 transition text-2xl md:text-4xl w-20 h-20 md:w-28 md:h-28 flex items-center justify-center"
            onClick={() => onPlayerSelect(symbol)}
          >
            {symbol}
          </button>
        ))}
      </div>
    </div>
  );
};
