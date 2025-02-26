"use client";
import { useState, useEffect } from "react";
import { checkWin, getRandomMove } from "@/utils/botLogic";
import { getStrongMinimaxMove } from "@/utils/strongMinimax";

type SinglePlayerGameBoardProps = {
  humanChar: string;
  botChar: string;
  difficulty: "easy" | "medium" | "hard";
  onChangeSymbol?: () => void;
  onMainMenu?: () => void;
};

export const SinglePlayerGameBoard = ({
  humanChar,
  botChar,
  difficulty,
  onChangeSymbol,
  onMainMenu,
}: SinglePlayerGameBoardProps) => {
  // Board state: 9 cells where each is either null, "HUMAN", or "BOT"
  const [board, setBoard] = useState<Array<"HUMAN" | "BOT" | null>>(
    Array(9).fill(null)
  );
  // Move histories for human and bot.
  const [humanMoves, setHumanMoves] = useState<number[]>([]);
  const [botMoves, setBotMoves] = useState<number[]>([]);
  // Whose turn: "HUMAN" or "BOT"
  const [currentTurn, setCurrentTurn] = useState<"HUMAN" | "BOT">("HUMAN");
  // Winner (if any)
  const [winner, setWinner] = useState<string | null>(null);
  // Control for showing the rematch modal
  const [showPrompt, setShowPrompt] = useState(false);
  // Timer for human's turn (only used in HARD mode)
  const [humanTimer, setHumanTimer] = useState<number>(5);

  // Start a timer on human's turn if difficulty is HARD.
  useEffect(() => {
    if (difficulty === "hard" && currentTurn === "HUMAN" && !winner) {
      const timerId = setInterval(() => {
        setHumanTimer((prev) => {
          if (prev === 1) {
            clearInterval(timerId);
            // Timer expired: force switch to bot's turn.
            setCurrentTurn("BOT");
            return 5; // reset timer for next human turn
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [difficulty, currentTurn, winner]);

  // When it's the bot's turn, trigger its move after a short delay.
  useEffect(() => {
    if (currentTurn === "BOT" && !winner) {
      const botMoveTimeout = setTimeout(() => {
        const move =
          difficulty === "easy"
            ? getRandomMove(board)
            : getStrongMinimaxMove(board, humanMoves, botMoves);
        if (move !== -1) {
          handleMove(move, "BOT");
        }
      }, 500);
      return () => clearTimeout(botMoveTimeout);
    }
  }, [currentTurn, winner, board, humanMoves, botMoves, difficulty]);

  // Common function to handle a move (for either human or bot).
  const handleMove = (index: number, player: "HUMAN" | "BOT") => {
    if (board[index] !== null || winner) return;

    const newBoard = [...board];

    if (player === "HUMAN") {
      const newMoves = [...humanMoves];
      // If already three markers, remove the oldest before adding the new one.
      if (newMoves.length === 3) {
        newBoard[newMoves[0]] = null;
        newMoves.shift();
      }
      newBoard[index] = "HUMAN";
      newMoves.push(index);
      if (newMoves.length === 3 && checkWin(newMoves)) {
        setWinner("You win!");
        setBoard(newBoard);
        return;
      }
      setHumanMoves(newMoves);
      setBoard(newBoard);
      setHumanTimer(5);
      setCurrentTurn("BOT");
    } else {
      const newMoves = [...botMoves];
      if (newMoves.length === 3) {
        newBoard[newMoves[0]] = null;
        newMoves.shift();
      }
      newBoard[index] = "BOT";
      newMoves.push(index);
      if (newMoves.length === 3 && checkWin(newMoves)) {
        setWinner("Bot wins!");
        setBoard(newBoard);
        return;
      }
      setBotMoves(newMoves);
      setBoard(newBoard);
      setCurrentTurn("HUMAN");
      setHumanTimer(5);
    }
  };

  const handleCellClick = (index: number) => {
    if (currentTurn !== "HUMAN" || winner) return;
    handleMove(index, "HUMAN");
  };

  const renderCell = (index: number) => {
    let cellContent = "";
    let highlight = false;
    if (board[index] === "HUMAN") {
      cellContent = humanChar;
      if (
        currentTurn === "HUMAN" &&
        humanMoves.length === 3 &&
        humanMoves[0] === index
      ) {
        highlight = true;
      }
    } else if (board[index] === "BOT") {
      cellContent = botChar;
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
        {cellContent}
      </div>
    );
  };

  const handleRematch = () => {
    setBoard(Array(9).fill(null));
    setHumanMoves([]);
    setBotMoves([]);
    setWinner(null);
    setCurrentTurn("HUMAN");
    setShowPrompt(false);
    setHumanTimer(5);
  };

  const handleChangeSymbol = () => {
    setShowPrompt(false);
    if (onChangeSymbol) onChangeSymbol();
  };

  const handleMainMenu = () => {
    setShowPrompt(false);
    if (onMainMenu) onMainMenu();
  };

  return (
    <div className="relative flex flex-col md:flex-row min-h-screen">
      {/* Left Panel: Turn indicator and (if HARD) timer */}
      <div className="w-full md:w-1/4 p-4 border-b md:border-b-0 md:border-r">
        <h2 className="text-xl font-bold mb-2">Current Turn</h2>
        <p>
          {currentTurn === "HUMAN" ? `You (${humanChar})` : `Bot (${botChar})`}
        </p>
        {difficulty === "hard" && currentTurn === "HUMAN" && (
          <p className="mt-2 text-red-500">Time left: {humanTimer}</p>
        )}
        {winner && <p className="mt-4 text-green-600 font-bold">{winner}</p>}
        {winner && (
          <button
            className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded"
            onClick={() => setShowPrompt(true)}
          >
            Play Again
          </button>
        )}
      </div>
      {/* Center Panel: Board */}
      <div className="w-full md:w-2/4 p-4 flex justify-center items-center">
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 9 }).map((_, index) => renderCell(index))}
        </div>
      </div>
      {/* Right Panel: Move History */}
      <div className="w-full md:w-1/4 p-4 border-t md:border-t-0 md:border-l">
        <h2 className="text-xl font-bold mb-2">Move History</h2>
        <p>You: {humanMoves.join(", ")}</p>
        <p>Bot: {botMoves.join(", ")}</p>
      </div>
      {/* Modal Prompt for Rematch */}
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
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={handleChangeSymbol}
              >
                Change Symbol
              </button>
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded"
                onClick={handleMainMenu}
              >
                Main Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
