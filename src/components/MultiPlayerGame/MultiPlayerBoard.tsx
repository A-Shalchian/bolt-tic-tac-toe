"use client";
import React, { useEffect } from "react";
import { ScoreBoard } from "../shared/ScoreBoard";
import { BaseBoard, useGameBoard } from "../shared/BaseBoard";

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
  const {
    board,
    player1Moves,
    setPlayer1Moves,
    player2Moves,
    setPlayer2Moves,
    currentTurn,
    setCurrentTurn,
    winner,
    setWinner,
    showPrompt,
    setShowPrompt,
    player1Score,
    setPlayer1Score,
    player2Score,
    setPlayer2Score,
    handleRematch,
    updateMoves,
  } = useGameBoard("P1");

  // Timer
  const [turnTimer, setTurnTimer] = React.useState<number>(
    timed ? timeLimit : 0
  );

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

  // Handle cell click
  const handleCellClick = (index: number) => {
    if (winner) return;
    if (board[index] !== null) return;

    if (currentTurn === "P1") {
      const hasWon = updateMoves(
        index,
        "P1",
        player1Moves,
        setPlayer1Moves,
        "Player 1 wins!",
        () => setPlayer1Score(player1Score + 1)
      );

      if (!hasWon) {
        setCurrentTurn("P2");
      }
    } else {
      const hasWon = updateMoves(
        index,
        "P2",
        player2Moves,
        setPlayer2Moves,
        "Player 2 wins!",
        () => setPlayer2Score(player2Score + 1)
      );

      if (!hasWon) {
        setCurrentTurn("P1");
      }
    }
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

  const renderLeftPanel = () => (
    <>
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
    </>
  );

  const renderRightPanel = () => (
    <>
      <ScoreBoard />
      <h2 className="text-xl font-bold mb-2">Move History</h2>
      <p>Player 1 moves: {player1Moves.join(", ")}</p>
      <p>Player 2 moves: {player2Moves.join(", ")}</p>
    </>
  );

  return (
    <BaseBoard
      player1Char={player1Char}
      player2Char={player2Char}
      gameType="multi"
      onSurrender={handleSurrender}
      renderCell={renderCell}
      renderLeftPanel={renderLeftPanel}
      renderRightPanel={renderRightPanel}
      showRematchPrompt={showPrompt}
      onRematch={handleRematch}
    />
  );
};
