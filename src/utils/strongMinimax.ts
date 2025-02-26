import { checkWin, getRandomMove } from "./botLogic";

// A stronger minimax algorithm with alpha–beta pruning and depth limiting.
function strongMinimax(
  board: Array<"HUMAN" | "BOT" | null>,
  humanMoves: number[],
  botMoves: number[],
  isMaximizing: boolean,
  depth: number,
  alpha: number,
  beta: number
): number {
  // Base case: depth limit reached.
  if (depth === 0) return 0;

  // Terminal conditions:
  if (humanMoves.length === 3 && checkWin(humanMoves)) return -10;
  if (botMoves.length === 3 && checkWin(botMoves)) return 10;

  // Get available moves.
  const available = board
    .map((cell, idx) => (cell === null ? idx : null))
    .filter((v) => v !== null) as number[];
  if (available.length === 0) return 0;

  let bestScore = isMaximizing ? -Infinity : Infinity;

  for (const move of available) {
    // Clone state.
    const newBoard = [...board];
    const newHumanMoves = [...humanMoves];
    const newBotMoves = [...botMoves];

    const player = isMaximizing ? "BOT" : "HUMAN";

    // Simulate sliding: if the player already has 3 moves, remove the oldest.
    if (player === "HUMAN" && newHumanMoves.length === 3) {
      newBoard[newHumanMoves[0]] = null;
      newHumanMoves.shift();
    }
    if (player === "BOT" && newBotMoves.length === 3) {
      newBoard[newBotMoves[0]] = null;
      newBotMoves.shift();
    }
    // Make the move.
    newBoard[move] = player;
    if (player === "HUMAN") {
      newHumanMoves.push(move);
    } else {
      newBotMoves.push(move);
    }

    // Recurse: toggle isMaximizing and reduce depth.
    const score = strongMinimax(
      newBoard,
      newHumanMoves,
      newBotMoves,
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
    if (beta <= alpha) break; // Prune branch.
  }
  return bestScore;
}

/**
 * Determines the best move for the BOT using the strong minimax algorithm.
 *
 * @param board - The current board state.
 * @param humanMoves - Array of indices for HUMAN moves.
 * @param botMoves - Array of indices for BOT moves.
 * @returns The chosen move index.
 */
export function getStrongMinimaxMove(
  board: Array<"HUMAN" | "BOT" | null>,
  humanMoves: number[],
  botMoves: number[]
): number {
  let bestScore = -Infinity;
  let bestMove = -1;
  const available = board
    .map((cell, idx) => (cell === null ? idx : null))
    .filter((v) => v !== null) as number[];

  // Set a depth limit for the search; adjust this value as needed.
  const DEPTH_LIMIT = 5;

  for (const move of available) {
    const newBoard = [...board];
    const newHumanMoves = [...humanMoves];
    const newBotMoves = [...botMoves];

    if (newBotMoves.length === 3) {
      newBoard[newBotMoves[0]] = null;
      newBotMoves.shift();
    }
    newBoard[move] = "BOT";
    newBotMoves.push(move);

    const score = strongMinimax(
      newBoard,
      newHumanMoves,
      newBotMoves,
      false, // Next turn is HUMAN
      DEPTH_LIMIT,
      -Infinity,
      Infinity
    );
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }
  return bestMove === -1 ? getRandomMove(board) : bestMove;
}
