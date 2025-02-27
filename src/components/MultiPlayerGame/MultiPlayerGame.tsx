"use client";
import { useState } from "react";
import { TimeOptionSelection } from "../TimeOptionSelection";
import { TimeSetting } from "../TimeSetting";
import { MultiPlayerCharacterSelection } from "./MultiPlayerCharacterSelection";
import { Countdown } from "../Countdown";
import { MultiPlayerBoard } from "./MultiPlayerBoard";

export const MultiPlayerGame = () => {
  const [timed, setTimed] = useState(false);
  const [timeLimit, setTimeLimit] = useState(0);
  const [phase, setPhase] = useState<
    "timeOption" | "timeSetting" | "charSelect" | "countdown" | "board"
  >("timeOption");
  const [player1Char, setPlayer1Char] = useState<string | null>(null);
  const [player2Char, setPlayer2Char] = useState<string | null>(null);

  const symbols = ["😀", "😎", "🚀", "🐱", "🔥", "🌟", "🍀"];

  // 1. Time Option Selection
  if (phase === "timeOption") {
    return (
      <TimeOptionSelection
        onSelect={(isTimed) => {
          if (isTimed) {
            setTimed(true);
            setPhase("timeSetting");
          } else {
            setTimed(false);
            setTimeLimit(0);
            setPhase("charSelect");
          }
        }}
      />
    );
  }

  // 2. Time Setting
  if (phase === "timeSetting") {
    return (
      <TimeSetting
        onSelect={(time) => {
          setTimeLimit(time);
          setPhase("charSelect");
        }}
      />
    );
  }

  // 3. Character Selection
  if (phase === "charSelect") {
    return (
      <MultiPlayerCharacterSelection
        symbols={symbols}
        onSelectPlayer1={(char) => setPlayer1Char(char)}
        onSelectPlayer2={(char) => setPlayer2Char(char)}
        onBothSelected={() => setPhase("countdown")}
      />
    );
  }

  // 4. Countdown
  if (phase === "countdown") {
    return <Countdown initialCount={3} onComplete={() => setPhase("board")} />;
  }

  // 5. Board
  if (phase === "board") {
    return (
      <MultiPlayerBoard
        timed={timed}
        timeLimit={timeLimit}
        player1Char={player1Char!}
        player2Char={player2Char!}
      />
    );
  }

  return null;
};
