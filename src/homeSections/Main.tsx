import { Game } from "@/components/Game";
import { AppProviders } from "@/context/AppProviders";

export const Main = () => {
  return (
    <AppProviders>
      <Game />
    </AppProviders>
  );
};
