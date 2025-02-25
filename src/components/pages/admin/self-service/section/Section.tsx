import {useEffect, useState, useContext, useMemo } from "react";
import axios from "axios";
import toast from 'react-hot-toast';
import CustomToast from "@/components/Toast/CustomToast";
import Upload from "@/components/modal/Upload";
import DeleteModal from "./modal/DeleteModal";
import EditSectionModal from "./modal/EditSectionModal";
import useGetTimeData from "@/components/hooks/useGetTime";
import CreateSectionModal from "./modal/CreateSectionModal";
import useGetSectionsData from "./hooks/useGetSectionData";
import { SelfServiceContext } from "@/components/contexts";
import classNames from "@/helpers/classNames";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdDownload, MdUpload } from 'react-icons/md';
import { FaTrash } from "react-icons/fa";
import { RiPencilFill } from "react-icons/ri";


const Section = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const { data: sectionsData, refetch, isLoading } = useGetSectionsData(currentPage, pageSize);
  const { selectedRows, setSelectedRows } = useContext(SelfServiceContext);
  const { data: timeData} = useGetTimeData();
  const [open] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<any[] | null>(null);
  const [openUploadModal, setOpenUploadModal] = useState(false)

  type SortConfig = {
    key: keyof typeof sectionsData.sections[0] | null;
    direction: 'asc' | 'desc';
  };

  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });

  const handleSort = (key: keyof typeof sectionsData.sections[0]) => {
    let direction: 'asc' | 'desc' = 'asc'; 
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    if (!sectionsData || !sectionsData.sections) return [];

    return [...sectionsData.sections].sort((a, b) => {
      if (!sortConfig.key) return 0;
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [sectionsData, sortConfig]);

  useEffect(() => {
  }, [sectionsData])

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const openDeleteModal = () => {
    setDeleteModal(true)
  }

  const closeDeleteModal = () => {
    setDeleteModal(false)
    setSelectedSection(null)
    refetch()
  }

  const openEditModal = () => {
    setEditModal(true)
  }

  const closeEditModal = () => {
    setEditModal(false)
    setSelectedSection(null)
    refetch()
  }


  const handleSelectedAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const idsToSelect = sortedData?.length > 0 
        ? sortedData.map((section: any) => section.id)
        : [];
      setSelectedRows(idsToSelect);
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelected = (e: React.ChangeEvent<HTMLInputElement>, section: any) => {
    if (section.id) {
      if (e.target.checked) {
        setSelectedRows((prev: any[]): any[] => [...prev, section.id]);
      } else {
        setSelectedRows((prev: any[]): any[] => prev.filter((id) => id !== section.id));
      }
    }
  };

  const openUpload = () => {
    setOpenUploadModal(true)
  }

  const closeUpload = () => {
    setOpenUploadModal(false)
  }

  const handleDownload = async () => {
    const endpoint = 'https://yp3.theabbaaccounting.com/api/sections/export-csv/';
    try {
      const response = await axios.get(endpoint, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'setup-section.csv');
      document.body.appendChild(link);
      link.click();

      toast.custom(() => <CustomToast message={`Successfully downloaded section csv.`} type='success' />, {
        duration: 4000
      })
    } catch (error) {
      console.error("Error", error);
    }
  }

  return (
    <>
      <Upload
        fields={["Name"]}
        isOpen={openUploadModal}
        onClose={closeUpload}
        module="section"
      />
      <CreateSectionModal isOpen={isModalOpen} onClose={closeModal} />
      <EditSectionModal
        section={selectedSection}
        isOpen={editModal}
        onClose={closeEditModal}
      />
      <DeleteModal
        section={selectedSection}
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
      <div className="xl:w-full bg-white mx-20 rounded-[10px] shadow-md w-3/4 border-2">
        <div
          className={classNames(
            "",
            open
              ? "mx-14 border-b-2 xl:flex border-stone-700 lg:max-w-full xl:justify-between lg:grid-col"
              : "mx-14 xl:flex lg:max-w-full xl:justify-between lg:grid-col"
          )}
        >
          <div className="flex">
            <h1 className="my-5 ml-5 text-3xl font-bold">Section</h1>
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
                className="absolute scale-0 w-[400px] rounded-lg drop-shadow-lg border border-[#ACB9CB] bg-slate-400 p-2 pl-4 text-sm text-black font-bold group-hover:scale-100"
                style={{ bottom: "40px", left: "-200px" }}
              >
                List every section for your business.
              </span>
            </div>
          </div>
          <div className="self-end flex-auto" style={{ textAlign: "end" }}>
            <button
              onClick={openModal}
              id="addbtn"
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
                      disabled={false}
                      type="checkbox"
                      onChange={handleSelectedAll}
                      checked={
                        selectedRows.length > 0 &&
                        (sortedData?.length > 0
                          ? selectedRows.length === sortedData.length &&
                            sortedData.every((section) =>
                              selectedRows.includes(section.id)
                            )
                          : false)
                      }
                    />
                  </th>
                  <th scope="col" className="px-3 py-3.5">
                    <div className="flex items-center justify-center">
                      <h1 className="text-black">Name</h1>
                      <button
                        disabled={sectionsData?.sections?.length === 0}
                        onClick={() => handleSort("name")}
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
                    <div className="flex flex-col space-y-1.5 items-center">
                      <h1>Action</h1>
                      {selectedRows.length > 1 && (
                        <div onClick={openDeleteModal}>
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
                    <td colSpan={3} className="py-1">
                      <p className="p-2">Loading...</p>
                    </td>
                  </tr>
                ) : sortedData?.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-4 text-center">
                      No data available.
                    </td>
                  </tr>
                ) : (
                  sortedData.map((section: any) => (
                    <tr
                      key={section.id}
                      className="p-4 text-center border-b border-blue-gray-50"
                    >
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(section.id)}
                          onChange={(e) => handleSelected(e, section)}
                        />
                      </td>
                      <td className="py-1">{section.name}</td>
                      <td className="py-1">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedSection([section]);
                              setSelectedRows([section.id]);
                              openEditModal();
                            }}
                            id="editbtn"
                            className="p-2 text-gray-600 border-2 border-gray-600 rounded-md hover:text-blue-600 hover:border-blue-600 disabled:bg-gray-300 disabled:text-gray-500"
                            disabled={selectedRows.length > 1}
                          >
                            <RiPencilFill size={17} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedSection([section]);
                              setSelectedRows([section.id]);
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
                )}
              </tbody>
            </table>
          </div>
          <div className="flex flex-row justify-between mx-5 my-5">
            <div className="flex items-center">
              <h1>Total Record/s: {sectionsData?.sections?.length || 0}</h1>
            </div>

            <div className="flex items-center gap-2">
              <span>Record per page: {pageSize}</span>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50"
              >
                <MdKeyboardArrowLeft size={20} />
              </button>
              <span className="text-blue-500">{currentPage}...</span>
              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(
                      prev + 1,
                      sectionsData?.pagination.total_pages || 1
                    )
                  )
                }
                disabled={
                  currentPage === (sectionsData?.pagination.total_pages || 1)
                }
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

export default Section;