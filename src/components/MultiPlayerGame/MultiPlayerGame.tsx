"use client";
import React from "react";
import { useGameContext } from "@/context/GameContext";
import { BackButton } from "../buttons/BackButton";
import { TimeOptionSelection } from "../shared/TimeOptionSelection";
import { TimeSetting } from "../shared/TimeSetting";
import { MultiPlayerCharacterSelection } from "./MultiPlayerCharacterSelection";
import { Countdown } from "../shared/Countdown";
import { MultiPlayerBoard } from "./MultiPlayerBoard";

export const MultiPlayerGame = () => {
  const {
    phase,
    setPhase,
    timed,
    setTimed,
    multiplayerTimer,
    setMultiplayerTimer,
    player1Char,
    player2Char,
    setGameMode,
  } = useGameContext();

  const symbols = ["😀", "😎", "🚀", "🐱", "🔥", "🌟", "🍀"];

  // Helper to render a BackButton for each phase
  const renderBackButton = () => {
    if (phase !== "mainMenu") {
      return (
        <div className="absolute top-4 left-4 z-50">
          <BackButton
            onClick={() => {
              if (phase === "timeOptionSelection") {
                setPhase("mainMenu");
                setGameMode(null);
              } else if (phase === "timeSettings") {
                setPhase("timeOptionSelection");
              } else if (phase === "characterSelectionMulti") {
                setPhase("timeOptionSelection");
              } else if (phase === "countdown") {
                setPhase("characterSelectionMulti");
              }
            }}
          />
        </div>
      );
    }
    return null;
  };

  // 1. Time Option Selection
  if (phase === "timeOptionSelection") {
    return (
      <div className="relative">
        {renderBackButton()}
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
      </div>
    );
  }

  // 2. Time Setting
  if (phase === "timeSettings") {
    return (
      <div className="relative">
        {renderBackButton()}
        <TimeSetting
          onSelect={(time) => {
            setMultiplayerTimer(time);
            setPhase("characterSelectionMulti");
          }}
        />
      </div>
    );
  }

  // 3. Character Selection
  if (phase === "characterSelectionMulti") {
    return (
      <div className="relative">
        {renderBackButton()}
        <MultiPlayerCharacterSelection symbols={symbols} />
      </div>
    );
  }

  // 4. Countdown
  if (phase === "countdown") {
    return (
      <div className="relative">
        {renderBackButton()}
        <Countdown initialCount={3} onComplete={() => setPhase("game")} />
      </div>
    );
  }

  // 5. Board
  if (phase === "game") {
    return (
      <MultiPlayerBoard
        timed={timed}
        timeLimit={multiplayerTimer}
        player1Char={player1Char!}
        player2Char={player2Char!}
      />
    );
  }

  // Otherwise
  return null;
};
