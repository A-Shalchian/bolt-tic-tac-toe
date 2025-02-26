"use client";
import { useState } from "react";
import { MainMenu } from "./MainMenu";
import { DifficultySelection } from "./DifficultySelection";
import { CharacterSelection } from "./CharacterSelection";
import { Countdown } from "./Countdown";
import { GameBoard } from "./GameBoard";
import { SinglePlayerGameBoard } from "./SinglePlayerGameBoard";
import { ArrowLeft } from "lucide-react";

export const Game = () => {
  const symbols = ["😀", "😎", "🚀", "🐱", "🔥", "🌟", "🍀"];
  // Phases: "mainMenu", "difficultySelection", "characterSelection", "countdown", "game"
  const [phase, setPhase] = useState("mainMenu");
  // Game mode: "multi" or "single"
  const [gameMode, setGameMode] = useState<"multi" | "single" | null>(null);
  // For single-player, store the selected difficulty.
  const [difficulty, setDifficulty] = useState<
    "easy" | "medium" | "hard" | null
  >(null);
  const [player1Char, setPlayer1Char] = useState<string | null>(null);
  const [player2Char, setPlayer2Char] = useState<string | null>(null);

  // Example: Score or other states could go here...

  // Mode selection handler.
  const handleModeSelect = (mode: "single" | "multi" | "online") => {
    if (mode === "multi") {
      setGameMode("multi");
      setPhase("characterSelection");
    } else if (mode === "single") {
      setGameMode("single");
      setPhase("difficultySelection");
    } else {
      alert("This mode is coming soon!");
    }
  };

  // Back button handler: set the phase to the previous state.
  const handleBack = () => {
    if (phase === "difficultySelection") {
      // Go back to main menu.
      setPhase("mainMenu");
    } else if (phase === "characterSelection") {
      if (gameMode === "single") {
        // In single-player, go back to difficulty selection.
        setPhase("difficultySelection");
        // Optionally clear the already selected symbol for Player 1.
        // setPlayer1Char(null);
      } else {
        // In multiplayer, go back to main menu.
        setPhase("mainMenu");
        // Optionally clear Player 1's symbol.
        // setPlayer1Char(null);
      }
    } else if (phase === "countdown") {
      // Go back to character selection.
      setPhase("characterSelection");
    } else if (phase === "game") {
      // Depending on your design, you might want to go back to countdown
      // or directly back to character selection. For this example:
      setPhase("characterSelection");
    }
  };

  // Render a Back button (if not in main menu) at a fixed position.
  const renderBackButton = () => {
    if (phase !== "mainMenu") {
      return (
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 px-4 py-2 bg-gray-200 text-gray-800 text-lg rounded-lg shadow hover:bg-gray-300 flex items-center"
        >
          <span>Back</span>
          <ArrowLeft className="ml-2" />
        </button>
      );
    }

    return null;
  };

  // --- Phase Rendering ---

  if (phase === "mainMenu") {
    return <MainMenu onModeSelect={handleModeSelect} />;
  }

  if (phase === "difficultySelection") {
    return (
      <div className="relative">
        {renderBackButton()}
        <DifficultySelection
          onSelect={(selectedDifficulty) => {
            setDifficulty(selectedDifficulty);
            setPhase("characterSelection");
          }}
        />
      </div>
    );
  }

  if (phase === "characterSelection") {
    return (
      <div className="relative">
        {renderBackButton()}
        {!player1Char ? (
          <CharacterSelection
            player="Player 1"
            availableSymbols={symbols}
            onSelect={(symbol) => setPlayer1Char(symbol)}
          />
        ) : !player2Char ? (
          gameMode === "single" ? (
            // In single-player, auto-assign bot symbol.
            (() => {
              const availableSymbols = symbols.filter((s) => s !== player1Char);
              setPlayer2Char(availableSymbols[0]);
              return null;
            })()
          ) : (
            <CharacterSelection
              player="Player 2"
              availableSymbols={symbols.filter((s) => s !== player1Char)}
              onSelect={(symbol) => setPlayer2Char(symbol)}
            />
          )
        ) : (
          <Countdown initialCount={3} onComplete={() => setPhase("game")} />
        )}
      </div>
    );
  }

  if (phase === "countdown") {
    return (
      <div className="relative">
        {renderBackButton()}
        <Countdown initialCount={3} onComplete={() => setPhase("game")} />
      </div>
    );
  }

  if (phase === "game") {
    return (
      <div className="relative">
        {renderBackButton()}
        {gameMode === "multi" ? (
          <GameBoard
            player1Char={player1Char!}
            player2Char={player2Char!}
            onChangeSymbol={() => {
              setPlayer1Char(null);
              setPlayer2Char(null);
              setPhase("characterSelection");
            }}
            onMainMenu={() => {
              setPlayer1Char(null);
              setPlayer2Char(null);
              setPhase("mainMenu");
            }}
          />
        ) : (
          <SinglePlayerGameBoard
            humanChar={player1Char!}
            botChar={player2Char!}
            difficulty={difficulty!}
            onChangeSymbol={() => {
              setPlayer1Char(null);
              setPlayer2Char(null);
              setPhase("characterSelection");
            }}
            onMainMenu={() => {
              setPlayer1Char(null);
              setPlayer2Char(null);
              setPhase("mainMenu");
            }}
          />
        )}
      </div>
    );
  }

  return null;
};
