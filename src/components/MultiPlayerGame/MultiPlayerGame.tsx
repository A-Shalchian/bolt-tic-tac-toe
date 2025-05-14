"use client";
import React, { useMemo } from "react";
import { useGamePhase, Phase } from "@/context/GamePhaseContext";
import { usePlayerContext } from "@/context/PlayerContext";
import { useGameSettings } from "@/context/GameSettingsContext";
import { TimeOptionSelection } from "../shared/TimeOptionSelection";
import { TimeSetting } from "../shared/TimeSetting";
import { CharacterSelection } from "../shared/CharacterSelection";
import { Countdown } from "../shared/Countdown";
import { MultiPlayerBoard } from "./MultiPlayerBoard";
import { PhaseRenderer, usePhaseNavigation } from "../shared/PhaseRenderer";

export const MultiPlayerGame = () => {
  const { phase, setPhase, setGameMode } = useGamePhase();
  const { player1Char, player2Char } = usePlayerContext();
  const { timed, setTimed, multiplayerTimer, setMultiplayerTimer } =
    useGameSettings();

  const symbols = ["😀", "😎", "🚀", "🐱", "🔥", "🌟", "🍀"];

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

  // Define phase components
  const phases = useMemo(
    () => ({
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
    }),
    [
      timed,
      multiplayerTimer,
      player1Char,
      player2Char,
      setTimed,
      setMultiplayerTimer,
      setPhase,
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
