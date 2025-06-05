"use client";
import React, { useMemo, useCallback } from "react";
import { useGameStore } from "@/store";
import type { Phase } from "@/store";
import { TimeOptionSelection } from "../shared/TimeOptionSelection";
import { TimeSetting } from "../shared/TimeSetting";
import { CharacterSelection } from "../shared/CharacterSelection";
import { Countdown } from "../shared/Countdown";
import { MultiPlayerBoard } from "./MultiPlayerBoard";
import { PhaseRenderer, usePhaseNavigation } from "../shared/PhaseRenderer";

export const MultiPlayerGame = () => {
  const phase = useGameStore(state => state.phase);
  const setPhase = useGameStore(state => state.setPhase);
  const setGameMode = useGameStore(state => state.setGameMode);
  const player1 = useGameStore(state => state.player1);
  const player2 = useGameStore(state => state.player2);
  const player1Char = player1.symbol;
  const player2Char = player2.symbol;
  
  // Get settings from Zustand store
  const timeLimit = useGameStore(state => state.timeLimit);
  const setTimeLimit = useGameStore(state => state.setTimeLimit);
  const isTimed = useGameStore(state => state.isTimed);
  const setIsTimed = useGameStore(state => state.setIsTimed);
  
  // For compatibility with existing code
  const timed = isTimed;
  const multiplayerTimer = timeLimit;
  const setTimed = setIsTimed;
  const setMultiplayerTimer = setTimeLimit;

  // Phase navigation map
  const phaseNavigation: Record<Phase, Phase> = {
    timeOptionSelection: "mainMenu",
    timeSettings: "timeOptionSelection",
    characterSelectionMulti: "timeOptionSelection",
    countdown: "characterSelectionMulti",
    game: "countdown",
    // Add other phases with their default values
    mainMenu: "mainMenu",
    difficultySelection: "mainMenu",
    characterSelection: "difficultySelection",
  };

  const navigateBack = usePhaseNavigation(
    setPhase,
    setGameMode,
    phaseNavigation
  );

  // Define symbols in their own useMemo to prevent dependency changes on every render
  const symbols = useMemo(() => ["😀", "😎", "🚀", "🐱", "🔥", "🌟", "🍀"], []);
  
  // Define phase components
  const phases = useMemo(() => {
    // Debug the phase components being created
    console.log('Creating phase components, current phase:', phase);
    
    return {
      timeOptionSelection: {
        component: (
          <TimeOptionSelection
            onSelect={(isTimed) => {
              if (isTimed) {
                setTimed(true);
                setPhase("timeSettings");
              } else {
                setTimed(false);
                setMultiplayerTimer(0);
                setPhase("characterSelectionMulti");
              }
            }}
          />
        ),
        onBack: () => navigateBack("timeOptionSelection"),
      },
      timeSettings: {
        component: (
          <TimeSetting
            onSelect={(time) => {
              setMultiplayerTimer(time);
              setPhase("characterSelectionMulti");
            }}
          />
        ),
        onBack: () => navigateBack("timeSettings"),
      },
      characterSelectionMulti: {
        component: (
          <CharacterSelection
            symbols={symbols}
            gameMode="multi"
            onComplete={() => setPhase("countdown")}
          />
        ),
        onBack: () => navigateBack("characterSelectionMulti"),
      },
      countdown: {
        component: (
          <Countdown initialCount={3} onComplete={() => setPhase("game")} />
        ),
        onBack: () => navigateBack("countdown"),
      },
      game: {
        component: (
          <MultiPlayerBoard
            timed={timed}
            timeLimit={multiplayerTimer}
            player1Char={player1Char!}
            player2Char={player2Char!}
          />
        ),
        // No back button during active game
      },
      // Add empty entries for other phases to satisfy TypeScript
      mainMenu: { component: null },
      difficultySelection: { component: null },
      characterSelection: { component: null },
    };
  }, [
    timed,
    multiplayerTimer,
    player1Char,
    player2Char,
    setTimed,
    setMultiplayerTimer,
    setPhase,
    navigateBack,
    phase,
    symbols
  ]);

  // Debug output to see current phase
  console.log('Current phase:', phase);

  // Only render if we have a valid phase component
  if (phase in phases) {
    return <PhaseRenderer currentPhase={phase} phases={phases} />;
  }
  
  // Fallback in case phase isn't recognized
  return <div>Loading...</div>;
};
