"use client";
import React from "react";

type MainMenuButtonProps = {
  onClick: () => void;
  visible: boolean;
};

export const MainMenuButton: React.FC<MainMenuButtonProps> = ({
  onClick,
  visible
}) => {
  if (!visible) return null;
  
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-indigo-500 text-white text-lg rounded-lg shadow hover:bg-indigo-600 ml-2"
    >
      <p className="font-semibold">Main Menu</p>
    </button>
  );
};
