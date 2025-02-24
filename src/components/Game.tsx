"use client";
import { useState, useEffect } from "react";
import { GameBoard } from "./GameBoard";

export const Game = () => {
  // List of available symbols for players to choose.
  const symbols = ["😀", "😎", "🚀", "🐱", "🔥", "🌟", "🍀"];

  // Game states for character selection and turn indicator.
  const [player1Char, setPlayer1Char] = useState<string | null>(null);
  const [player2Char, setPlayer2Char] = useState<string | null>(null);
  // Phase: "characterSelection", "countdown", "game"
  const [phase, setPhase] = useState("characterSelection");
  // Countdown number (starts at 3)
  const [countdown, setCountdown] = useState(3);
  // Current turn indicator

  // When both players have chosen, move to countdown phase.
  useEffect(() => {
    if (player1Char && player2Char) {
      setPhase("countdown");
    }
  }, [player1Char, player2Char]);

  // Handle the countdown.
  useEffect(() => {
    if (phase === "countdown") {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            setPhase("game");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [phase]);

  // --- Phase Rendering ---

  // Character selection phase.
  if (phase === "characterSelection") {
    // If player1 hasn't chosen, prompt Player 1.
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
    } else if (!player2Char) {
      // Else, prompt Player 2 (exclude Player 1's symbol).
      const availableSymbols = symbols.filter(
        (symbol) => symbol !== player1Char
      );
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
  }

  // Countdown phase.
  if (phase === "countdown") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-3xl font-bold mb-4">Game starts in:</h2>
        <div className="text-6xl">{countdown}</div>
      </div>
    );
  }

  // Game phase.
  return <GameBoard player1Char={player1Char} player2Char={player2Char} />;
};
