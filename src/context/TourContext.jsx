import React, { createContext, useContext, useState } from "react";

const TourContext = createContext();

export const useTour = () => useContext(TourContext);

export const TourProvider = ({ children }) => {
  const [isTourRunning, setIsTourRunning] = useState(false);
  const [tourStepIndex, setTourStepIndex] = useState(0);

  const startTour = () => {
    setIsTourRunning(true);
    setTourStepIndex(0);
  };

  const stopTour = () => {
    setIsTourRunning(false);
    setTourStepIndex(0);
  };

  const nextStep = () => {
    setTourStepIndex((prev) => prev + 1);
  };

  return (
    <TourContext.Provider
      value={{
        isTourRunning,
        tourStepIndex,
        setTourStepIndex,
        startTour,
        stopTour,
        nextStep,
      }}
    >
      {children}
    </TourContext.Provider>
  );
};
