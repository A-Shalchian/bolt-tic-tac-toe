"use client";
import React from "react";

type MainMenuProps = {
  onModeSelect: (mode: "single" | "multi" | "online") => void;
};

export const MainMenu: React.FC<MainMenuProps> = ({ onModeSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh]">
      <h1 className="text-4xl font-bold mb-8">Tic Tac Toe</h1>
      <div className="flex flex-col gap-4">
        <button
          onClick={() => onModeSelect("single")}
          className="px-8 py-4 bg-gray-400 text-white rounded"
        >
          Single Player (Coming Soon)
        </button>
        <button
          onClick={() => onModeSelect("multi")}
          className="px-8 py-4 bg-indigo-500 text-white rounded"
        >
          Multiplayer
        </button>
        <button
          onClick={() => onModeSelect("online")}
          className="px-8 py-4 bg-gray-400 text-white rounded"
        >
          Online (Coming Soon)
        </button>
      </div>
    </div>
  );
};
