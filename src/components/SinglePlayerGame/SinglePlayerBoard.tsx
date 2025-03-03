"use client";
import React, { useState, useEffect } from "react";
import { SurrenderButton } from "../buttons/SurrenderButton";
import {
  checkWin,
  getEasyMove,
  getMediumMove,
  getHardMove,
} from "@/utils/botLogic";
import { useGameContext } from "@/context/GameContext";
import { ScoreBoard } from "../shared/ScoreBoard";

type SinglePlayerBoardProps = {
  difficulty: "easy" | "medium" | "hard";
  playerChar: string;
  botChar: string;
};

type Cell = "HUMAN" | "BOT" | null;

export const SinglePlayerBoard: React.FC<SinglePlayerBoardProps> = ({
  difficulty,
  playerChar,
  botChar,
}) => {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [humanMoves, setHumanMoves] = useState<number[]>([]);
  const [botMoves, setBotMoves] = useState<number[]>([]);
  const [currentTurn, setCurrentTurn] = useState<"HUMAN" | "BOT">("HUMAN");
  const [winner, setWinner] = useState<string | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const { player1Score, setPlayer1Score, player2Score, setPlayer2Score } =
    useGameContext();

  // map index to board position strings
  const indexToPosition = (index: number): string => {
    const positions = [
      "top-left",
      "top-center",
      "top-right",
      "center-left",
      "center",
      "center-right",
      "bottom-left",
      "bottom-center",
      "bottom-right",
    ];
    return positions[index] || "";
  };

  // If it's the bot's turn and there's no winner, pick a move.
  useEffect(() => {
    if (!winner && currentTurn === "BOT") {
      const timer = setTimeout(() => {
        makeBotMove();
      }, 750);
      return () => clearTimeout(timer);
    }
  }, [currentTurn, winner]);

  // Check if 3 moves form a win.
  const checkForWin = (moves: number[]): boolean => {
    if (moves.length < 3) return false;
    return checkWin(moves);
  };

  // Human clicks a cell
  const handleCellClick = (index: number) => {
    if (winner || currentTurn !== "HUMAN" || board[index] !== null) return;
    placeMarker(index, "HUMAN");
    setCurrentTurn("BOT");
  };

  // Place marker for either "HUMAN" or "BOT"
  const placeMarker = (index: number, player: "HUMAN" | "BOT") => {
    const newBoard = [...board];

    if (player === "HUMAN") {
      const newMoves = [...humanMoves];
      if (newMoves.length === 3) {
        // remove oldest
        newBoard[newMoves[0]] = null;
        newMoves.shift();
      }
      newBoard[index] = "HUMAN";
      newMoves.push(index);
      if (newMoves.length === 3 && checkForWin(newMoves)) {
        setWinner("You win!");
        setPlayer1Score(player1Score + 1);
      }
      setHumanMoves(newMoves);
      setBoard(newBoard);
    } else {
      const newMoves = [...botMoves];
      if (newMoves.length === 3) {
        newBoard[newMoves[0]] = null;
        newMoves.shift();
      }
      newBoard[index] = "BOT";
      newMoves.push(index);
      if (newMoves.length === 3 && checkForWin(newMoves)) {
        setWinner("Bot wins!");
        setPlayer2Score(player2Score + 1);
      }
      setBotMoves(newMoves);
      setBoard(newBoard);
    }
  };

  // Bot picks a move based on difficulty
  const makeBotMove = () => {
    if (winner) return;
    let move: number;
    if (difficulty === "easy") {
      move = getEasyMove(board, humanMoves, botMoves);
    } else if (difficulty === "medium") {
      move = getMediumMove(board, humanMoves, botMoves);
    } else {
      move = getHardMove(board, humanMoves, botMoves);
    }

    if (move === -1) {
      setWinner("It's a tie!");
      return;
    }
    placeMarker(move, "BOT");
    setCurrentTurn("HUMAN");
  };

  // Surrender
  const handleSurrender = () => {
    if (!winner) {
      setWinner("Bot wins by surrender! +2 points");
      setPlayer2Score(player2Score + 2);
    }
  };

  // Rematch
  const handleRematch = () => {
    setBoard(Array(9).fill(null));
    setHumanMoves([]);
    setBotMoves([]);
    setWinner(null);
    setCurrentTurn("HUMAN");
    setShowPrompt(false);
  };

  // Render each cell
  const renderCell = (index: number) => {
    let content = "";
    let highlight = false;
    if (board[index] === "HUMAN") {
      content = playerChar;
      if (
        currentTurn === "HUMAN" &&
        humanMoves.length === 3 &&
        humanMoves[0] === index
      ) {
        highlight = true;
      }
    } else if (board[index] === "BOT") {
      content = botChar;
      if (
        currentTurn === "BOT" &&
        botMoves.length === 3 &&
        botMoves[0] === index
      ) {
        highlight = true;
      }
    }
    return (
      <div
        key={index}
        onClick={() => handleCellClick(index)}
        className={`w-20 h-20 md:w-32 md:h-32 border-4 border-gray-400 flex items-center justify-center text-3xl cursor-pointer ${
          highlight ? "bg-yellow-200" : ""
        }`}
      >
        {content}
      </div>
    );
  };

  return (
    <div className="relative flex flex-col items-center min-h-screen p-4">
      {/* Surrender Button */}
      <div className="absolute top-4 right-4 z-50">
        <SurrenderButton onClick={handleSurrender} />
      </div>

      {/* Turn/Status Panel */}
      <div className="mb-4">
        <h2 className="text-xl font-bold">Single Player</h2>

        {!winner ? (
          <p className="mt-2">
            Current Turn:{" "}
            {currentTurn === "HUMAN"
              ? `You (${playerChar})`
              : `Bot (${botChar})`}
          </p>
        ) : (
          <p className="mt-2 text-green-600 font-bold">{winner}</p>
        )}
        {winner && (
          <button
            className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded"
            onClick={() => setShowPrompt(true)}
          >
            Play Again
          </button>
        )}
      </div>

      {/* Board */}
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 9 }).map((_, i) => renderCell(i))}
      </div>

      {/* Move History */}
      <ScoreBoard />
      <div className="mt-4">
        <p>
          Human moves:{" "}
          {humanMoves.map((move) => indexToPosition(move)).join(", ")}
        </p>
        <p>
          Bot moves: {botMoves.map((move) => indexToPosition(move)).join(", ")}
        </p>
      </div>

      {/* Rematch Modal */}
      {showPrompt && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Game Over</h2>
            <div className="flex flex-col gap-4">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded"
                onClick={handleRematch}
              >
                Rematch
              </button>
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded"
                onClick={() => window.location.reload()}
              >
                Quit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
