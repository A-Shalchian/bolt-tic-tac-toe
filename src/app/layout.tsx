import type { Metadata } from "next";
import "./globals.css";
import { GameProvider } from "@/context/GameContext";

export const metadata: Metadata = {
  title: "Infinite Tic-Tac-toe",
  description: "Play Tic-Tac-Toe forever",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` antialiased`}>
        <GameProvider>{children}</GameProvider>
      </body>
    </html>
  );
}
