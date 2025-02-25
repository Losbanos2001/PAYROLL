import { FC, useContext, useEffect, useState } from 'react';
import Step from '@/components/stepper/Step';
import { EmployeeContext } from '@/components/contexts';
import { initialEmployeeProfileValues } from '../helpers/utils';
import { useForm } from 'react-hook-form';
import useUpdateProfile from '../hooks/useUpdateEmployee';
import type { Employee } from "@/components/types";
import toast from "react-hot-toast";
import CustomToast from '@/components/Toast/CustomToast';
import { useQueryClient } from '@tanstack/react-query';
import EmployeeInfo from './subcomponents/EmployeeInfo';
import ContactInfo from './subcomponents/ContactInfo';
import EmergencyContact from './subcomponents/EmergencyContact';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UpdateEmployeeModal({ isOpen, onClose }: ModalProps) {
  const [step, setStep] = useState(1);
  const { selectedEmployee, setSelectedRows } = useContext(EmployeeContext);
  const { mutate, isPending } = useUpdateProfile();
  const queryClient = useQueryClient();

  const { 
    control, 
    handleSubmit, 
    formState: { errors, isValid }, 
    reset,
    setValue
  } = useForm<Employee>({
    defaultValues: initialEmployeeProfileValues,
    mode: 'onBlur'
  });

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep((prevStep: number) => (prevStep > 1 ? prevStep - 1 : prevStep));
  };

  useEffect(() => {
    if (isOpen && selectedEmployee) {
      setSelectedRows([selectedEmployee.id]);
    }
  }, [isOpen, selectedEmployee]);

  const onSubmit = async (data: Employee) => {
    console.log('Form data:', data);

    const processedData = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        value === "" ? null : value
      ])
    ) as Employee;

    console.log('Processed data:', processedData);

    const filteredData = Object.fromEntries(
      Object.entries(processedData).filter(([_, value]) => value !== null)
    );

    const updatedProfile = {
      id: selectedEmployee.id,
      ...filteredData,
    };

    mutate(updatedProfile, {
      onSuccess: () => {
        console.log('Update successful:', updatedProfile);
        queryClient.invalidateQueries({ queryKey: ["employees"] });
        toast.custom(
          () => <CustomToast message="Successfully updated employee." type="success" />,
          { duration: 4000 }
        );
        handleClose();
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
    onClose();
    setStep(1);
  };

  useEffect(() => {
    if (selectedEmployee) {
      const { birthday } = selectedEmployee;
      if (birthday && !isNaN(Date.parse(birthday))) {
        selectedEmployee.birthday = new Date(birthday).toISOString().split("T")[0];
      }

      const keys = Object.keys(initialEmployeeProfileValues) as (keyof Employee)[];
      keys.forEach((key) => {
        let value = selectedEmployee[key];
        if (value === null || value === undefined) {
          if (key === 'foreign_address_zip' || key === 'local_address_zip') {
            value = 0;
          }
        } else {
          setValue(key as any, value);
        }
      });
    }
  }, [selectedEmployee, setValue]);

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
                      Update Employee Profile
                    </h3>
                    <button onClick={() => { reset(); setSelectedRows([]); handleClose(); }}>
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
                    <p
                      onClick={() => reset()}
                      className="mb-3 underline cursor-pointer text-end">
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
                          ) : (
                            <button onClick={handleNext} type="button" className="upload-csv-btn">
                              Next
                            </button>
                          )}
                        </span>
                        <span className="flex mt-3 w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
                          {step > 1 && (
                            <button type="button" onClick={handleBack} className="upload-csv-btn">
                              Back
                            </button>
                          )}
                          {step === 1 && (
                            <button type="button" onClick={handleClose} className="cancel-upload-csv-btn">
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

const Stepper = ({ step }: { step: number }) => {
  return (
    <div className="flex flex-col items-center mx-10 my-3 bg-white md:flex-row">
      <Step
        isActive={step === 1}
        isCompleted={step > 1}
        stepNumber={1}
        stepName="Personal Information"
      />
      <hr className="mx-2 w-full md:w-16"></hr>
      <Step
        isActive={step === 2}
        isCompleted={step > 2}
        stepNumber={2}
        stepName="Contact Information"
      />
      <hr className="mx-2 w-full md:w-16"></hr>
      <Step
        isActive={step === 3}
        isCompleted={step > 3}
        stepNumber={3}
        stepName="Emergency Contact"
      />
    </div>
  );
};
