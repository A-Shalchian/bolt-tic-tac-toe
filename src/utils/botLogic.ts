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

/**
 * Checks if the provided moves (cell indices) form a winning combination.
 * @param moves - An array of cell indices.
 * @returns true if a winning pattern is present.
 */
export const checkWin = (moves: number[]): boolean => {
  return winPatterns.some((pattern) =>
    pattern.every((cell) => moves.includes(cell))
  );
};

/**
 * Returns a random available move index from the board.
 * @param board - Array representing the board.
 * @returns A random available cell index, or -1 if none available.
 */
export const getRandomMove = (board: Array<"HUMAN" | "BOT" | null>): number => {
  const available = board
    .map((cell, idx) => (cell === null ? idx : null))
    .filter((v) => v !== null) as number[];
  if (available.length === 0) return -1;
  const randomIndex = Math.floor(Math.random() * available.length);
  return available[randomIndex];
};
