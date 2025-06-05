// "use client";

// import React from 'react';
// import { useGameStore } from './index';

// export const GameControlsExample = () => {
//   // With Zustand, you only subscribe to the parts of the state you need
//   // This creates more efficient renders
//   const phase = useGameStore(state => state.phase);
//   const setPhase = useGameStore(state => state.setPhase);
//   const gameMode = useGameStore(state => state.gameMode);
//   const setGameMode = useGameStore(state => state.gameMode);
//   const player1Score = useGameStore(state => state.player1Score);
//   const player2Score = useGameStore(state => state.player2Score);
//   const incrementPlayer1Score = useGameStore(state => state.incrementPlayer1Score);
  
//   // You can also use the entire state if needed
//   // const gameState = useGameStore();
  
//   return (
//     <div className="game-controls">
//       <h2>Game Controls</h2>
//       <p>Current Phase: {phase}</p>
//       <p>Game Mode: {gameMode}</p>
//       <div className="score-display">
//         <p>Player 1: {player1Score}</p>
//         <p>Player 2: {player2Score}</p>
//       </div>
//       <div className="controls">
//         <button onClick={() => setPhase("game")}>Start Game</button>
//         <button onClick={() => setPhase("mainMenu")}>Back to Menu</button>
//         <button onClick={incrementPlayer1Score}>Add Point to Player 1</button>
//       </div>
//     </div>
//   );
// };

// // If you're using the compatibility layer during migration:
// export const GameControlsWithCompatibilityLayer = () => {
//   // Using the compatibility hooks that match the original context API
//   const { phase, setPhase, gameMode } = useGamePhase();
//   const { player1Score, player2Score, incrementPlayer1Score } = useScoreContext();
  
//   return (
//     <div className="game-controls">
//       <h2>Game Controls (Using Compatibility Layer)</h2>
//       <p>Current Phase: {phase}</p>
//       <p>Game Mode: {gameMode}</p>
//       <div className="score-display">
//         <p>Player 1: {player1Score}</p>
//         <p>Player 2: {player2Score}</p>
//       </div>
//       <div className="controls">
//         <button onClick={() => setPhase("game")}>Start Game</button>
//         <button onClick={() => setPhase("mainMenu")}>Back to Menu</button>
//         <button onClick={incrementPlayer1Score}>Add Point to Player 1</button>
//       </div>
//     </div>
//   );
// };
