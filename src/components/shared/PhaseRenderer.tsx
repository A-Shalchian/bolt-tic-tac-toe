"use client";
import React, { ReactNode } from "react";
import { BackButton } from "../buttons/BackButton";
import { Phase } from "@/context/GamePhaseContext";

interface PhaseComponentProps {
  children: ReactNode;
  onBack?: () => void;
}

const PhaseComponent: React.FC<PhaseComponentProps> = ({
  children,
  onBack,
}) => {
  return (
    <div className="relative">
      {onBack && (
        <div className="absolute top-4 left-4 z-50">
          <BackButton onClick={onBack} />
        </div>
      )}
      {children}
    </div>
  );
};

interface PhaseConfig {
  component: ReactNode;
  onBack?: () => void;
}

interface PhaseRendererProps {
  currentPhase: Phase;
  phases: Partial<Record<Phase, PhaseConfig>>;
}

export const PhaseRenderer: React.FC<PhaseRendererProps> = ({
  currentPhase,
  phases,
}) => {
  const phaseConfig = phases[currentPhase];

  if (!phaseConfig || !phaseConfig.component) {
    return null;
  }

  return (
    <PhaseComponent onBack={phaseConfig.onBack}>
      {phaseConfig.component}
    </PhaseComponent>
  );
};

// Helper hook to create back button navigation logic
export const usePhaseNavigation = (
  setPhase: React.Dispatch<React.SetStateAction<Phase>>,
  setGameMode: React.Dispatch<
    React.SetStateAction<"multi" | "single" | "online" | "tutorial" | null>
  >,
  phaseMap: Record<string, Phase>
) => {
  const navigateBack = (currentPhase: Phase) => {
    const previousPhase = phaseMap[currentPhase];
    if (previousPhase === "mainMenu") {
      setGameMode(null);
    }
    setPhase(previousPhase);
  };

  return navigateBack;
};
