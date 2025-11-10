// src/context/TourContext.jsx
import React, { createContext, useContext, useState } from "react";

const TourContext = createContext();
export const useTour = () => useContext(TourContext);

export const TourProvider = ({ children }) => {
  const [isTourRunning, setIsTourRunning] = useState(false);
  const [tourStepIndex, setTourStepIndex] = useState(0);
  const [steps, setSteps] = useState([]); // ✅ store current page tour steps

  const startTour = () => {
    if (steps.length === 0) return; // don't start if no steps
    setIsTourRunning(true);
    setTourStepIndex(0);
  };

  const stopTour = () => {
    setIsTourRunning(false);
    setTourStepIndex(0);
    setSteps([]); // optional: clear steps when stopped
  };

  const nextStep = () => {
    if (tourStepIndex + 1 >= steps.length) {
      stopTour(); // stop automatically when last step is done
    } else {
      setTourStepIndex((prev) => prev + 1);
    }
  };

  return (
    <TourContext.Provider
      value={{
        isTourRunning,
        tourStepIndex,
        steps,        // ✅ expose steps
        setSteps,     // ✅ allow dynamic step changes
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
