"use client";
import React from "react";
import { useGameContext } from "@/context/GameContext";
import { BackButton } from "../buttons/BackButton";
import { DifficultySelection } from "../DifficultySelection";
import { SinglePlayerCharacterSelection } from "./SinglePlayerCharacterSelection";
import { Countdown } from "../Countdown";
import { SinglePlayerBoard } from "./SinglePlayerBoard";

export const SinglePlayerGame = () => {
  const {
    phase,
    setPhase,
    difficulty,
    setDifficulty,
    player1Char,
    setPlayer1Char,
    player2Char,
    setPlayer2Char,
  } = useGameContext();

  const symbols = ["😀", "😎", "🚀", "🐱", "🔥", "🌟", "🍀"];

  // Render a BackButton in the top-left corner for every phase except maybe "mainMenu".
  // Or conditionally if you prefer.
  const renderBackButton = () => {
    // Example: If you're in "difficultySelection", back goes to "mainMenu"
    // If you're in "characterSelection", back goes to "difficultySelection"
    // etc.  We'll do a simple approach:
    if (phase !== "mainMenu") {
      return (
        <div className="absolute top-4 left-4 z-50">
          <BackButton
            onClick={() => {
              if (phase === "difficultySelection") {
                setPhase("mainMenu");
              } else if (phase === "characterSelection") {
                setPhase("difficultySelection");
              } else if (phase === "countdown") {
                setPhase("characterSelection");
              } else if (phase === "game") {
                setPhase("characterSelection");
              }
            }}
          />
        </div>
      );
    }
    return null;
  };

  // Phase: difficultySelection
  if (phase === "difficultySelection") {
    return (
      <div className="relative">
        {renderBackButton()}
        <DifficultySelection
          onSelect={(diff) => {
            setDifficulty(diff);
            setPhase("characterSelection");
          }}
        />
      </div>
    );
  }

  // Phase: characterSelection
  if (phase === "characterSelection") {
    return (
      <div className="relative">
        {renderBackButton()}
        <SinglePlayerCharacterSelection
          symbols={symbols}
          onPlayerSelect={(char) => {
            setPlayer1Char(char);
            const botSymbol = symbols.find((s) => s !== char) || "😎";
            setPlayer2Char(botSymbol);
            setPhase("countdown");
          }}
        />
      </div>
    );
  }

  // Phase: countdown
  if (phase === "countdown") {
    return (
      <div className="relative">
        {renderBackButton()}
        <Countdown initialCount={3} onComplete={() => setPhase("game")} />
      </div>
    );
  }

  // Phase: game
  if (phase === "game") {
    return (
      <div className="relative">
        {renderBackButton()}
        <SinglePlayerBoard
          difficulty={difficulty!}
          playerChar={player1Char!}
          botChar={player2Char!}
        />
      </div>
    );
  }

  // Otherwise
  return null;
};
