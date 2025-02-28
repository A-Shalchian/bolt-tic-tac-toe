"use client";
import React, { useEffect, useState } from "react";

type CountdownProps = {
  initialCount: number;
  onComplete: () => void;
};

export const Countdown: React.FC<CountdownProps> = ({
  initialCount,
  onComplete,
}) => {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    if (count <= 0) {
      onComplete();
      return;
    }
    const timer = setInterval(() => {
      setCount((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [count, onComplete]);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-20">
      <h2 className="text-3xl font-bold mb-4">Game starts in:</h2>
      <div className="text-6xl">{count}</div>
    </div>
  );
};
