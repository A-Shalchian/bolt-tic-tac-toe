"use client";
import React, { useMemo } from "react";
import { useGameStore } from "@/store";
import type { Phase } from "@/store";
import { DifficultySelection } from "../shared/DifficultySelection";
import { CharacterSelection } from "../shared/CharacterSelection";
import { Countdown } from "../shared/Countdown";
import { SinglePlayerBoard } from "./SinglePlayerBoard";
import { PhaseRenderer, usePhaseNavigation } from "../shared/PhaseRenderer";

export const SinglePlayerGame = () => {
  const phase = useGameStore(state => state.phase);
  const setPhase = useGameStore(state => state.setPhase);
  const setGameMode = useGameStore(state => state.setGameMode);
  const difficulty = useGameStore(state => state.difficulty);
  const setDifficulty = useGameStore(state => state.setDifficulty);
  const player1 = useGameStore(state => state.player1);
  const player2 = useGameStore(state => state.player2);
  const setPlayer1 = useGameStore(state => state.setPlayer1);
  const setPlayer2 = useGameStore(state => state.setPlayer2);
  
  // Aliases for compatibility
  const player1Char = player1.symbol;
  const player2Char = player2.symbol;

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
  const phases = useMemo(() => {
    const symbols = ["😀", "😎", "🚀", "🐱", "🔥", "🌟", "🍀"];
    
    return {
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
      },
      // Add empty entries for other phases to satisfy TypeScript
      mainMenu: { component: null },
      timeOptionSelection: { component: null },
      timeSettings: { component: null },
      characterSelectionMulti: { component: null },
    };
  }, [
    difficulty,
    player1Char,
    player2Char,
    setDifficulty,
    setPhase,
    navigateBack
  ]);

  // Only render if we have a valid phase component
  if (phase in phases) {
    return <PhaseRenderer currentPhase={phase} phases={phases} />;
  }

  return null;
};
