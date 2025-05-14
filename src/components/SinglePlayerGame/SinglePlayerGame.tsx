"use client";
import React, { useMemo } from "react";
import { useGamePhase, Phase } from "@/context/GamePhaseContext";
import { usePlayerContext } from "@/context/PlayerContext";
import { BackButton } from "../buttons/BackButton";
import { DifficultySelection } from "../shared/DifficultySelection";
import { CharacterSelection } from "../shared/CharacterSelection";
import { Countdown } from "../shared/Countdown";
import { SinglePlayerBoard } from "./SinglePlayerBoard";
import { PhaseRenderer, usePhaseNavigation } from "../shared/PhaseRenderer";

export const SinglePlayerGame = () => {
  const { phase, setPhase, setGameMode } = useGamePhase();
  const {
    difficulty,
    setDifficulty,
    player1Char,
    setPlayer1Char,
    player2Char,
    setPlayer2Char,
  } = usePlayerContext();

  const symbols = ["😀", "😎", "🚀", "🐱", "🔥", "🌟", "🍀"];

  // Phase navigation map
  const phaseNavigation: Record<Phase, Phase> = {
    difficultySelection: "mainMenu",
    characterSelection: "difficultySelection",
    countdown: "characterSelection",
    game: "countdown",
    // Add other phases with their default values
    mainMenu: "mainMenu",
    timeOptionSelection: "mainMenu",
    timeSettings: "timeOptionSelection",
    characterSelectionMulti: "timeOptionSelection",
  };

  const navigateBack = usePhaseNavigation(
    setPhase,
    setGameMode,
    phaseNavigation
  );

  // Define phase components
  const phases = useMemo(
    () => ({
      difficultySelection: {
        component: (
          <DifficultySelection
            onSelect={(diff) => {
              setDifficulty(diff);
              setPhase("characterSelection");
            }}
          />
        ),
        onBack: () => navigateBack("difficultySelection"),
      },
      characterSelection: {
        component: (
          <CharacterSelection
            symbols={symbols}
            gameMode="single"
            onComplete={() => setPhase("countdown")}
          />
        ),
        onBack: () => navigateBack("characterSelection"),
      },
      countdown: {
        component: (
          <Countdown initialCount={3} onComplete={() => setPhase("game")} />
        ),
        onBack: () => navigateBack("countdown"),
      },
      game: {
        component: (
          <SinglePlayerBoard
            difficulty={difficulty!}
            playerChar={player1Char!}
            botChar={player2Char!}
          />
        ),
        // No back button during active game
      },
      // Add empty entries for other phases to satisfy TypeScript
      mainMenu: { component: null },
      timeOptionSelection: { component: null },
      timeSettings: { component: null },
      characterSelectionMulti: { component: null },
    }),
    [
      difficulty,
      player1Char,
      player2Char,
      setDifficulty,
      setPhase,
      setPlayer1Char,
      setPlayer2Char,
      symbols,
      navigateBack,
    ]
  );

  // Only render if we have a valid phase component
  if (phase in phases) {
    return <PhaseRenderer currentPhase={phase} phases={phases} />;
  }

  return null;
};
