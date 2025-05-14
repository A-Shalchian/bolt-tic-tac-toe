"use client";
import { AppProviders } from "./AppProviders";
import { useGamePhase } from "./GamePhaseContext";
import { usePlayerContext } from "./PlayerContext";
import { useGameSettings } from "./GameSettingsContext";
import { useScoreContext } from "./ScoreContext";

// This file is kept for backward compatibility
// It re-exports the AppProviders and combines the hooks from our split contexts

export const GameProvider = AppProviders;

// Combined hook that provides all context values in one place
export const useGameContext = () => {
  const gamePhase = useGamePhase();
  const playerContext = usePlayerContext();
  const gameSettings = useGameSettings();
  const scoreContext = useScoreContext();

  return {
    ...gamePhase,
    ...playerContext,
    ...gameSettings,
    ...scoreContext,
  };
};
