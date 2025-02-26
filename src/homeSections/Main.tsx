import { Game } from "@/components/Game";
import { GameProvider } from "@/context/GameContext";
export const Main = () => {
  return (
    <GameProvider>
      <Game />
    </GameProvider>
  );
};
