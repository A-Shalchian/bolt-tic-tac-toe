import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import { Footer } from "@/homeSections/footer";
import { Header } from "@/homeSections/Header";

export const metadata: Metadata = {
  title: "Infinite Tic-Tac-Toe | Endless Strategy Game",
  description: "Play Infinite Tic-Tac-Toe with a unique repeating board mechanic! Challenge adaptive AI opponents or play with friends in real-time. Customizable difficulty, timed matches, and innovative twist on classic gameplay."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />

        {children}

        <Footer />
      </body>
    </html>
  );
}
