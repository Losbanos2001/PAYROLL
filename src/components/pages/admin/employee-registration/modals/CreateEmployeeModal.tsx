import { FC, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from 'react-hot-toast';
import CustomToast from "@/components/Toast/CustomToast";
import { useQueryClient } from "@tanstack/react-query";
import useAddEmployee from "../hooks/useAddEmployee";
import { Employee } from '@/components/types';
import { initialEmployeeProfileValues } from "../helpers/utils";
import EmployeeInfo from "./subcomponents/EmployeeInfo";
import ContactInfo from "./subcomponents/ContactInfo"
import EmergencyContact from "./subcomponents/EmergencyContact";
import Stepper from "./subcomponents/Stepper"

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateEmployeeModal: FC<ModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const { mutate, isPending } = useAddEmployee();
  const queryClient = useQueryClient();

  const { control, handleSubmit, reset, formState: { errors, isValid } } = useForm<Employee>({
    defaultValues: initialEmployeeProfileValues,
    mode: 'onBlur',
  });

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep((prevStep: number) => (prevStep > 1 ? prevStep - 1 : prevStep));
  };

  const onSubmit: SubmitHandler<Employee> = (values) => {
    console.log('Form data:', values);

    const filteredData = Object.fromEntries(
      Object.entries(values).filter(([_, value]) => value !== null)
    );
    
    
    mutate(filteredData, {
      onSuccess: (data: any) => {
        queryClient.invalidateQueries({ queryKey: ["employees"] });
        toast.custom(
          () => <CustomToast message={data.message} type="success" />,
          { duration: 4000 }
        );
        reset();
        setStep(1);
        onClose();
      },
      onError: (error: any) => {
        toast.custom(
          () => <CustomToast message={error.message} type="error" />,
          { duration: 4000 }
        );
      },
    });
  };

  const handleClose = () => {
    reset();
    setStep(1);
    onClose();
  };

  const renderFormInputs = () => {
    switch (step) {
      case 1:
        return <EmployeeInfo control={control} errors={errors} />;
      case 2:
        return <ContactInfo control={control} errors={errors} />;
      case 3:
        return <EmergencyContact control={control} errors={errors} />;
      default:
        return <></>;
    }
  };

  return (
    <>
      {isOpen && (
        <div className="block absolute z-50">
          <div className="overflow-y-auto fixed inset-0">
            <div className="flex justify-center items-center px-4 pt-2 pb-20 min-h-screen text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
              <div className="inline-block overflow-hidden text-left align-bottom bg-white rounded-lg shadow-xl transition-all transform sm:my-8 sm:align-middle w-fit sm:mx-6 md:mx-28">
                <div className="text-center sm:text-left">
                  <div className="flex justify-between p-5 w-full bg-blue-600">
                    <h3 className="pr-2 text-lg font-medium leading-6 text-white truncate">
                      Create Employee Profile
                    </h3>
                    <button onClick={handleClose}>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z"
                          fill="white"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="flex flex-col items-center">
                    <Stepper step={step} />
                  </div>
                  <div className="mx-10">
                    <p onClick={() => reset()} className="mb-3 underline cursor-pointer text-end">
                      Clear All
                    </p>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="grid gap-6 mb-4 sm:grid-cols-2 lg:grid-cols-3">
                        {renderFormInputs()}
                      </div>
                      <div className="justify-between my-7 sm:flex sm:flex-row-reverse">
                        <span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
                          {step === 3 ? (
                            <button
                              disabled={isPending || !isValid}
                              type="submit"
                              className={`upload-csv-btn ${
                                isPending || !isValid ? 'bg-gray-400 cursor-not-allowed' : ''
                              }`}
                            >
                              {isPending ? "Submitting..." : !isValid ? "Invalid fields" : "Save"}
                            </button>
                          ) : step < 3 ? (
                            <button onClick={handleNext} type="button" className="upload-csv-btn">
                              Next
                            </button>
                          ) : <></>}
                        </span>
                        <span className="flex mt-3 w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
                          {step > 1 && (
                            <button type="button" onClick={handleBack}
                              className="upload-csv-btn">
                              Back
                            </button>
                          )}
                          {step === 1 && (
                            <button type="button" onClick={handleClose}
                              className="cancel-upload-csv-btn">
                              Close
                            </button>
                          )}
                        </span>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CreateEmployeeModal;
