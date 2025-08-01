import type { Metadata } from "next";
import "./globals.css";
import "../styles/mobile.css";
import React from "react";
import { Footer } from "@/homeSections/footer";
import { Header } from "@/homeSections/Header";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";

export const metadata: Metadata = {
  title: "Bolt Tic-Tac-Toe",
  description: "Play Bolt Tic-Tac-Toe with a unique repeating board mechanic! Challenge adaptive AI opponents or play with friends in real-time. Customizable difficulty, timed matches, and innovative twist on classic gameplay."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          <Header />

          {children}

          <Footer />
        </ErrorBoundary>
      </body>
    </html>
  );
}
