"use client";
import React, { useState } from "react";

type SurrenderButtonProps = {
  onClick: () => void;
};

export const SurrenderButton: React.FC<SurrenderButtonProps> = ({
  onClick,
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSurrenderClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirmSurrender = () => {
    setShowConfirmation(false);
    onClick(); // Execute the actual surrender action
  };

  const handleCancelSurrender = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      <button
        onClick={handleSurrenderClick}
        className="px-4 py-2 bg-red-500 text-white text-lg rounded-lg shadow hover:bg-red-600"
      >
        <p className="font-semibold">Surrender</p>
      </button>

      {/* Confirmation Popup */}
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4 text-center">Are you sure you want to surrender?</h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleCancelSurrender}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
              >
                <p className="font-semibold">No, continue playing</p>
              </button>
              <button
                onClick={handleConfirmSurrender}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                <p className="font-semibold">Yes, surrender</p>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
