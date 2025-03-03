// src/components/TimeSettings.tsx
"use client";
import React, { useState } from "react";

type TimeSettingsProps = {
  onSelect: (time: number) => void;
};

export const TimeSetting: React.FC<TimeSettingsProps> = ({ onSelect }) => {
  const [customTime, setCustomTime] = useState<number>(0);
  const [showCustom, setShowCustom] = useState(false);

  const handleTimeSelect = (time: number) => {
    console.log("Selected time:", time);
    if (time > 0) {
      onSelect(time);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-20">
      <h2 className="text-2xl font-bold my-10">Select Timed Game Settings</h2>
      <div className="flex flex-col gap-4">
        <button
          className="w-64 px-6 py-3 bg-green-500 btn-texts hover:bg-green-600"
          onClick={() => handleTimeSelect(10)}
        >
          Easy (10s)
        </button>
        <button
          className="w-64 px-6 py-3 bg-yellow-500 btn-texts hover:bg-yellow-600"
          onClick={() => handleTimeSelect(5)}
        >
          Medium (5s)
        </button>
        <button
          className="w-64 px-6 py-3 bg-red-500 btn-texts hover:bg-red-600"
          onClick={() => handleTimeSelect(3)}
        >
          Hard (3s)
        </button>
        <button
          className="w-64 px-6 py-3 bg-purple-500 btn-texts text-lg hover:bg-purple-600"
          onClick={() => setShowCustom(!showCustom)}
        >
          {showCustom ? "Hide Custom Time" : "Custom Time"}
        </button>
        {showCustom && (
          <div className="flex flex-col items-center gap-2 w-64">
            <input
              type="number"
              min="1"
              placeholder="Enter seconds"
              className="w-full px-6 py-3 border rounded-lg"
              value={customTime || ""}
              onChange={(e) => setCustomTime(Number(e.target.value))}
            />
            <button
              className="w-full px-6 py-3 bg-indigo-500 btn-texts hover:bg-indigo-600 disabled:opacity-50"
              onClick={() => handleTimeSelect(customTime)}
              disabled={customTime <= 0}
            >
              Set Custom Time
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
