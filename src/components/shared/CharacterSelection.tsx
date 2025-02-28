"use client";
import React from "react";

type CharacterSelectionProps = {
  player: string;
  availableSymbols: string[];
  onSelect: (symbol: string) => void;
};

export const CharacterSelection: React.FC<CharacterSelectionProps> = ({
  player,
  availableSymbols,
  onSelect,
}) => {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-20">
      <h2 className="text-2xl font-semibold mb-4">
        {player}: Choose Your Character
      </h2>
      <div className="flex gap-4">
        {availableSymbols.map((symbol, index) => (
          <button
            key={index}
            className="p-4 border rounded hover:bg-gray-200 transition"
            onClick={() => onSelect(symbol)}
          >
            {symbol}
          </button>
        ))}
      </div>
    </div>
  );
};
