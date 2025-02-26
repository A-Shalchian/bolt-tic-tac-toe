import { useState, useEffect } from "react";

// Standard win patterns for a 3x3 tic tac toe board.
const winPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

type Props = {
  player1Char: string;
  player2Char: string;
  // Callbacks for changing symbol or going to main menu.
  onChangeSymbol?: () => void;
  onMainMenu?: () => void;
  timed?: boolean;
  timeLimit?: number;
};

export const GameBoard = ({
  player1Char,
  player2Char,
  onChangeSymbol,
  onMainMenu,
  timed = false,
  timeLimit = 0,
}: Props) => {
  // The board is represented as an array of 9 cells.
  // Each cell is either null, "P1", or "P2".
  const [board, setBoard] = useState<Array<"P1" | "P2" | null>>(
    Array(9).fill(null)
  );
  // Keep track of the move history (order of cell indices) for each player.
  const [player1Moves, setPlayer1Moves] = useState<number[]>([]);
  const [player2Moves, setPlayer2Moves] = useState<number[]>([]);
  // Whose turn it is: "P1" or "P2".
  const [currentTurn, setCurrentTurn] = useState<"P1" | "P2">("P1");
  // Winner message (if any).
  const [winner, setWinner] = useState<string | null>(null);
  // Control for showing the play again prompt.
  const [showPrompt, setShowPrompt] = useState(false);
  const [turnTimer, setTurnTimer] = useState<number>(timed ? timeLimit : 0);

  // Whenever the turn changes, reset the timer (if timed).
  useEffect(() => {
    if (timed) {
      setTurnTimer(timeLimit);
    }
  }, [currentTurn, timed, timeLimit]);

  // If the game is timed, decrement the timer every second.
  useEffect(() => {
    if (timed && !winner) {
      const timerId = setInterval(() => {
        setTurnTimer((prev) => {
          if (prev === 1) {
            clearInterval(timerId);
            // Time expired; switch turns.
            setCurrentTurn(currentTurn === "P1" ? "P2" : "P1");
            return timeLimit;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [timed, winner, currentTurn, timeLimit]);

  // Check if the given three cell indices form a winning combination.
  const checkWin = (moves: number[]): boolean => {
    return winPatterns.some((pattern) =>
      pattern.every((cell) => moves.includes(cell))
    );
  };

  // Handler when a cell is clicked.
  const handleCellClick = (index: number) => {
    if (winner) return; // If the game is over, do nothing.
    if (board[index] !== null) return; // Do not allow moves in occupied cells.

    const newBoard = [...board];

    if (currentTurn === "P1") {
      const newMoves = [...player1Moves];
      // If already three markers, remove the oldest before adding the new one.
      if (newMoves.length === 3) {
        newBoard[newMoves[0]] = null;
        newMoves.shift();
      }
      // Place the new move.
      newBoard[index] = "P1";
      newMoves.push(index);
      // Check for win after update.
      if (newMoves.length === 3 && checkWin(newMoves)) {
        setWinner("Player 1 wins!");
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
      if (newMoves.length === 3 && checkWin(newMoves)) {
        setWinner("Player 2 wins!");
        setBoard(newBoard);
        return;
      }
      setPlayer2Moves(newMoves);
    }

    setBoard(newBoard);
    // Switch turns.
    setCurrentTurn(currentTurn === "P1" ? "P2" : "P1");
  };

  // Render a single cell. If it's occupied, display the player's symbol.
  // Also, if it's the current player's turn and they have 3 moves, highlight the oldest move.
  const renderCell = (index: number) => {
    let cellContent = "";
    let highlight = false;
    if (board[index] === "P1") {
      cellContent = player1Char;
      if (
        currentTurn === "P1" &&
        player1Moves.length === 3 &&
        player1Moves[0] === index
      ) {
        highlight = true;
      }
    } else if (board[index] === "P2") {
      cellContent = player2Char;
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
        className={`md:w-32 md:h-32 w-20 h-20 border-4 border-gray-400 flex items-center justify-center text-3xl cursor-pointer ${
          highlight ? "bg-yellow-200" : ""
        }`}
      >
        {cellContent}
      </div>
    );
  };

  // Reset game state for a rematch.
  const handleRematch = () => {
    setBoard(Array(9).fill(null));
    setPlayer1Moves([]);
    setPlayer2Moves([]);
    setWinner(null);
    setCurrentTurn("P1");
    setShowPrompt(false);
  };

  // Called when the user wants to change symbols.
  const handleChangeSymbol = () => {
    setShowPrompt(false);
    // Invoke the callback if provided.
    if (onChangeSymbol) onChangeSymbol();
  };

  // Called when the user wants to go back to the main menu.
  const handleMainMenu = () => {
    setShowPrompt(false);
    if (onMainMenu) onMainMenu();
  };

  return (
    <div className="relative flex flex-col md:flex-row min-h-screen">
      {/* Left side: Turn indicator and Timer */}
      <div className="w-full md:w-1/4 p-4 border-b md:border-b-0 md:border-r">
        <h2 className="text-xl font-bold mb-2">Current Turn</h2>
        <p>
          {currentTurn === "P1"
            ? `Player 1 (${player1Char})`
            : `Player 2 (${player2Char})`}
        </p>
        {timed && (
          <p className="mt-2 text-red-500">
            Time left: {turnTimer} second{turnTimer !== 1 && "s"}
          </p>
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
      {/* Center: Tic Tac Toe board */}
      <div className="w-full md:w-2/4 p-4 flex justify-center items-center">
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 9 }).map((_, index) => renderCell(index))}
        </div>
      </div>
      {/* Right side: Additional information (e.g., move history) */}
      <div className="w-full md:w-1/4 p-4 border-t md:border-t-0 md:border-l">
        <h2 className="text-xl font-bold mb-2">Move History</h2>
        <p>Player 1 moves: {player1Moves.join(", ")}</p>
        <p>Player 2 moves: {player2Moves.join(", ")}</p>
      </div>

      {/* Modal prompt overlay for play again options */}
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
