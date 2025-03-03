"use client";
import React from "react";
import { Sword, Swords } from "lucide-react";

type MainMenuProps = {
  onModeSelect: (mode: "single" | "multi" | "online") => void;
};

export const MainMenu: React.FC<MainMenuProps> = ({ onModeSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh]">
      <h1 className="text-4xl font-bold mb-16 text-center">
        Choose Your Game Mode!
      </h1>
      <div className="flex flex-col gap-6">
        <button
          onClick={() => onModeSelect("single")}
          className="px-12 py-4 bg-violet-500 text-white btn-texts flex items-center justify-center"
        >
          Single Player
          <Sword className="ml-2 mt-1" />
        </button>
        <button
          onClick={() => onModeSelect("multi")}
          className="px-12 py-4 bg-indigo-500 text-white btn-texts flex items-center justify-center"
        >
          <span>Multiplayer</span>
          <Swords className="ml-2 mt-1" />
        </button>
        <button
          onClick={() => onModeSelect("online")}
          className="px-12 py-4 bg-gray-400 text-white btn-texts"
        >
          Online (Coming Soon)
        </button>
      </div>
    </div>
  );
};
