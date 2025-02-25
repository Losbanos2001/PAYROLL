import React, { useState, useContext, useEffect } from "react";
import toast from "react-hot-toast";
import CustomToast from "@/components/Toast/CustomToast";
import Upload from "@/components/modal/Upload";
import DeleteModal from "./modal/DeleteModal";
import CreateScheduleModal from "./modal/CreateScheduleModal";
import EditScheduleModal from "./modal/EditScheduleModal";
import { SelfServiceContext } from "@/components/contexts";
import { schedFields } from "@/components/constants";
import classNames from "@/helpers/classNames";
import useGetScheduleData from "./hooks/useGetScheduleData";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdDownload, MdUpload } from 'react-icons/md';
import { FaTrash } from "react-icons/fa";
import { RiPencilFill } from "react-icons/ri";


const Schedule = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const {
    data: schedulesDatas,
    isLoading,
  } = useGetScheduleData(currentPage, pageSize);

  const { selectedRows, setSelectedRows } = useContext(SelfServiceContext);
  const [open] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSched, setSelectedSched] = useState<any>(null);
  const [openUploadModal, setOpenUploadModal] = useState(false);

  type SortConfig = {
    key: keyof (typeof schedulesDatas.schedule)[0] | null;
    direction: "asc" | "desc";
  };

  const [sortConfig, setSortConfig] = React.useState<SortConfig>({
    key: null,
    direction: "asc",
  });

  const handleSort = (key: keyof (typeof schedulesDatas.schedule)[0]) => {
    let direction: "asc" | "desc" = "asc"; // default direction
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    if (!schedulesDatas || !schedulesDatas.schedule) return [];

    return [...schedulesDatas.schedule].sort((a, b) => {
      if (!sortConfig.key) return 0;
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      // Handle specific fields for proper comparison
      if (sortConfig.key === "timein" || sortConfig.key === "timeout") {
        return sortConfig.direction === "asc"
          ? new Date(`1970-01-01T${aValue}`).getTime() -
              new Date(`1970-01-01T${bValue}`).getTime()
          : new Date(`1970-01-01T${bValue}`).getTime() -
              new Date(`1970-01-01T${aValue}`).getTime();
      } else if (sortConfig.key === "breaktime") {
        // Compare using the displayed values "yes" and "no"
        const aDisplayValue = a.flexible_breaktime == null && a.fixed_breaktime == null ? "no" : "yes";
        const bDisplayValue = b.flexible_breaktime == null && b.fixed_breaktime == null ? "no" : "yes";
        return sortConfig.direction === "asc"
          ? (aDisplayValue < bDisplayValue ? -1 : 1)
          : (aDisplayValue > bDisplayValue ? -1 : 1);
      } else if (sortConfig.key === "flexible_time") {
        // Compare using the displayed values "yes" and "no"
        const aDisplayValue = aValue ? "yes" : "no";
        const bDisplayValue = bValue ? "yes" : "no";
        return sortConfig.direction === "asc"
          ? (aDisplayValue < bDisplayValue ? -1 : 1)
          : (aDisplayValue > bDisplayValue ? -1 : 1);
      } else if (sortConfig.key === "workdays") {
        // Convert workdays array to string for comparison
        const aWorkdays = aValue.join(","); 
        const bWorkdays = bValue.join(","); 
        return sortConfig.direction === "asc"
          ? (aWorkdays < bWorkdays ? -1 : 1)
          : (aWorkdays > bWorkdays ? -1 : 1);
      } else {
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [schedulesDatas, sortConfig]);

  useEffect(() => {
  }, [schedulesDatas]);


  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openDeleteModal = () => {
    setDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setDeleteModal(false);
    setSelectedSched(null);
  };

  const openEditModal = () => {
    setEditModal(true);
  };

  const closeEditModal = () => {
    setEditModal(false);
    setSelectedSched(null);
  };

  const handleDeleteSelected = () => {
    if (!schedulesDatas.schedule) return;
    const temp = selectedRows
        ?.map((id: any) =>
            schedulesDatas.schedule.find((item: any) => item.id === id)
        )
        .filter(Boolean);
    const newSelectedData = temp?.map((item: any) => ({
        id: item.id,
        dataSource: "schedule",
        value: item.old_name,
    }));
    setSelectedSched(newSelectedData);
    openDeleteModal();
};

  const handleSelectedAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (schedulesDatas?.schedule?.length > 0) {
      if (e.target.checked) {
        setSelectedRows(schedulesDatas.schedule.map((schedule: any) => schedule.id));
      } else {
        setSelectedRows([]);
      }
    }
  };

  const handleSelected = (
    e: React.ChangeEvent<HTMLInputElement>,
    schedule: any
  ) => {
    if (schedule.id) {
      if (e.target.checked) {
        setSelectedRows((prev: any[]): any[] => [...prev, schedule.id]);
      } else {
        setSelectedRows((prev: any[]): any[] =>
          prev.filter((id) => id !== schedule.id)
        );
      }
    }
  };

  const openUpload = () => {
    setOpenUploadModal(true);
  };

  const closeUpload = () => {
    setOpenUploadModal(false);
  };

  const handleDownload = async () => {
    const endpoint = `/next/api/schedule-csv`;
    try {
      const response = await fetch(endpoint, { method: "GET" });
      if (!response.ok) {
        throw new Error("Network response error");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Settings - Schedule.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.custom(
        () => (
          <CustomToast
            message={`Successfully downloaded setup schedule csv.`}
            type="success"
          />
        ),
        {
          duration: 4000,
        }
      );
    } catch (error) {
    }
  };

  return (
    <>
      <Upload
        fields={schedFields}
        isOpen={openUploadModal}
        onClose={closeUpload}
        module="schedule"
      />
      <CreateScheduleModal isOpen={isModalOpen} onClose={closeModal} />
      <EditScheduleModal
        data={selectedSched}
        isOpen={editModal}
        onClose={closeEditModal}
      />
      <DeleteModal
        selectedSched={selectedSched}
        isOpen={deleteModal}
        onClose={closeDeleteModal}
      />
      <div className="flex pr-10 space-x-4" style={{ alignSelf: "end" }}>
        <div className="relative flex group sm:mb-2">
          <button
            id="downloadbtn"
            onClick={handleDownload}
            className="whitespace-nowrap text-[#2757ED] bg-white border border-[#2757ED] font-semibold py-2 px-6 rounded-lg inline-flex items-center"
          >
            <MdDownload className="w-6 h-6 mr-2.5" />
            Download Template
          </button>
          <span className="absolute z-40 w-fit top-12 scale-0 rounded-lg bg-[#344960] p-4 text-xs text-white group-hover:scale-100 flex">
            <span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 5H11V7H9V5ZM9 9H11V15H9V9ZM10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18Z"
                  fill="white"
                />
              </svg>
            </span>
            <h1 className="ml-2 text-sm font-bold">
              Sample csv file will be downloaded.
            </h1>
          </span>
        </div>
        <div className="relative flex group sm:mb-2">
          <button
            id="uploadbtn"
            onClick={openUpload}
            className="whitespace-nowrap text-[#2757ED] bg-white border border-[#2757ED] font-semibold py-2 px-6 rounded-lg inline-flex items-center"
          >
            <MdUpload className="w-6 h-6 mr-2.5" />
            Upload File
          </button>
          <span className="absolute z-40 w-[200px] top-12 scale-0 rounded-lg bg-[#344960] p-4 text-xs text-white group-hover:scale-100 flex">
            <span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 5H11V7H9V5ZM9 9H11V15H9V9ZM10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18Z"
                  fill="white"
                />
              </svg>
            </span>
            <h1 className="ml-2 text-sm font-bold">
              Accepts csv file format only.
            </h1>
          </span>
        </div>
      </div>
      <div className="xl:w-full bg-white mx-10 rounded-[10px] shadow-md w-11/12 border-2">
        <div
          className={classNames(
            "",
            open
              ? "mx-14 border-b-2 xl:flex border-stone-700 lg:max-w-full xl:justify-between lg:grid-col"
              : "mx-14 xl:flex lg:max-w-full xl:justify-between lg:grid-col"
          )}
        >
          <div className="flex">
            <h1 className="my-5 ml-5 text-3xl font-bold">Schedule</h1>
            <div className="relative flex ml-5 my-7 group">
              <svg
                width="21"
                height="21"
                viewBox="0 0 21 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.11817 5.53183H11.1444V7.51264H9.11817V5.53183ZM9.11817 9.49345H11.1444V15.4359H9.11817V9.49345ZM10.1313 0.579803C4.53883 0.579803 0 5.01682 0 10.4839C0 15.9509 4.53883 20.3879 10.1313 20.3879C15.7238 20.3879 20.2626 15.9509 20.2626 10.4839C20.2626 5.01682 15.7238 0.579803 10.1313 0.579803ZM10.1313 18.4071C5.6634 18.4071 2.02626 14.8515 2.02626 10.4839C2.02626 6.11617 5.6634 2.56061 10.1313 2.56061C14.5992 2.56061 18.2363 6.11617 18.2363 10.4839C18.2363 14.8515 14.5992 18.4071 10.1313 18.4071Z"
                  fill="#373530"
                />
              </svg>
              <span
                className="absolute z-40 w-fit top-12 scale-0 rounded-lg bg-[#344960] p-4 text-xs text-white group-hover:scale-100 flex"
                style={{ bottom: "40px", left: "-200px" }}
              >
                List every schedule for your business.
              </span>
            </div>
          </div>
          <div className="self-end flex-auto" style={{ textAlign: "end" }}>
            <button
              id="addbtn"
              onClick={openModal}
              className="mb-4 px-6 py-2 rounded-lg text-white bg-[#2757ED] disabled:bg-gray-300 disabled:text-gray-500"
            >
              Create
            </button>
          </div>
        </div>
        <div className="flex flex-col mx-14 lg:grid">
          <div className="overflow-auto bg-white rounded max-h-64">
            <table className="w-full border-b-2 table-auto">
              <thead className="sticky top-0 text-xs uppercase bg-white border-b-2">
                <tr>
                  <th scope="col" className="px-3 py-3.5">
                    <input
                      disabled={schedulesDatas?.schedule?.length === 0}
                      type="checkbox"
                      onChange={handleSelectedAll}
                      checked={
                        schedulesDatas?.schedule?.length > 0 && 
                        selectedRows?.length === schedulesDatas?.schedule?.length
                      }
                    />
                  </th>
                  <th scope="col" className="px-3 py-3.5">
                    <div className="flex items-center justify-center">
                      <h1 className="text-black">Schedule Code</h1>
                      <button
                        disabled={schedulesDatas?.schedule?.length === 0}
                        onClick={() => handleSort("old_name")}
                      >
                        <svg
                          className="w-3 h-3 ms-1.5 text-blue-600"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z"
                            fill="#2757ED"
                          />
                        </svg>
                      </button>
                    </div>
                  </th>
                  <th scope="col" className="px-3 py-3.5">
                    <div className="flex items-center justify-center">
                      <h1 className="text-black">Time In</h1>
                    </div>
                  </th>
                  <th scope="col" className="px-3 py-3.5">
                    <div className="flex items-center justify-center">
                      <h1 className="text-black">Time Out</h1>
                    </div>
                  </th>
                  <th scope="col" className="px-3 py-3.5">
                    <div className="flex items-center justify-center">
                      <h1 className="text-black">Restday</h1>
                    </div>
                  </th>
                  <th scope="col" className="px-3 py-3.5">
                    <div className="flex items-center justify-center">
                      <h1 className="text-black">Flexible Schedule</h1>
                    </div>
                  </th>
                  <th scope="col" className="px-3 py-3.5">
                    <div className="flex items-center justify-center">
                      <h1 className="text-black">Breaktime</h1>
                    </div>
                  </th>
                  <th scope="col" className="px-3 py-3.5">
                    <div className="flex flex-col space-y-1.5 items-center">
                      <h1 className="text-black">Actions</h1>
                      {selectedRows.length > 1 && (
                        <div onClick={handleDeleteSelected}>
                          <p className="text-xs text-red-500 underline">
                            Delete Selected
                          </p>
                        </div>
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr className="p-4 text-center border-b border-blue-gray-50">
                    <td colSpan={8} className="py-1">
                      <p className="p-2">Loading...</p>
                    </td>
                  </tr>
                ) : sortedData?.length > 0 ? (
                  sortedData?.map((schedule: any) => (
                    <tr
                      key={schedule.id}
                      className="p-4 text-center border-b border-blue-gray-50"
                    >
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(schedule.id)}
                          onChange={(e) => {
                            handleSelected(e, schedule);
                          }}
                        />
                      </td>
                      <td className="py-1">{schedule.old_name}</td>
                      <td className="py-1">{schedule.timein}</td>
                      <td className="py-1">{schedule.timeout}</td>
                      <td className="py-1">
                        {Array.from({ length: 7 }, (_, index) =>
                          schedule.workdays.includes(index)
                            ? [
                                "Sunday",
                                "Monday",
                                "Tuesday",
                                "Wednesday",
                                "Thursday",
                                "Friday",
                                "Saturday",
                              ][index]
                            : null
                        )
                          .filter((day) => day !== null)
                          .join(", ")}
                      </td>
                      <td className="py-1">
                        {schedule.flexible_time ? "Yes" : "No"}
                      </td>
                      <td className="py-1">
                        {schedule.flexible_breaktime ||
                        schedule.fixed_breaktime
                          ? "Yes"
                          : "No"}
                      </td>
                      <td className="py-1">
                        <div className="flex justify-center space-x-2">
                          <button
                            disabled={selectedRows.length > 1}
                            onClick={() => {
                              setSelectedSched(schedule); 
                              setSelectedRows([schedule.id]);
                              openEditModal();
                            }}
                            id="editbtn"
                             className="p-2 text-gray-600 border-2 border-gray-600 rounded-md hover:text-blue-600 hover:border-blue-600 disabled:bg-gray-300 disabled:text-gray-500"
                          >
                           <RiPencilFill size={17} />
                          </button>
                          <button
                            disabled={selectedRows.length > 1}
                            onClick={() => {
                              setSelectedSched({
                                id: schedule.id,
                                dataSource: "schedule",
                                value: schedule.old_name,
                              });
                              setSelectedRows([schedule.id]);
                              openDeleteModal();
                            }}
                            id="deletebtn"
                            className="p-2 text-red-600 border-2 border-red-600 rounded-md hover:text-red-800 hover:border-red-800"
                          >
                            <FaTrash size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) :  (
                  <tr>
                    <td colSpan={8} className="py-4 text-center">No data available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex flex-row justify-between mx-5 my-5">
            <div className="flex items-center">
              <h1>
                Total Record/s: {schedulesDatas?.schedule?.length}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <span>Record per page: {pageSize}</span>
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50"
              >
                <MdKeyboardArrowLeft size={20} />
              </button>
              <span className="text-blue-500">{currentPage}...</span>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, schedulesDatas?.pagination?.total_pages))}
                disabled={currentPage === schedulesDatas?.pagination?.total_pages}
                className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50"
              >
                <MdKeyboardArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Schedule;
