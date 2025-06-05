"use client";
import React from "react";
import { useGameStore } from "@/store";

type TimeOptionSelectionProps = {
  onSelect: (timed: boolean) => void;
};

export const TimeOptionSelection: React.FC<TimeOptionSelectionProps> = ({
  onSelect,
}) => {
  // Get setter functions from Zustand store
  const setIsTimed = useGameStore(state => state.setIsTimed);
  const setPhase = useGameStore(state => state.setPhase);
  
  const handleTimedSelection = (isTimed: boolean) => {
    // Update the store state
    setIsTimed(isTimed);
    
    // Navigate to the next phase directly
    if (isTimed) {
      setPhase("timeSettings");
    } else {
      setPhase("characterSelectionMulti");
    }
    
    // Also call the onSelect callback for compatibility
    onSelect(isTimed);
  };
  
  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-20">
      <h2 className="text-3xl font-bold my-10 text-center">
        Choose Game Timing
      </h2>
      <div className="flex flex-col gap-4">
        <button
          onClick={() => handleTimedSelection(true)}
          className="px-8 py-4 bg-blue-500 btn-texts hover:bg-blue-600"
        >
          Timed
        </button>
        <button
          onClick={() => handleTimedSelection(false)}
          className="px-8 py-4 bg-gray-500 btn-texts hover:bg-gray-600"
        >
          No Time
        </button>
      </div>
      <div className="mt-6 font-semibold border bg-gray-100 p-4 rounded-lg">
        <p className="text-center">What does choosing a time option mean?</p>
        <br />{" "}
        <p>
          Whoever&apos;s turn it is they have a said amount of time to make
          their move.
          <br /> or else, it will be passed to the other player.
        </p>
      </div>
    </div>
  );
};
