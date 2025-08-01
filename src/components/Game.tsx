
"use client";
import React, { memo, useCallback } from 'react';
import { useGameStore } from "@/store";
import { MainMenu } from "./shared/MainMenu";
import { SafeLazySinglePlayerGame, SafeLazyMultiPlayerGame } from "./lazy/LazyGameComponents";
import { PageTitleManager } from "./PageTitleManager";
import { useRenderPerformance } from "@/hooks/usePerformance";

export const Game = memo(() => {
  // Performance monitoring in development
  useRenderPerformance('Game');
  
  const gameMode = useGameStore(state => state.gameMode);
  const setGameMode = useGameStore(state => state.setGameMode);
  const setPhase = useGameStore(state => state.setPhase);

  const handleModeSelect = useCallback((mode: typeof gameMode) => {
    setGameMode(mode);
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
        <SafeLazySinglePlayerGame />
      </>
    );
  } else if (gameMode === "multi") {
    return (
      <>
        <PageTitleManager />
        <SafeLazyMultiPlayerGame />
      </>
    );
  }

  return (
    <>
      <PageTitleManager />
      <MainMenu onModeSelect={handleModeSelect} />
    </>
  );
});

Game.displayName = 'Game';
