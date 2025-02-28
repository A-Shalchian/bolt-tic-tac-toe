"use client";
import React from "react";
import { useGameContext } from "@/context/GameContext";
import { BackButton } from "../buttons/BackButton";
import { TimeOptionSelection } from "../TimeOptionSelection";
import { TimeSetting } from "../TimeSetting";
import { MultiPlayerCharacterSelection } from "./MultiPlayerCharacterSelection";
import { Countdown } from "../Countdown";
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
    setPlayer1Char,
    player2Char,
    setPlayer2Char,
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
              } else if (phase === "timeSettings") {
                setPhase("timeOptionSelection");
              } else if (phase === "characterSelectionMulti") {
                setPhase("timeOptionSelection");
              } else if (phase === "countdown") {
                setPhase("characterSelectionMulti");
              } else if (phase === "game") {
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
        <MultiPlayerCharacterSelection
          symbols={symbols}
          onSelectPlayer1={(char) => setPlayer1Char(char)}
          onSelectPlayer2={(char) => setPlayer2Char(char)}
          onBothSelected={() => setPhase("countdown")}
        />
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
      <div className="relative">
        {renderBackButton()}
        <MultiPlayerBoard
          timed={timed}
          timeLimit={multiplayerTimer}
          player1Char={player1Char!}
          player2Char={player2Char!}
        />
      </div>
    );
  }

  // Otherwise
  return null;
};
