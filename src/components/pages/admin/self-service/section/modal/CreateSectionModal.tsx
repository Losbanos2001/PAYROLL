import React from "react";
import useAddSection from "../hooks/useAddSection";
import { useForm } from "react-hook-form";
import toast from 'react-hot-toast';
import CustomToast from "@/components/Toast/CustomToast";
import useGetSectionsData from "../hooks/useGetSectionData";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateSectionModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const { mutate, isPending } = useAddSection();
  const { refetch } = useGetSectionsData(1, 10);
  const modalClassName = isOpen ? 'block absolute z-10' : 'hidden';

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: "",
    }
  });

  const onSubmit = (data: { name: string }) => {
    mutate(data, {
      onSuccess: (response: any) => {
        toast.custom(
          () => <CustomToast message={response.message} type="success" />,
          { duration: 4000 }
        );
        reset();
        onClose();
        refetch();
      },
      onError: (error: any) => {
        toast.custom(
          () => <CustomToast message={error.message} type="error" />,
          { duration: 4000 }
        );
      },
    });
  };

  return (
    <>
      {isOpen && (
        <div className={`block absolute z-10 ${modalClassName}`}>
          <div className="fixed inset-0 z-20 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-2 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:pb-6 w-[416px]">
                <div className="text-center sm:text-left">
                  <div className="flex justify-between w-full p-2 bg-blue-600">
                    <h3 className="pr-2 text-lg font-medium leading-6 text-white truncate">
                      Create Section
                    </h3>
                    <button onClick={onClose}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" fill="white" />
                      </svg>
                    </button>
                  </div>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="text-center sm:text-left">
                    <div className="px-4 py-4 mx-6 xl:space-x-10 xl:divide-x-4">
                      <div className="flex flex-col">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div>
                              <h1 className="mb-1 text-sm font-normal">
                                Section
                              </h1>
                              <input
                                placeholder="Section"
                                type="text"
                                {...register('name', { required: "Section name is required" })}
                                className={`pl-2 border-2 h-[46px] w-full border-[#878787] rounded-[5px]`}
                              />
                              {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-10 pt-10 mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
                      <button 
                        type="submit"
                        disabled={isPending}
                        className="inline-flex justify-center w-full rounded-md border border-transparent px-10 py-2 bg-[#355FD0] text-base leading-6 font-bold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:shadow-outline-green transition ease-in-out duration-150 sm:text-sm sm:leading-5 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isPending ? 'Saving...' : 'Save'}
                      </button>
                    </span>
                    <span className="flex w-full mt-3 rounded-md shadow-sm sm:mt-0 sm:w-auto">
                      <button type="button"
                        className="cancel-upload-csv-btn"
                        onClick={onClose}
                      >
                        Close
                      </button>
                    </span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateSectionModal;
