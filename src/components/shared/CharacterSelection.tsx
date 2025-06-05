"use client";
import React from "react";
import { useGameStore } from "@/store";

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
  // Get player state and setter functions from Zustand store
  const player1 = useGameStore(state => state.player1);
  const player2 = useGameStore(state => state.player2);
  const setPlayer1 = useGameStore(state => state.setPlayer1);
  const setPlayer2 = useGameStore(state => state.setPlayer2);
  const setPhase = useGameStore(state => state.setPhase);
  
  // Extract symbols from player objects for compatibility with existing code
  const player1Char = player1.symbol;
  const player2Char = player2.symbol;
  
  // Reset player characters when the component mounts in multi-player mode
  // Use a ref to track if we've already reset to avoid infinite loops
  const hasReset = React.useRef(false);
  
  React.useEffect(() => {
    // Only reset once when the component first mounts
    if (gameMode === "multi" && !hasReset.current) {
      
      // Intentionally access latest state inside the effect to avoid dependency loops
      setPlayer1({ name: "Player 1", symbol: "" });
      setPlayer2({ name: "Player 2", symbol: "" });
      hasReset.current = true;
    }
  }, [gameMode, setPlayer1, setPlayer2]); // Only depend on stable functions and values
  
  // Create setter functions that match the original context API
  const setPlayer1Char = (symbol: string) => setPlayer1({ ...player1, symbol });
  const setPlayer2Char = (symbol: string) => setPlayer2({ ...player2, symbol });

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
