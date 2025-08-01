"use client";
import React, { useEffect, useCallback, memo } from "react";
import { getEasyMove, getMediumMove, getHardMove } from "@/utils/botLogic";
import { BaseBoard, useGameBoard } from "../shared/BaseBoard";
import { ScoreBoard } from "../shared/ScoreBoard";
import { useBoardCellTouch } from "@/hooks/useMobileTouch";
import { useStableCallback, useRenderPerformance } from "@/hooks/usePerformance";



// Define specific cell types for single player
type PlayerCell = "HUMAN" | "BOT" | null;

type SinglePlayerBoardProps = {
  difficulty: "easy" | "medium" | "hard";
  playerChar: string;
  botChar: string;
};

export const SinglePlayerBoard: React.FC<SinglePlayerBoardProps> = memo(({
  difficulty,
  playerChar,
  botChar,
}) => {
  // Performance monitoring in development
  useRenderPerformance('SinglePlayerBoard');
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
  } = useGameBoard("HUMAN");

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

  // Bot picks a move based on difficulty
  const makeBotMove = useCallback(() => {
    if (winner) return;
    let move: number;

    // Cast the board to the specific type expected by the bot logic functions
    const typedBoard = board as PlayerCell[];

    if (difficulty === "easy") {
      move = getEasyMove(typedBoard, player1Moves, player2Moves);
    } else if (difficulty === "medium") {
      move = getMediumMove(typedBoard, player1Moves, player2Moves);
    } else {
      move = getHardMove(typedBoard, player1Moves, player2Moves);
    }

    if (move === -1) {
      setWinner("It's a tie!");
      return;
    }

    const hasWon = updateMoves(
      move,
      "BOT",
      player2Moves,
      setPlayer2Moves,
      "Bot wins!",
      () => setPlayer2Score(player2Score + 1)
    );

    if (!hasWon) {
      setCurrentTurn("HUMAN");
    }
  }, [winner, board, difficulty, player1Moves, player2Moves, updateMoves, setWinner, setPlayer2Moves, player2Score, setPlayer2Score, setCurrentTurn]);

  // If it's the bot's turn and there's no winner, pick a move.
  useEffect(() => {
    if (!winner && currentTurn === "BOT") {
      const timer = setTimeout(() => {
        makeBotMove();
      }, 750);
      return () => clearTimeout(timer);
    }
  }, [currentTurn, winner, makeBotMove]);

  // Human clicks a cell - optimized with useCallback
  const handleCellClick = useCallback((index: number) => {
    if (winner || currentTurn !== "HUMAN" || board[index] !== null) return;

    const hasWon = updateMoves(
      index,
      "HUMAN",
      player1Moves,
      setPlayer1Moves,
      "You win!",
      () => setPlayer1Score(player1Score + 1)
    );

    if (!hasWon) {
      setCurrentTurn("BOT");
    }
  }, [winner, currentTurn, board, updateMoves, player1Moves, setPlayer1Moves, setPlayer1Score, player1Score, setCurrentTurn]);

  // Surrender - optimized with useCallback
  const handleSurrender = useCallback(() => {
    if (!winner) {
      setWinner("Bot wins by surrender! +1 points");
      setPlayer2Score(player2Score + 1);
    }
  }, [winner, setWinner, setPlayer2Score, player2Score]);

  // Render cell
  const renderCell = (index: number) => {
    let content = "";
    let highlight = false;
    if (board[index] === "HUMAN") {
      content = playerChar;
      if (
        currentTurn === "HUMAN" &&
        player1Moves.length === 3 &&
        player1Moves[0] === index
      ) {
        highlight = true;
      }
    } else if (board[index] === "BOT") {
      content = botChar;
      if (
        currentTurn === "BOT" &&
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
          highlight ? "flash-highlight" : ""
        }`}
      >
        {content}
      </div>
    );
  };

  const renderLeftPanel = () => (
    <>
      <h2 className="text-xl font-bold mb-2">Single Player</h2>
      {!winner ? (
        <p className="mt-2">
          Current Turn:{" "}
          {currentTurn === "HUMAN" ? `You (${playerChar})` : `Bot (${botChar})`}
        </p>
      ) : (
        <p className="mt-2 text-green-600 font-bold">{winner}</p>
      )}
    </>
  );

  const renderRightPanel = () => (
    <>
      
      
      <ScoreBoard />
      <div className="mt-4">
        <p className="font-semibold">
          Your moves:{" "}
          {player1Moves.map((move) => indexToPosition(move)).join(", ")}
        </p>
        <br />
        <p className="font-semibold">
          Bot moves:{" "}
          {player2Moves.map((move) => indexToPosition(move)).join(", ")}
        </p>
      </div>
    </>
  );

  return (
    <BaseBoard
      player1Char={playerChar}
      player2Char={botChar}
      gameType="single"
      onSurrender={handleSurrender}
      renderCell={renderCell}
      renderLeftPanel={renderLeftPanel}
      renderRightPanel={renderRightPanel}
      showRematchPrompt={showPrompt}
      onRematch={handleRematch}
      onClose={() => setShowPrompt(false)}
      onShowPrompt={() => setShowPrompt(true)}
      winner={winner}
    />
  );
});

SinglePlayerBoard.displayName = 'SinglePlayerBoard';
