"use client";
import React from "react";
import { usePlayerContext } from "@/context/PlayerContext";
import { useGamePhase } from "@/context/GamePhaseContext";

interface CharacterSelectionProps {
  symbols: string[];
  gameMode: "single" | "multi";
  onComplete?: () => void;
}

export const CharacterSelection: React.FC<CharacterSelectionProps> = ({
  symbols,
  gameMode,
  onComplete,
}) => {
  const { player1Char, setPlayer1Char, player2Char, setPlayer2Char } =
    usePlayerContext();
  const { setPhase } = useGamePhase();

  const handlePlayer1Selection = (symbol: string) => {
    setPlayer1Char(symbol);

    if (gameMode === "single") {
      // For single player, auto-select bot character and move to next phase
      const botSymbol = symbols.find((s) => s !== symbol) || "😎";
      setPlayer2Char(botSymbol);

      if (onComplete) {
        onComplete();
      } else {
        setPhase("countdown");
      }
    }
  };

  const handlePlayer2Selection = (symbol: string) => {
    setPlayer2Char(symbol);

    if (onComplete) {
      onComplete();
    } else {
      setPhase("countdown");
    }
  };

  // For single player, we only show one selection screen
  if (gameMode === "single") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Choose Your Character <br /> (Single Player)
        </h2>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {symbols.map((symbol, idx) => (
            <button
              key={idx}
              className="p-3 md:p-6 border rounded hover:bg-gray-200 transition text-2xl md:text-4xl w-20 h-20 md:w-28 md:h-28 flex items-center justify-center"
              onClick={() => handlePlayer1Selection(symbol)}
            >
              {symbol}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // For multiplayer, we show two selection screens
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
                onClick={() => handlePlayer1Selection(symbol)}
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
                  onClick={() => handlePlayer2Selection(symbol)}
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
