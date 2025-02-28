// CharacterSelectionPhase.tsx
"use client";
import React, { useEffect } from "react";
import { CharacterSelection } from "./CharacterSelection";
import { Countdown } from "./Countdown";
import { BackButton } from "../buttons/BackButton";
import { autoAssignBotSymbol } from "../../utils/autoAssignBotSymbol";

export type Phase =
  | "mainMenu"
  | "timeOptionSelection"
  | "timeSettings"
  | "difficultySelection"
  | "characterSelection"
  | "countdown"
  | "game";

interface CharacterSelectionPhaseProps {
  symbols: string[];
  gameMode: "multi" | "single" | null;
  player1Char: string | null;
  player2Char: string | null;
  setPlayer1Char: React.Dispatch<React.SetStateAction<string | null>>;
  setPlayer2Char: React.Dispatch<React.SetStateAction<string | null>>;
  setPhase: React.Dispatch<React.SetStateAction<Phase>>;
}

export const CharacterSelectionPhase: React.FC<
  CharacterSelectionPhaseProps
> = ({
  symbols,
  gameMode,
  player1Char,
  player2Char,
  setPlayer1Char,
  setPlayer2Char,
  setPhase,
}) => {
  // Auto-assign bot symbol if in single-player mode and not already assigned.
  useEffect(() => {
    if (gameMode === "single" && player1Char && !player2Char) {
      const botSymbol = autoAssignBotSymbol(player1Char, symbols);
      setPlayer2Char(botSymbol);
    }
  }, [gameMode, player1Char, player2Char, setPlayer2Char, symbols]);

  return (
    <div className="relative">
      <BackButton
        onClick={() =>
          setPhase(gameMode === "single" ? "difficultySelection" : "mainMenu")
        }
      />
      {!player1Char ? (
        <CharacterSelection
          player="Player 1"
          availableSymbols={symbols}
          onSelect={setPlayer1Char}
        />
      ) : !player2Char ? (
        // Instead of auto-assigning inline, we wait for the useEffect to set it.
        <div className="flex items-center justify-center min-h-[50vh]">
          <p>Assigning bot symbol...</p>
        </div>
      ) : (
        <Countdown initialCount={3} onComplete={() => setPhase("game")} />
      )}
    </div>
  );
};
