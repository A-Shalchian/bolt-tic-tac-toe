"use client";
import React from "react";

type Difficulty = "easy" | "medium" | "hard";

type DifficultySelectionProps = {
  onSelect: (difficulty: Difficulty) => void;
};

export const DifficultySelection: React.FC<DifficultySelectionProps> = ({
  onSelect,
}) => {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-20">
      <h2 className="text-2xl font-bold my-10 text-center">
        Select Difficulty
      </h2>
      <div className="flex flex-col gap-4">
        <button
          className="px-12 py-3 bg-emerald-500 btn-texts hover:bg-emerald-700"
          onClick={() => onSelect("easy")}
        >
          Easy
        </button>
        <button
          className="px-12 py-3 bg-amber-500 btn-texts hover:bg-amber-700"
          onClick={() => onSelect("medium")}
        >
          Medium
        </button>
        <button
          className="px-12 py-3 bg-rose-500 btn-texts hover:bg-rose-700"
          onClick={() => onSelect("hard")}
        >
          Hard
        </button>
      </div>
    </div>
  );
};
