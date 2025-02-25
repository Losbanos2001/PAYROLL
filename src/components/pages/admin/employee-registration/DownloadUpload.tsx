import { useState, useContext } from "react";
import axios from "axios";
import toast from 'react-hot-toast';
import CustomToast from "@/components/Toast/CustomToast";
import UploadCSV from "./modals/UploadCSV";
import { MdDownload, MdUpload } from "react-icons/md";
import { EmployeeRegistrationContext } from "@/components/contexts";

function DownloadUpload() {
  const [modalState, setModalState] = useState(false);
  const { step } = useContext(EmployeeRegistrationContext)

  const handleDownload = async () => {
    const endpoint = step === 1 ? 'https://yp3.yahshuasolutions.com/api/employee-profile/download-csv/' : '';
    try {
      const response = await axios.get(endpoint, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'employee-registration.csv');
      document.body.appendChild(link);
      link.click();

      toast.custom(() => <CustomToast message={`Successfully downloaded employee registration csv.`} type='success' />, {
        duration: 4000
      })
    } catch (error) {
      console.error("Error", error);
      throw new Error('Error downloading template. Please try again.'); 
    }
  }


  const handleOpen = () => {
    setModalState(true);
  }

  const handleClose = () => {
    setModalState(false);
  }

  return (
    <>
      <UploadCSV isOpen={modalState} onClose={handleClose} />
      <div className="flex justify-end space-x-4">
        <button onClick={handleDownload} className="flex justify-between items-center px-6 py-2 font-semibold text-blue-500 bg-white rounded outline outline-1 outline-blue-500">
          <MdDownload className="w-6 h-6 mr-2.5" />
          Download Template
        </button>
        <button onClick={handleOpen} className="flex justify-between items-center px-6 py-2 font-semibold text-blue-500 bg-white rounded outline outline-1 outline-blue-500">
          <MdUpload className="w-6 h-6 mr-2.5" />
          Upload file
        </button>
      </div>
    </>
  );
}

export default DownloadUpload;
