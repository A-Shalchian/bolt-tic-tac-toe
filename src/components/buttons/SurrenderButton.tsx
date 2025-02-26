// SurrenderButton.tsx
"use client";
import React from "react";

type SurrenderButtonProps = {
  onClick: () => void;
};

export const SurrenderButton: React.FC<SurrenderButtonProps> = ({
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="absolute top-4 right-4 px-4 py-2 bg-red-500 text-white text-lg rounded-lg shadow hover:bg-red-600"
    >
      Surrender
    </button>
  );
};
