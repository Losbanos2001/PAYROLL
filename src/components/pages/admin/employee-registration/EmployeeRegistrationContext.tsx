import React, { useState } from "react";
import { EmployeeRegistrationContext } from "@/components/contexts";

export default function EmployeeRegistrationWrapper({ children, }: { children: React.ReactNode; }) {
  const [step, setStep] = useState(1);
  const [stepCompleted, setStepCompleted] = useState(false);
  
  return (
    <EmployeeRegistrationContext.Provider value={{ step, setStep, stepCompleted, setStepCompleted }}>
      {children}
    </EmployeeRegistrationContext.Provider>
  );
}