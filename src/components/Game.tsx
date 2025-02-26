"use client";
import { useGameContext } from "@/context/GameContext";
import { MainMenu } from "./MainMenu";
import { TimeOptionSelection } from "./TimeOptionSelection";
import { TimeSetting } from "./TimeSetting";
import { DifficultySelection } from "./DifficultySelection";
import { CharacterSelectionPhase } from "./CharacterSelectionPhase";
import { Countdown } from "./Countdown";
import { GamePhase } from "./GamePhase";
import { BackButton } from "./buttons/BackButton";

export const Game = () => {
  const symbols = ["😀", "😎", "🚀", "🐱", "🔥", "🌟", "🍀"];

  // Destructure shared state from context
  const {
    phase,
    setPhase,
    gameMode,
    setGameMode,
    multiplayerTimer,
    setMultiplayerTimer,
    difficulty,
    setDifficulty,
    player1Char,
    setPlayer1Char,
    player2Char,
    setPlayer2Char,
  } = useGameContext();

  // Mode selection handler.
  const handleModeSelect = (mode: "single" | "multi" | "online") => {
    if (mode === "multi") {
      setGameMode("multi");
      setPhase("timeOptionSelection");
    } else if (mode === "single") {
      setGameMode("single");
      setPhase("difficultySelection");
    } else {
      alert("This mode is coming soon!");
    }
  };

  // Phase rendering using context values
  if (phase === "mainMenu") {
    return <MainMenu onModeSelect={handleModeSelect} />;
  }

  if (phase === "timeOptionSelection") {
    return (
      <div className="relative">
        <BackButton onClick={() => setPhase("mainMenu")} />
        <TimeOptionSelection
          onSelect={(timed) => {
            if (timed) {
              setPhase("timeSettings");
            } else {
              setMultiplayerTimer(0);
              setPhase("characterSelection");
            }
          }}
        />
      </div>
    );
  }

  if (phase === "timeSettings") {
    return (
      <div className="relative">
        <BackButton onClick={() => setPhase("timeOptionSelection")} />
        <TimeSetting
          onSelect={(time) => {
            setMultiplayerTimer(time);
            setPhase("characterSelection");
          }}
        />
      </div>
    );
  }

  if (phase === "difficultySelection") {
    return (
      <div className="relative">
        <BackButton onClick={() => setPhase("mainMenu")} />
        <DifficultySelection
          onSelect={(diff) => {
            setDifficulty(diff);
            setPhase("characterSelection");
          }}
        />
      </div>
    );
  }

  if (phase === "characterSelection") {
    return (
      <div className="relative">
        <BackButton
          onClick={() =>
            setPhase(gameMode === "single" ? "difficultySelection" : "mainMenu")
          }
        />
        <CharacterSelectionPhase
          symbols={symbols}
          gameMode={gameMode}
          player1Char={player1Char}
          player2Char={player2Char}
          setPlayer1Char={setPlayer1Char}
          setPlayer2Char={setPlayer2Char}
          setPhase={setPhase}
        />
      </div>
    );
  }

  if (phase === "countdown") {
    return (
      <div className="relative">
        <BackButton onClick={() => setPhase("characterSelection")} />
        <Countdown initialCount={3} onComplete={() => setPhase("game")} />
      </div>
    );
  }

  if (phase === "game") {
    return (
      <GamePhase
        gameMode={gameMode}
        player1Char={player1Char!}
        player2Char={player2Char!}
        multiplayerTimer={multiplayerTimer}
        difficulty={difficulty!}
        setPhase={setPhase}
        setPlayer1Char={setPlayer1Char}
        setPlayer2Char={setPlayer2Char}
      />
    );
  }

  return null;
};
