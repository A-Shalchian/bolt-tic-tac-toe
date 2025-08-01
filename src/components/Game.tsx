
"use client";
import React, { memo, useCallback } from 'react';
import { useGameStore } from "@/store";
import { MainMenu } from "./shared/MainMenu";
import { SinglePlayerGame } from "./SinglePlayerGame/SinglePlayerGame";
import { MultiPlayerGame } from "./MultiPlayerGame/MultiPlayerGame";
import { PageTitleManager } from "./PageTitleManager";

export const Game = memo(() => {
  const gameMode = useGameStore(state => state.gameMode);
  const setGameMode = useGameStore(state => state.setGameMode);
  const setPhase = useGameStore(state => state.setPhase);

  // Memoize the mode selection handler to prevent unnecessary re-renders
  const handleModeSelect = useCallback((mode: typeof gameMode) => {
    setGameMode(mode);
    // Set the initial phase based on the game mode
    if (mode === "single") {
      setPhase("difficultySelection");
    } else if (mode === "multi") {
      setPhase("timeOptionSelection");
    }
  }, [setGameMode, setPhase]);

  if (!gameMode) {
    return (
      <>
        <PageTitleManager />
        <MainMenu onModeSelect={handleModeSelect} />
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

  // Fallback for unexpected game modes
  return (
    <>
      <PageTitleManager />
      <MainMenu onModeSelect={handleModeSelect} />
    </>
  );
});

Game.displayName = 'Game';
