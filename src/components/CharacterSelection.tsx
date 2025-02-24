"use client";
import { useState } from "react";

export const CharacterSelection = () => {
  const symbols = ["💪🏻", "📖", "🎫", "🆘", "👉🏻", "✅"];
  const [player1Char, setPlayer1Char] = useState<string | null>(null);
  const [player2Char, setPlayer2Char] = useState<string | null>(null);

  // Render Player 1's prompt.
  if (!player1Char) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-semibold mb-4">
          Player 1: Choose Your Character
        </h2>
        <div className="flex gap-4">
          {symbols.map((symbol, index) => (
            <button
              key={index}
              className="p-4 border rounded hover:bg-gray-200 transition"
              onClick={() => setPlayer1Char(symbol)}
            >
              {symbol}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Render Player 2's prompt, excluding the symbol already chosen by Player 1.
  if (!player2Char) {
    const availableSymbols = symbols.filter((symbol) => symbol !== player1Char);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-semibold mb-4">
          Player 2: Choose Your Character
        </h2>
        <div className="flex gap-4">
          {availableSymbols.map((symbol, index) => (
            <button
              key={index}
              className="p-4 border rounded hover:bg-gray-200 transition"
              onClick={() => setPlayer2Char(symbol)}
            >
              {symbol}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Once both players have chosen their characters, display a confirmation.
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-semibold mb-4">Players are set!</h2>
      <p className="text-lg mb-2">
        Player 1: <span className="font-bold">{player1Char}</span>
      </p>
      <p className="text-lg mb-6">
        Player 2: <span className="font-bold">{player2Char}</span>
      </p>
      {/* This is where your infinite tic tac toe board or game logic would go */}
      <p>Game will start here...</p>
    </div>
  );
};
