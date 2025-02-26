// GamePhase.tsx
"use client";
import React from "react";
import { GameBoard } from "./GameBoard";
import { SinglePlayerGameBoard } from "./SinglePlayerGameBoard";
import { BackButton } from "./buttons/BackButton";

// Define the allowed phases
export type Phase =
  | "mainMenu"
  | "timeOptionSelection"
  | "timeSettings"
  | "difficultySelection"
  | "characterSelection"
  | "countdown"
  | "game";

type GamePhaseProps = {
  gameMode: "multi" | "single" | null;
  player1Char: string;
  player2Char: string;
  multiplayerTimer: number;
  difficulty: "easy" | "medium" | "hard" | null;
  setPhase: (phase: Phase) => void;
  setPlayer1Char: (char: string | null) => void;
  setPlayer2Char: (char: string | null) => void;
};

export const GamePhase: React.FC<GamePhaseProps> = ({
  gameMode,
  player1Char,
  player2Char,
  multiplayerTimer,
  difficulty,
  setPhase,
  setPlayer1Char,
  setPlayer2Char,
}) => {
  return (
    <div className="relative">
      <BackButton onClick={() => setPhase("characterSelection")} />
      {gameMode === "multi" ? (
        <GameBoard
          player1Char={player1Char}
          player2Char={player2Char}
          timed={multiplayerTimer > 0}
          timeLimit={multiplayerTimer}
          onChangeSymbol={() => {
            setPlayer1Char(null);
            setPlayer2Char(null);
            setPhase("characterSelection");
          }}
          onMainMenu={() => {
            setPlayer1Char(null);
            setPlayer2Char(null);
            setPhase("mainMenu");
          }}
        />
      ) : (
        <SinglePlayerGameBoard
          humanChar={player1Char}
          botChar={player2Char}
          difficulty={difficulty!}
          onChangeSymbol={() => {
            setPlayer1Char(null);
            setPlayer2Char(null);
            setPhase("characterSelection");
          }}
          onMainMenu={() => {
            setPlayer1Char(null);
            setPlayer2Char(null);
            setPhase("mainMenu");
          }}
        />
      )}
    </div>
  );
};
