// botLogic.ts

// Example checkWin function
export function checkWin(moves: number[]): boolean {
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
  return winPatterns.some((pattern) =>
    pattern.every((cell) => moves.includes(cell))
  );
}

/**
 * Alpha–beta minimax function with a variable depth limit.
 *
 * @param board - The board array of 9 cells: "HUMAN", "BOT", or null
 * @param humanMoves - Indices occupied by the human
 * @param botMoves - Indices occupied by the bot
 * @param isMaximizing - True if it's the bot's turn, false if it's the human's turn
 * @param depth - Remaining depth limit
 * @param alpha - Alpha for alpha–beta pruning
 * @param beta - Beta for alpha–beta pruning
 * @returns a score representing how good the position is for the bot
 */
function minimaxWithDepth(
  board: Array<"HUMAN" | "BOT" | null>,
  humanMoves: number[],
  botMoves: number[],
  isMaximizing: boolean,
  depth: number,
  alpha: number,
  beta: number
): number {
  // 1. Depth limit reached
  if (depth === 0) {
    return 0;
  }

  // 2. Terminal checks
  if (humanMoves.length === 3 && checkWin(humanMoves)) {
    return -10;
  }
  if (botMoves.length === 3 && checkWin(botMoves)) {
    return 10;
  }

  // 3. Available moves
  const available = board
    .map((cell, idx) => (cell === null ? idx : null))
    .filter((v) => v !== null) as number[];
  if (available.length === 0) {
    return 0; // Board full => tie
  }

  let bestScore = isMaximizing ? -Infinity : Infinity;

  for (const move of available) {
    const newBoard = [...board];
    const newHuman = [...humanMoves];
    const newBot = [...botMoves];

    const player = isMaximizing ? "BOT" : "HUMAN";

    // Sliding mechanic
    if (player === "HUMAN" && newHuman.length === 3) {
      newBoard[newHuman[0]] = null;
      newHuman.shift();
    }
    if (player === "BOT" && newBot.length === 3) {
      newBoard[newBot[0]] = null;
      newBot.shift();
    }

    newBoard[move] = player;
    if (player === "HUMAN") newHuman.push(move);
    else newBot.push(move);

    // Recurse
    const score = minimaxWithDepth(
      newBoard,
      newHuman,
      newBot,
      !isMaximizing,
      depth - 1,
      alpha,
      beta
    );

    if (isMaximizing) {
      bestScore = Math.max(bestScore, score);
      alpha = Math.max(alpha, bestScore);
    } else {
      bestScore = Math.min(bestScore, score);
      beta = Math.min(beta, bestScore);
    }

    if (beta <= alpha) break; // prune
  }

  return bestScore;
}

/**
 * A general function to get the bot's move using alpha–beta minimax,
 * given a specified depth limit.
 */
function getMinimaxMove(
  board: Array<"HUMAN" | "BOT" | null>,
  humanMoves: number[],
  botMoves: number[],
  depthLimit: number
): number {
  let bestScore = -Infinity;
  let bestMove = -1;

  // 1. Collect available moves
  const available = board
    .map((cell, idx) => (cell === null ? idx : null))
    .filter((v) => v !== null) as number[];
  if (available.length === 0) return -1; // No moves => tie or full board

  // 2. Evaluate each move
  for (const move of available) {
    const newBoard = [...board];
    const newHuman = [...humanMoves];
    const newBot = [...botMoves];

    // If the bot already has 3 markers, remove oldest
    if (newBot.length === 3) {
      newBoard[newBot[0]] = null;
      newBot.shift();
    }
    newBoard[move] = "BOT";
    newBot.push(move);

    // Minimizing next => human turn
    const score = minimaxWithDepth(
      newBoard,
      newHuman,
      newBot,
      false, // Next is human
      depthLimit,
      -Infinity,
      Infinity
    );

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }
  return bestMove;
}

/**
 * Easy difficulty: depth limit = 2
 */
export function getEasyMove(
  board: Array<"HUMAN" | "BOT" | null>,
  humanMoves: number[],
  botMoves: number[]
): number {
  return getMinimaxMove(board, humanMoves, botMoves, 2);
}

/**
 * Medium difficulty: depth limit = 3
 */
export function getMediumMove(
  board: Array<"HUMAN" | "BOT" | null>,
  humanMoves: number[],
  botMoves: number[]
): number {
  return getMinimaxMove(board, humanMoves, botMoves, 3);
}

/**
 * Hard difficulty: depth limit = 5
 */
export function getHardMove(
  board: Array<"HUMAN" | "BOT" | null>,
  humanMoves: number[],
  botMoves: number[]
): number {
  return getMinimaxMove(board, humanMoves, botMoves, 5);
}
