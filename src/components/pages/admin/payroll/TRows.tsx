import React, { useContext, useEffect, useState } from "react";
import { MdEdit, MdDelete } from "react-icons/md";
import { DailyLogsContext, LogsContext } from "@/components/contexts";
import { DeleteTooltip, EditTooltip } from '../timekeeper/Tooltip';

interface RowProps {
  setEditFormState: React.Dispatch<React.SetStateAction<boolean>>;
  setRemoveModalState: React.Dispatch<React.SetStateAction<boolean>>;
}

interface TDProps {
  log: any;
  setEditFormState: React.Dispatch<React.SetStateAction<boolean>>;
  setRemoveModalState: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedLog: any;
}

const ActionsTD = ({ log, setSelectedLog, setEditFormState, setRemoveModalState }: TDProps) => {
  const { selectedRows, setSelectedRows } = useContext(LogsContext);

  const handleUpdate = (log: any) => {
    setSelectedRows([log.id])
    setSelectedLog(log);
    setEditFormState(true);
  }

  return (
    <td className="p-4 text-center border-b border-blue-gray-50">
      <div className="flex justify-center items-center space-x-3">
        <div className="relative group">
          <button disabled={selectedRows.length > 1} onClick={() => { handleUpdate(log) }}
            className={`px-2.5 py-2 hover:drop-shadow-md shadow-sm rounded outline outline-1 disabled:outline-black disabled:bg-gray-300`}>
            <div className="flex justify-center items-center">
              <MdEdit className="w-4 h-4" />
            </div>
          </button>
          <EditTooltip />
        </div>
        <div className="relative group">
          <button disabled={selectedRows.length > 1}
            onClick={() => {
              setSelectedRows([log.id])
              setSelectedLog(log)
              setRemoveModalState(true);
            }}
            className={`px-2.5 py-2 hover:drop-shadow-md shadow-sm rounded outline outline-1 outline-red-500 disabled:outline-black disabled:bg-gray-300`}>
            <div className="flex justify-center items-center text-red-500">
              <MdDelete className="w-4 h-4" />
            </div>
          </button>
          <DeleteTooltip />
        </div>
      </div>
    </td>
  );
};

const LoadingComponent = () => {
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const { payrollProcessType } = useContext(DailyLogsContext);

  const openDeleteModal = () => {
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  const openUpdateModal = () => {
    setUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setUpdateModalOpen(false);
  };

  return (
    <>
      <tr className="p-4 text-center border-b border-blue-gray-50">
        <td colSpan={8} className="p-6">
          <span className="flex flex-col justify-center space-x-4 w-full text-center">
            <p className="p-2 text-gray-400">
              To import daily logs, click the "<span className="underline">Download Template</span>"
            </p>
            <p className="p-2 text-gray-400">
              button to fill it out with your employees' daily logs.
            </p>
          </span>
        </td>
      </tr>
    </>
  )
}

export default function TRows({ setEditFormState, setRemoveModalState }: RowProps) {
  const { payrollProcessType } = useContext(DailyLogsContext);
  const { setSelectedLog, currentLogs } = useContext(LogsContext);

  useEffect(() => {
    console.log(currentLogs)
  }, [currentLogs])

  return (
    <>
      {currentLogs?.length > 0 ? currentLogs.map((log) => (
        <tr key={log.id} className="p-4 text-center border-b border-blue-gray-50">
          <td className="p-4 text-center border-b border-blue-gray-50">
            <p className="font-normal text-blue-gray-900">
              {log.date && new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </td>
          {payrollProcessType === 'manual' && (
            <td className="p-4 text-center border-b border-blue-gray-50">
              <p className="font-normal text-blue-gray-900">
                {log.employee.firstname + ' ' + log.employee.lastname}
              </p>
            </td>
          )}
          {log.employee.id && (
            <td className="p-4 text-center border-b border-blue-gray-50">
              <p className="font-normal text-blue-gray-900">
                {log.employee.id}
              </p>
            </td>
          )}
          <td className="p-4 text-center border-b border-blue-gray-50">
            <p className="font-normal text-blue-gray-900">
              {log.timein}
            </p>
          </td>
          <td className="p-4 text-center border-b border-blue-gray-50">
            <p className="font-normal text-blue-gray-900">
              {log.timeout}
            </p>
          </td>
          <ActionsTD
            setEditFormState={setEditFormState} setRemoveModalState={setRemoveModalState}
            log={log}
            setSelectedLog={setSelectedLog}
          />
        </tr>
      )) : <LoadingComponent />}
    </>
  );
}
