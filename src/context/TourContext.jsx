import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { EVENTS, STATUS } from "react-joyride";
import { fullTourSteps } from "../data/tutorialSteps";

const TourContext = createContext();

export const useTour = () => useContext(TourContext);

export const TourProvider = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [steps, setSteps] = useState(fullTourSteps);
  const [stepIndex, setStepIndex] = useState(0);
  const [runTour, setRunTour] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

 

  // Load tour progress from localStorage
  useEffect(() => {
    const tourCompleted = localStorage.getItem("tour_completed");
    if (!tourCompleted) setRunTour(true);
  }, []);

  // Joyride callback
  const handleJoyrideCallback = (data) => {
    const { status, type, step } = data;

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      localStorage.setItem("tour_completed", "true");
      toast.success("🎉 Tour completed!");
      setRunTour(false);
      return;
    }

    if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      if (step.page && location.pathname !== step.page) {
        navigate(step.page, { replace: true });
        setTimeout(() => setStepIndex((prev) => prev + 1), 800);
        return;
      }
      setStepIndex((prev) => prev + 1);
    }
  };

 
  return (
    <TourContext.Provider
      value={{
        steps,
        setSteps,
        stepIndex,
        setStepIndex,
        runTour,
        setRunTour,
        handleJoyrideCallback,
        alertMessage,
        setAlertMessage,
       
      }}
    >
      {children}
    </TourContext.Provider>
  );
};
