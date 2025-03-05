"use client";
import React, { useState, useEffect } from "react";
import { SurrenderButton } from "../buttons/SurrenderButton";
import { ScoreBoard } from "../shared/ScoreBoard";
import { checkWin } from "@/utils/botLogic";
import { useGameContext } from "@/context/GameContext";

type Cell = "P1" | "P2" | null;

type MultiPlayerBoardProps = {
  timed: boolean;
  timeLimit: number;
  player1Char: string;
  player2Char: string;
};

/**
 * MultiPlayerBoard:
 * - Two human players (P1 and P2).
 * - Sliding mechanic (3 markers max).
 * - Optional timer per turn if `timed` is true.
 * - Surrender button: whichever player's turn it is, the other player wins.
 */
export const MultiPlayerBoard: React.FC<MultiPlayerBoardProps> = ({
  timed,
  timeLimit,
  player1Char,
  player2Char,
}) => {
  // 9 cells, each either "P1", "P2", or null
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  // Move histories
  const [player1Moves, setPlayer1Moves] = useState<number[]>([]);
  const [player2Moves, setPlayer2Moves] = useState<number[]>([]);
  // Turn
  const [currentTurn, setCurrentTurn] = useState<"P1" | "P2">("P1");
  // Winner message
  const [winner, setWinner] = useState<string | null>(null);
  // Show prompt for rematch
  const [showPrompt, setShowPrompt] = useState(false);
  // Timer
  const [turnTimer, setTurnTimer] = useState<number>(timed ? timeLimit : 0);
  const { player1Score, setPlayer1Score, player2Score, setPlayer2Score } =
    useGameContext();

  // Reset timer on turn change
  useEffect(() => {
    if (timed) {
      setTurnTimer(timeLimit);
    }
  }, [currentTurn, timed, timeLimit]);

  // Timer countdown effect
  useEffect(() => {
    if (timed && !winner) {
      const timerId = setInterval(() => {
        setTurnTimer((prev) => {
          if (prev === 1) {
            clearInterval(timerId);
            // Time's up => switch turn
            setCurrentTurn(currentTurn === "P1" ? "P2" : "P1");
            return timeLimit;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [timed, winner, currentTurn, timeLimit]);

  // Check for win with sliding mechanic
  const checkForWin = (moves: number[]): boolean => {
    if (moves.length < 3) return false;
    return checkWin(moves);
  };

  // Handle cell click
  const handleCellClick = (index: number) => {
    if (winner) return;
    if (board[index] !== null) return;

    const newBoard = [...board];
    if (currentTurn === "P1") {
      const newMoves = [...player1Moves];
      if (newMoves.length === 3) {
        newBoard[newMoves[0]] = null;
        newMoves.shift();
      }
      newBoard[index] = "P1";
      newMoves.push(index);
      if (newMoves.length === 3 && checkForWin(newMoves)) {
        setWinner("Player 1 wins!");
        setPlayer1Score(player1Score + 1);
        setBoard(newBoard);
        return;
      }
      setPlayer1Moves(newMoves);
    } else {
      const newMoves = [...player2Moves];
      if (newMoves.length === 3) {
        newBoard[newMoves[0]] = null;
        newMoves.shift();
      }
      newBoard[index] = "P2";
      newMoves.push(index);
      if (newMoves.length === 3 && checkForWin(newMoves)) {
        setWinner("Player 2 wins!");
        setPlayer2Score(player2Score + 1);
        setBoard(newBoard);
        return;
      }
      setPlayer2Moves(newMoves);
    }

    setBoard(newBoard);
    setCurrentTurn(currentTurn === "P1" ? "P2" : "P1");
  };

  // Surrender
  const handleSurrender = () => {
    if (winner) return;
    if (currentTurn === "P1") {
      setWinner("Player 2 wins by surrender!");
      setPlayer2Score(player2Score + 1);
    } else {
      setWinner("Player 1 wins by surrender!");
      setPlayer1Score(player1Score + 1);
    }
  };

  // Reset game
  const handleRematch = () => {
    setBoard(Array(9).fill(null));
    setPlayer1Moves([]);
    setPlayer2Moves([]);
    setWinner(null);
    setCurrentTurn("P1");
    setShowPrompt(false);
  };

  // Render cell
  const renderCell = (index: number) => {
    let content = "";
    let highlight = false;
    if (board[index] === "P1") {
      content = player1Char;
      if (
        currentTurn === "P1" &&
        player1Moves.length === 3 &&
        player1Moves[0] === index
      ) {
        highlight = true;
      }
    } else if (board[index] === "P2") {
      content = player2Char;
      if (
        currentTurn === "P2" &&
        player2Moves.length === 3 &&
        player2Moves[0] === index
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
    <div className="relative flex flex-col md:flex-row min-h-screen">
      {/* Surrender Button (top-right, high z-index) */}
      <div className="absolute -top-8 right-4 z-50">
        <SurrenderButton onClick={handleSurrender} />
      </div>

      {/* Left panel: Turn info */}
      <div className="w-full md:w-1/4 p-4 border-b md:border-b-0 md:border-r">
        <h2 className="text-xl font-bold mb-2">Multiplayer</h2>
        {!winner ? (
          <>
            <p>
              Current Turn:{" "}
              {currentTurn === "P1"
                ? `Player 1 (${player1Char})`
                : `Player 2 (${player2Char})`}
            </p>
            {timed && (
              <p className="mt-2 text-red-500">
                Time left: {turnTimer} second{turnTimer !== 1 && "s"}
              </p>
            )}
          </>
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

      {/* Center: Board */}
      <div className="w-full md:w-2/4 p-4 flex justify-center items-start">
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 9 }).map((_, i) => renderCell(i))}
        </div>
      </div>

      {/* Right panel: Move history */}
      <div className="w-full md:w-1/4 p-4 border-t md:border-t-0 md:border-l">
        <ScoreBoard />
        <h2 className="text-xl font-bold mb-2">Move History</h2>
        <p>Player 1 moves: {player1Moves.join(", ")}</p>
        <p>Player 2 moves: {player2Moves.join(", ")}</p>
      </div>

      {/* Modal: Play Again */}
      {showPrompt && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-20 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Game Over</h2>
            <div className="flex flex-col gap-4">
              <button
                className="px-4 py-2 bg-green-500 btn-texts"
                onClick={handleRematch}
              >
                Rematch
              </button>
              <button
                className="px-4 py-2 bg-gray-500 btn-texts"
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
