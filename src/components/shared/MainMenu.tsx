"use client";
import React, { useState } from "react";
import { Sword, Swords, Info } from "lucide-react";
import Tutorial from "../Tutorial";

type MainMenuProps = {
  onModeSelect: (mode: "single" | "multi" | "online" | "tutorial") => void;
};

export const MainMenu: React.FC<MainMenuProps> = ({ onModeSelect }) => {
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

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
          onClick={() => alert("Coming soon :)")}
          className="px-12 py-4 bg-gray-400 text-white btn-texts"
        >
          Online (Coming Soon)
        </button>
        <button
          onClick={() => setIsTutorialOpen(true)}
          className="px-12 py-4 bg-emerald-400 text-white btn-texts text-center flex items-center justify-center"
        >
          <span>How to Play </span>
          <Info className="ml-2 mt-1" />
        </button>
      </div>

      {/* Tutorial Popup */}
      <Tutorial isOpen={isTutorialOpen} onClose={() => setIsTutorialOpen(false)} />
    </div>
  );
};
