// Game.tsx
"use client";
import { useGamePhase } from "@/context/GamePhaseContext";
import { MainMenu } from "./shared/MainMenu";
import { SinglePlayerGame } from "./SinglePlayerGame/SinglePlayerGame";
import { MultiPlayerGame } from "./MultiPlayerGame/MultiPlayerGame";

export const Game = () => {
  const { gameMode, setGameMode, setPhase } = useGamePhase();

  if (!gameMode) {
    return (
      <MainMenu
        onModeSelect={(mode) => {
          setGameMode(mode);
          // Set the initial phase based on the game mode
          if (mode === "single") {
            setPhase("difficultySelection");
          } else if (mode === "multi") {
            setPhase("timeOptionSelection");
          }
        }}
      />
    );
  }

  if (gameMode === "single") {
    return <SinglePlayerGame />;
  } else if (gameMode === "multi") {
    return <MultiPlayerGame />;
  }
};
