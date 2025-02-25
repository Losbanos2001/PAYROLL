import { FC } from "react";
import SetupCompleteModal from "./SetupCompleteModal";
import { useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConfirmProceedModal: FC<ModalProps> = ({ isOpen, onClose }: any) => {
  const modalClassName = isOpen ? 'block absolute z-10' : 'hidden';
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
    onClose();
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }


  return (
    <>
      <SetupCompleteModal isOpen={isModalOpen} onClose={closeModal} />
      {isOpen && (
        <div  className={`modal ${modalClassName}`}>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-2 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
              <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-md sm:w-full sm:pb-6">
                <div className="mb-10 text-center sm:text-left">
                  <div className="flex justify-center mt-2 sm:p-6">
                    <svg width="104" height="104" viewBox="0 0 104 104" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M51.5309 0C23.0704 0 0 23.0704 0 51.5309C0 79.9914 23.0704 103.062 51.5309 103.062C79.9914 103.062 103.062 79.9914 103.062 51.5309C103.062 23.0704 79.9914 0 51.5309 0ZM56.684 77.2964H46.3778V66.9902H56.684V77.2964ZM56.684 56.684H46.3778L43.8013 25.7655H59.2605L56.684 56.684Z" fill="#EAC645" />
                    </svg>
                  </div>
                  <h1 className="text-[20px] px-20 text-center">
                    Are you sure to proceed to the next stage of the set-up?
                  </h1>
                </div>
                <div className="justify-center w-full pr-6 mt-5 sm:mt-4 sm:flex sm:flex-row-reverse sm:pl-6">
                  <span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
                    <button type="button"
                      className="upload-csv-btn"
                      onClick={openModal}
                    >
                      Yes
                    </button>
                  </span>
                  <span className="flex w-full mt-3 rounded-md shadow-sm sm:mt-0 sm:w-auto">
                    <button type="button"
                      className="cancel-upload-csv-btn"
                      onClick={onClose}
                    >
                      No
                    </button>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfirmProceedModal;