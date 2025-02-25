import React, { useContext, useState } from "react";
import { EmployeeContext, EmployeeRegistrationContext } from "@/components/contexts";
import { Employee } from "../../../types";
import { MdUnfoldMore } from "react-icons/md";

interface registrationLink {
  step: number;
  selectedRows: any[];
  currentEmployees: Employee[];
}

interface THProps {
  setRemoveModalState: React.Dispatch<React.SetStateAction<boolean>>
}

type TableColumns = 'first_name' | 'last_name' | 'email';

const RegistrationLinkHeader = ({ step, currentEmployees, selectedRows }: registrationLink) => {
  const { setSendState, sentEmailsByID } = useContext(EmployeeContext);
  if (step !== 1) return null;

  const selectedEmployees = currentEmployees?.filter(employee => selectedRows.find((id: any) => id === employee.id));

  const handleBulkSend = () => {
    if (!selectedEmployees.every(employee => sentEmailsByID.includes(employee.id))) {
      return alert('All selected employees have already been sent an email.'); 
    }
    else {
      setSendState((prevState) => ({
        ...prevState,
        isOpen: true,
        employee: selectedRows
          .map((id: any) => currentEmployees.find((item: any) => item.id === id))
          .filter((item): item is Employee => Boolean(item)),
        type: 'sendEmail'
      }));
    }
  }

  const handleBulkResend = () => {
    if (!selectedEmployees.some(employee => sentEmailsByID.includes(employee.id))) {
      return alert('None of the selected employees have been sent an email yet.'); 
    }
    else {
      setSendState((prevState) => ({
        ...prevState,
        isOpen: true,
        employee: selectedRows
          .map((id: any) => currentEmployees.find((item: any) => item.id === id))
          .filter((item): item is Employee => Boolean(item)),
        type: 'resendEmail'
      }));
    }
  }

  return (
    <th className="th-outer">
      <div className="flex flex-col">
        <button className="font-semibold text-blue-500 hover:underline" disabled={selectedEmployees?.length < 2}
          onClick={handleBulkSend}>
          Send Registration Link to Email
        </button>
        <button className="text-xs font-normal text-blue-500 underline" disabled={selectedEmployees?.length < 2}
          onClick={handleBulkResend}>
          Resend Email
        </button>
      </div>
    </th>
  );
};

export default function THeaders({ setRemoveModalState }: THProps) {
  const { currentEmployees, setCurrentEmployees, setSelectedEmployee, selectedRows, setSelectedRows, setSendState, sendState } = useContext(EmployeeContext);
  const { step } = useContext(EmployeeRegistrationContext);

  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [sortColumn, setSortColumn] = useState<TableColumns>('last_name');

  // chatgpt-ed...
  const handleSort = (column: TableColumns) => {
    setSortColumn(column);
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');

    const sortedEmpData = [...currentEmployees].sort((a, b) => {
      const aValue = (a as any)[column];
      const bValue = (b as any)[column];

      return aValue.localeCompare(bValue) * (sortDirection === 'asc' ? 1 : -1);
    });
    setCurrentEmployees(sortedEmpData);
  }

  const handleSelectedAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(currentEmployees.map((employee) => employee.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    switch (event.target.value) {
      case "1":
        setSendState((prevState) => ({
          ...prevState,
          isOpen: true,
          employee: selectedRows
            .map((id: any) => currentEmployees.find((item: any) => item.id === id))
            .filter((item): item is Employee => Boolean(item)),
          type: 'resetSignIn'
        }));
        break;
      case "2":
        setSendState((prevState) => ({
          ...prevState,
          isOpen: true,
          employee: selectedRows
            .map((id: any) => currentEmployees.find((item: any) => item.id === id))
            .filter((item): item is Employee => Boolean(item)),
          type: 'resetPass'
        }));
        break;
      case "3":
        if (!currentEmployees) return;
        const temp = selectedRows?.map((id: any) => currentEmployees.find((item: any) => item.id === id)).filter(Boolean);
        const newSelectedData = temp?.map((item: any) => ({ id: item.id, dataSource: "employees" }));
        setSelectedEmployee(newSelectedData);
        setRemoveModalState(true);
        break;
      default:
        break;
    }
  }

  // useEffect(() => {
  //   console.log(sendState)
  // },[sendState])

  return (
    <>
      <th className="th-outer">
        <input
          type="checkbox"
          onChange={handleSelectedAll}
          checked={currentEmployees?.length > 0 && selectedRows?.length === currentEmployees?.length}
        />
      </th>
      <th className="th-outer"></th>
      <th className="th-outer">
        <div className="flex flex-row justify-center items-center space-x-1.5">
          <p className="font-semibold">Last Name</p>
          <span className="text-blue-600 hover:bg-slate-100 hover:rounded-full" onClick={() => handleSort('last_name')}><MdUnfoldMore className="w-4 h-4" /></span>
        </div>
      </th>
      <th className="th-outer">
        <div className="flex flex-row justify-center items-center space-x-1.5">
          <p className="font-semibold">First Name</p>
          <span className="text-blue-600 hover:bg-slate-100 hover:rounded-full" onClick={() => handleSort('first_name')}><MdUnfoldMore className="w-4 h-4" /></span>
        </div>
      </th>
      <th className="th-outer">
        <div className="flex flex-row justify-center items-center space-x-1.5">
          <p className="font-semibold">Email Name</p>
          <span className="text-blue-600 hover:bg-slate-100 hover:rounded-full" onClick={() => handleSort('email')}><MdUnfoldMore className="w-4 h-4" /></span>
        </div>
      </th>
      <RegistrationLinkHeader
        step={step}
        selectedRows={selectedRows}
        currentEmployees={currentEmployees}
      />
      {selectedRows.length > 1 ? (
        <th className="relative break-normal th-outer group">
          <select onChange={handleSelectChange} className="bg-gray-50 border border-1 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" name="dropdown-actions">
            <option value="">Select Action:</option>
            {/* <option value="1">Reset Sign In Attempts</option>
            <option value="2">Reset Password</option> */}
            <option value="3">Delete</option>
          </select>
          <span className="absolute z-10 scale-0 rounded-lg bg-[#344960] p-4 text-xs text-white group-hover:scale-100 flex -left-48">
            <p className="text-xs font-normal text-left">
              Click this drop-down button to{" "}
              <span className="italic underline">delete</span> {" "} 
              the selected employees.
            </p>
            <div className="absolute w-3 h-3 bg-[#344960] transform rotate-45 -top-1 left-72"></div>
          </span>
        </th>
      ) : (
        <th className="th-outer">
          <p className="font-semibold">Action</p>
        </th>
      )}
    </>
  );
}