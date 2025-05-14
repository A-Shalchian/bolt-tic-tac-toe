"use client";
import React, { ReactNode } from "react";
import { GamePhaseProvider } from "./GamePhaseContext";
import { PlayerProvider } from "./PlayerContext";
import { GameSettingsProvider } from "./GameSettingsContext";
import { ScoreProvider } from "./ScoreContext";

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <GamePhaseProvider>
      <PlayerProvider>
        <GameSettingsProvider>
          <ScoreProvider>{children}</ScoreProvider>
        </GameSettingsProvider>
      </PlayerProvider>
    </GamePhaseProvider>
  );
};
