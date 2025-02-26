// src/components/TimeSettings.tsx
"use client";
import React, { useState } from "react";

type TimeSettingsProps = {
  onSelect: (time: number) => void;
};

export const TimeSetting: React.FC<TimeSettingsProps> = ({ onSelect }) => {
  const [customTime, setCustomTime] = useState<number>(0);
  const [showCustom, setShowCustom] = useState(false);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-20">
      <h2 className="text-2xl font-bold mb-8">Select Timed Game Settings</h2>
      <div className="flex flex-col gap-4">
        <button
          className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={() => onSelect(10)} // Easy: 10 seconds
        >
          Easy (10s)
        </button>
        <button
          className="px-6 py-3 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          onClick={() => onSelect(5)} // Medium: 5 seconds
        >
          Medium (5s)
        </button>
        <button
          className="px-6 py-3 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={() => onSelect(3)} // Hard: 3 seconds
        >
          Hard (3s)
        </button>
        <button
          className="px-6 py-3 bg-purple-500 text-white rounded hover:bg-purple-600"
          onClick={() => setShowCustom(!showCustom)}
        >
          {showCustom ? "Hide Custom Time" : "Custom Time"}
        </button>
        {showCustom && (
          <div className="flex flex-col items-center gap-2">
            <input
              type="number"
              min="1"
              placeholder="Enter seconds"
              className="px-4 py-2 border rounded"
              value={customTime || ""}
              onChange={(e) => setCustomTime(Number(e.target.value))}
            />
            <button
              className="px-6 py-3 bg-indigo-500 text-white rounded hover:bg-indigo-600"
              onClick={() => onSelect(customTime)}
            >
              Set Custom Time
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
