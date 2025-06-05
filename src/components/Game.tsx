
"use client";
import { useGameStore } from "@/store";
import { MainMenu } from "./shared/MainMenu";
import { SinglePlayerGame } from "./SinglePlayerGame/SinglePlayerGame";
import { MultiPlayerGame } from "./MultiPlayerGame/MultiPlayerGame";
import { PageTitleManager } from "./PageTitleManager";

export const Game = () => {
  const gameMode = useGameStore(state => state.gameMode);
  const setGameMode = useGameStore(state => state.setGameMode);
  const setPhase = useGameStore(state => state.setPhase);
  
  // Include the PageTitleManager component that handles dynamic title changes
  // when users switch tabs

  if (!gameMode) {
    return (
      <>
        <PageTitleManager />
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
      </>
    );
  }

  if (gameMode === "single") {
    return (
      <>
        <PageTitleManager />
        <SinglePlayerGame />
      </>
    );
  } else if (gameMode === "multi") {
    return (
      <>
        <PageTitleManager />
        <MultiPlayerGame />
      </>
    );
  }
};
