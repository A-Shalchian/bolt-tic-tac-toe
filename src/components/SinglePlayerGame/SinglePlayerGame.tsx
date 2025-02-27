"use client";
import { useState } from "react";
import { DifficultySelection } from "../DifficultySelection";
import { SinglePlayerCharacterSelection } from "./SinglePlayerCharacterSelection";
import { Countdown } from "../Countdown";
import { SinglePlayerBoard } from "./SinglePlayerBoard";

export const SinglePlayerGame = () => {
  const [difficulty, setDifficulty] = useState<
    "easy" | "medium" | "hard" | null
  >(null);
  const [playerChar, setPlayerChar] = useState<string | null>(null);
  const [botChar, setBotChar] = useState<string | null>(null);
  const [phase, setPhase] = useState<
    "difficulty" | "charSelect" | "countdown" | "board"
  >("difficulty");

  const symbols = ["😀", "😎", "🚀", "🐱", "🔥", "🌟", "🍀"];

  // 1. Difficulty
  if (phase === "difficulty") {
    return (
      <DifficultySelection
        onSelect={(diff) => {
          setDifficulty(diff);
          setPhase("charSelect");
        }}
      />
    );
  }

  // 2. Character Selection
  if (phase === "charSelect") {
    return (
      <SinglePlayerCharacterSelection
        symbols={symbols}
        onPlayerSelect={(char) => {
          setPlayerChar(char);
          // auto-assign bot symbol
          const botSymbol = symbols.find((s) => s !== char) || "😎";
          setBotChar(botSymbol);
          setPhase("countdown");
        }}
      />
    );
  }

  // 3. Countdown
  if (phase === "countdown") {
    return <Countdown initialCount={3} onComplete={() => setPhase("board")} />;
  }

  // 4. Board
  if (phase === "board") {
    return (
      <SinglePlayerBoard
        difficulty={difficulty!}
        playerChar={playerChar!}
        botChar={botChar!}
      />
    );
  }

  return null;
};
