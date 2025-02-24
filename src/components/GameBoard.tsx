import { useState } from "react";

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
};

export const GameBoard = ({ player1Char, player2Char }: Props) => {
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

    // Create a copy of the board and mark the new move.
    const newBoard = [...board];

    if (currentTurn === "P1") {
      let newMoves = [...player1Moves];
      if (newMoves.length === 3) {
        newBoard[newMoves[0]] = null;
        newMoves.shift();
      }

      newBoard[index] = "P1";
      newMoves.push(index);

      if (newMoves.length === 3 && checkWin(newMoves)) {
        setWinner("Player 1 Wins!");
        setBoard(newBoard);
        return;
      }
      setPlayer1Moves(newMoves);
    } else {
      let newMoves = [...player2Moves];

      if (newMoves.length === 3) {
        newBoard[newMoves[0]] = null;
        newMoves.shift();
      }

      newBoard[index] = "P2";
      newMoves.push(index);

      if (newMoves.length === 3 && checkWin(newMoves)) {
        setWinner("Player 2 Wins!");
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
  // Also, if it's the oldest move for the current player, add a highlight.
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
        className={`w-20 h-20 border flex items-center justify-center text-3xl cursor-pointer ${
          highlight ? "bg-yellow-200" : ""
        }`}
      >
        {cellContent}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side: Turn indicator */}
      <div className="w-1/4 p-4 border-r">
        <h2 className="text-xl font-bold mb-2">Current Turn</h2>
        <p>
          {currentTurn === "P1"
            ? `Player 1 (${player1Char})`
            : `Player 2 (${player2Char})`}
        </p>
        {winner && <p className="mt-4 text-green-600 font-bold">{winner}</p>}
      </div>
      {/* Center: Tic Tac Toe board */}
      <div className="w-2/4 p-4 flex justify-center items-center">
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 9 }).map((_, index) => renderCell(index))}
        </div>
      </div>
      {/* Right side: Additional information (e.g. move history) */}
      <div className="w-1/4 p-4 border-l">
        <h2 className="text-xl font-bold mb-2">Move History</h2>
        <p>Player 1 moves: {player1Moves.join(", ")}</p>
        <p>Player 2 moves: {player2Moves.join(", ")}</p>
      </div>
    </div>
  );
};
