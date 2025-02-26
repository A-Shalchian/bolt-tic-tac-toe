"use client";
import React from "react";
import { ArrowLeft } from "lucide-react";

type BackButtonProps = {
  onClick: () => void;
};

export const BackButton: React.FC<BackButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="absolute top-4 left-4 px-4 py-2 bg-gray-200 text-gray-800 text-lg rounded-lg shadow hover:bg-gray-300 flex items-center"
    >
      <span>Back</span>
      <ArrowLeft className="ml-2" />
    </button>
  );
};
