import { useContext, useState } from "react";
import { EmployeeRegistrationContext, ProgressIndicatorContext } from "@/components/contexts";
import JobInfoIntroModal from "./modals/JobInfoIntroModal";
import ConfirmProceedModal from "./modals/ConfirmProceedModal";
import SkipProcessModal from "@/components/modal/SkipModal";

export default function Footer() {
  const [skipModalState, setSkipModalState] = useState(false);
  const { step, setStep } = useContext(EmployeeRegistrationContext);
  const { progressState, progressDispatch, skippedProgress, setSkippedProgressState } = useContext(ProgressIndicatorContext);
  const [introState, setIntroState] = useState(false);
  const [confirmProceedState, setConfirmProceedState] = useState(false);

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    }
    if(!skippedProgress && progressState.overallProgress < 51){
      progressDispatch({
        type: 'UPDATE_STEP',
        payload: {
          step: 'registerEmployees',
          progress: 51,
          inputs: {},
        },
      });
    }
  };

  const handleBack = () => {
    setStep((prevStep: number) => (prevStep > 1 ? prevStep - 1 : prevStep));
  };

  const closeIntroModal = () => {
    setIntroState(false)
  }

  const closeConfirmProceedModal = () => {
    setConfirmProceedState(false)
  }

  const handleSkipProcess = () => {
    progressDispatch({
      type: 'UPDATE_STEP',
      payload: {
        step: 'importDailyLogs',
        progress: progressState.steps['registerEmployees'].progress,
        inputs: {},
      },
    });
    setSkippedProgressState(true)
    setSkipModalState(true)
  }

  const closeSkipModal = () => {
    setSkipModalState(false)
  }

  return (
    <>
      <SkipProcessModal isOpen={skipModalState} onClose={closeSkipModal} progress={progressState.steps['registerEmployees'].progress} />
      <JobInfoIntroModal isOpen={introState} onClose={closeIntroModal} />
      <ConfirmProceedModal isOpen={confirmProceedState} onClose={closeConfirmProceedModal} />
      <div className="flex justify-between items-center px-10 py-5 bg-white outline outline-1 outline-slate-200 border-t-1 border-slate-300">
        <button
          onClick={handleBack}
          disabled={step === 1}
          className="prev-step"
        >
          Back
        </button>
        <div className="space-x-4">
          <button className="py-3 font-semibold text-blue-600 underline" onClick={handleSkipProcess}>
            I'll do this later.
          </button>
          {step !== 2 ? (
            <button
              onClick={handleNext}
              className="next-step"
            >
              Next
            </button>
          ) : (
            <button
              onClick={() => setConfirmProceedState(true)}
              className="next-step"
            >
              Proceed
            </button>
          )}
        </div>
      </div>
    </>
  );
}

