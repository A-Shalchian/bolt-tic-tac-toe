"use client";
import React, { useState } from "react";
import { X, ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import FirstPic from "@/assets/images/1.png"
import SecondPic from "@/assets/images/2.png"
import ThirdPic from "@/assets/images/3.png"
import FourthPic from "@/assets/images/4.png"

interface TutorialProps {
  isOpen: boolean;
  onClose: () => void;
}

const Tutorial: React.FC<TutorialProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentImage, setCurrentImage] = useState(0);

  const imageArray = [FirstPic, SecondPic, ThirdPic, FourthPic];

  const handleNextImage = () => {
    setCurrentImage((prev) => (prev + 1) % imageArray.length);
  };
  const handlePrevImage = () => {
    setCurrentImage((prev) => (prev - 1 + imageArray.length) % imageArray.length);
  };

  const tutorialSteps = [
    {
      title: "Welcome to Infinite Tic-Tac-Toe!",
      content: (
        <div>
          <p className="mb-4">
            This game is a different version of the classic Tic-Tac-Toe with new exciting features.
          </p>
          <p>
            Follow this tutorial to learn how to play and master the game!
          </p>
          
        </div>
      ),
    },
    {
      title: "How to Play",
      content: (
        <div>
          <p className="mb-4">
            Scroll through the images to learn how to play the game.
          </p>
          <div className="mt-6 relative">
            <Image src={imageArray[currentImage]} alt="FirstPic" width={300} height={150} className="mx-auto" />
            <div className="absolute inset-0 flex justify-between items-center">
              <button
                onClick={handlePrevImage}
                disabled={currentImage === 0}
                className={`ml-1 p-2 rounded-full bg-white/70 ${
                  currentImage === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-800 hover:bg-white'
                }`}
              >
                <ArrowLeft size={24} />
              </button>
              <button
                onClick={handleNextImage}
                disabled={currentImage === imageArray.length - 1}
                className={`mr-1 p-2 rounded-full bg-white/70 ${
                  currentImage === imageArray.length - 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-800 hover:bg-white'
                }`}
              >
                <ArrowRight size={24} />
              </button>

            </div>
          </div>    
          {currentImage === 2 && (
            <div className="mt-4">
              <p> Tip: Your first move will be removed </p>
            </div>
          )}

          {currentImage === 3 && (
            <div className="mt-4">
              <p> Tip: Same with the bots move, this will keep on going until someone wins, NO DRAWS!! </p>
            </div>
          )}     
        </div>
      ),
    },
    {
      title: "Game Modes",
      content: (
        <div>
          <p className="mb-4">
            <strong>Single Player:</strong> Play against the computer AI with adjustable difficulty.
          </p>
          <p className="mb-4">
            <strong>Multiplayer:</strong> Play with a friend on the same device.
          </p>
          <p>
            <strong>Online:</strong> Coming soon - challenge players from around the world!
          </p>
        </div>
      ),
    },
    {
      title: "Tips & Strategies",
      content: (
        <div>
          <p className="mb-4">
            Think ahead! The infinite board means normal strategies might not always work.
          </p>
          <p className="mb-4">
            Always remember which one of their moves will get removed, so you can catch them off guard.
          </p>
          <p>
            Most importantly - have fun and experiment with different approaches!
          </p>
        </div>
      ),
    },
  ];

  if (!isOpen) return null;

  const goToNextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-12 md:p-16 lg:p-20 max-w-2xl w-full mx-4 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold md:text-3xl lg:text-4xl text-violet-700">
            {tutorialSteps[currentStep].title}
          </h2>
        </div>
        
        <div className="min-h-[200px] mb-8 text-center text-xl">
          {tutorialSteps[currentStep].content}
        </div>
        
        <div className="flex justify-between items-center">
          <button
            onClick={goToPrevStep}
            disabled={currentStep === 0}
            className={`flex items-center px-6 py-2 rounded ${
              currentStep === 0 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-indigo-500 text-white hover:bg-indigo-600'
            }`}
          >
            <ArrowLeft size={16} className="mr-2" />
            Previous
          </button>
          
          <div className="text-sm text-gray-500">
            {currentStep + 1} / {tutorialSteps.length}
          </div>
          
          <button
            onClick={goToNextStep}
            disabled={currentStep === tutorialSteps.length - 1}
            className={`flex items-center px-6 py-2 rounded ${
              currentStep === tutorialSteps.length - 1 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-emerald-500 text-white hover:bg-emerald-600'
            }`}
          >
            Next
            <ArrowRight size={16} className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;
