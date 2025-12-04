import React, { useState, useEffect } from "react";
import { getCookie } from "../../components/utils/cookieHandler";
import RecruiterAssessment from "./RecruiterAssessment";
import StudentAssessment from "./components/StudentAssessment";

const Index = () => {
  const [accessMode, setAccessMode] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const mode = getCookie("ACCESS_MODE");
      setAccessMode(mode);
    }, 300);

    return () => clearTimeout(timer);
  }, []);
   useEffect(() => {
    const timer = setTimeout(() => {
      const mode = getCookie("ACCESS_MODE");
      setAccessMode(mode);
    }, 300);

    return () => clearTimeout(timer);
  }, []);
  return (
    <div>
      {accessMode === "6" ? <RecruiterAssessment /> : <StudentAssessment />}
    </div>
  );
};

export default Index;
