import React, { useContext } from "react";
import { FiMail, FiKey, FiLock, FiRefreshCw, FiCheckCircle } from 'react-icons/fi';
import { FaTrash } from "react-icons/fa";
import { RiPencilFill } from "react-icons/ri";
import { Employee } from "@/components/types";
import { EmployeeContext, EmployeeRegistrationContext } from "@/components/contexts";
import { SendEmailTooltip, ResetSignInTooltip, ResetPassTooltip, ResendEmailTooltip, DeleteTooltip, EditTooltip } from './Tooltip';
import CustomToast from "@/components/Toast/CustomToast";
import toast from 'react-hot-toast';
import classNames from "@/helpers/classNames";


interface RowProps {
  completeEmployees: any[]
  setUpdateEmployeeProfile: React.Dispatch<React.SetStateAction<boolean>>;
  setRemoveModalState: React.Dispatch<React.SetStateAction<boolean>>;
  setUpdateJobInfo: React.Dispatch<React.SetStateAction<boolean>>;
}

interface TDProps {
  employee: Employee;
  setUpdateEmployeeProfile: React.Dispatch<React.SetStateAction<boolean>>;
  setRemoveModalState: React.Dispatch<React.SetStateAction<boolean>>;
  setUpdateJobInfo: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedEmployee: any;
}

const showToast = (message: string, type: string) => {
  toast.custom(() => <CustomToast message={message} type={type} />, {
    duration: 4000,
  });
};

const SendEmailTD = ({ employee }: { employee: Employee }) => {
  const { step } = useContext(EmployeeRegistrationContext);
  const { setSendState, sentEmailsByID, resentEmailsByID, setSelectedRows } = useContext(EmployeeContext);
  if (step !== 1) return null;

  const handleSend = () => {
    setSelectedRows([employee.id]);
    setSendState((prevState) => ({
      ...prevState,
      isOpen: true,
      employee: {
        id: employee.id,
        first_name: employee.first_name,
        last_name: employee.last_name,
        email: employee.email
      },
      type: 'sendEmail'
    }));
  };

  const handleResend = () => {
    setSelectedRows([employee.id]);
    setSendState((prevState) => ({
      ...prevState,
      isOpen: true,
      employee: {
        id: employee.id,
        first_name: employee.first_name,
        last_name: employee.last_name,
        email: employee.email
      },
      type: 'resendEmail'
    }));
  };


  const sendClass = classNames('px-2.5 py-1.5  text-blue-500 disable:text-gray-300 hover:drop-shadow-md shadow-sm rounded font-medium outline outline-2 disabled:outline-black disabled:bg-gray-300 disabled:cursor-not-allowed', sentEmailsByID.includes(employee.id) ? 'bg-gray-300 text-slate-900 outline-black' : 'bg-white outline-blue-500');
  const resendClass = classNames('px-2.5 py-2 hover:drop-shadow-md shadow-sm rounded font-medium outline outline-1 disabled:outline-black disabled:bg-gray-300 disabled:cursor-not-allowed', resentEmailsByID.includes(employee.id) ? 'bg-gray-300 text-slate-900 outline-black' : 'bg-white outline-slate-900');

  const text = sentEmailsByID.includes(employee.id) ? 'Sent' : 'Send'

  return (
    <td className="flex flex-auto gap-2 justify-center items-center p-4 text-center">
      <span className="relative">
        <button type="button" disabled={sentEmailsByID.includes(employee.id)} className={sendClass} onClick={handleSend}>
          <div className="flex justify-center items-center space-x-2.5">
            <p className="max-md:hidden lg:max-2xl:block">{text}</p>
            <FiMail size={17}/>
          </div>
        </button>
        <SendEmailTooltip />
      </span>
      <span className="relative group">
        <button type="button" disabled={!sentEmailsByID.includes(employee.id)} className={resendClass} onClick={handleResend}>
          <div className="flex justify-center items-center space-x-2.5">
            <FiRefreshCw size={17}/>
          </div>
        </button>
        <ResendEmailTooltip />
      </span>
    </td>
  );
};

const ActionsTD = ({ employee, setUpdateEmployeeProfile, setRemoveModalState, setSelectedEmployee, setUpdateJobInfo }: TDProps) => {
  const { selectedRows, setSelectedRows, setSendState } = useContext(EmployeeContext);
  const { step } = useContext(EmployeeRegistrationContext);

  const btnClass = classNames('px-2.5 py-2 hover:drop-shadow-md shadow-sm rounded outline outline-1', selectedRows.length > 1
    ? "outline-black bg-gray-300"
    : "outline-black bg-white")

  const handleUpdate = (employee: any) => {
    setSelectedRows([employee.id])
    if (step === 1) {
      setSelectedEmployee(employee);
      setUpdateEmployeeProfile(true);
    } else {
      if (!employee.job_profile) {
        setSelectedEmployee({
          id: employee.id,
          employment_type: "",
          date_hired: "",
          schedule: "",
          rate_status: "",
          department: "",
          position: "",
          hrs_per_day: 0,
          basic_salary: 0,
          days_per_mos: 0,
          confidential_level: "",
          salary_effective_date: "",
          location: "",
        });
      } else {
        const { id, ...jobProfileData } = employee.job_profile;
        setSelectedEmployee({
          id: employee.id,
          employment_type: jobProfileData.employment_type || "",
          date_hired: jobProfileData.date_hired || "",
          schedule: jobProfileData.schedule || "",
          rate_status: jobProfileData.rate_status || "",
          department: jobProfileData.department || "",
          position: jobProfileData.position || "",
          hrs_per_day: jobProfileData.hrs_per_day || 0,
          basic_salary: jobProfileData.basic_salary || 0,
          days_per_mos: jobProfileData.days_per_mos || 0,
          confidential_level: jobProfileData.confidential_level || "",
          salary_effective_date: jobProfileData.salary_effective_date || "",
          location: jobProfileData.location || "",
        });
      }
      setUpdateJobInfo(true);
    }
  }

  // const handleResetSignInAttempts = () => {
  //   setSelectedRows([employee.id])
  //   setSendState((prevState) => ({
  //     ...prevState,
  //     isOpen: true,
  //     employee: {
  //       id: employee.id,
  //       first_name: employee.first_name,
  //       last_name: employee.last_name,
  //       email: employee.email
  //     },
  //     type: 'resetSignIn'
  //   }));
  // }

  // const handleResetPassword = () => {
  //   setSelectedRows([employee.id])
  //   setSendState((prevState) => ({
  //     ...prevState,
  //     isOpen: true,
  //     employee: {
  //       id: employee.id,
  //       first_name: employee.first_name,
  //       last_name: employee.last_name,
  //       email: employee.email
  //     },
  //     type: 'resetPass'
  //   }));
  // }

  return (
    <>
    <td className="p-4 text-center border-b border-blue-gray-50">
      <div className="flex justify-center items-center space-x-2">
        {/* <div className="relative group">
          <button disabled={selectedRows.length > 1} onClick={handleResetSignInAttempts} className={btnClass}>
            <div className="flex justify-center items-center">
              <FiKey size={17}/>
            </div>
          </button>
          <ResetSignInTooltip />
        </div>
        <div className="relative group">
          <button disabled={selectedRows.length > 1} onClick={handleResetPassword} className={btnClass}>
            <div className="flex justify-center items-center">
              <FiLock size={17}/>
            </div>
          </button>
          <ResetPassTooltip />
        </div> */}
        <div className="relative group">
          <button disabled={selectedRows.length > 1} onClick={() => { handleUpdate(employee) }} className={btnClass}>
            <div className="flex justify-center items-center">
             <RiPencilFill size={17} />
            </div>
          </button>
          <EditTooltip />
        </div>
        <div className="relative group">
          <button disabled={selectedRows.length > 1}
            onClick={() => {
              setSelectedRows([employee.id])
              setSelectedEmployee({
                id: employee.id,
                first_name: employee.first_name,
                middle_name: employee.middle_name ?? '',
                last_name: employee.last_name
              })
              setRemoveModalState(true);
            }}
            className={classNames('px-2.5 py-2 hover:drop-shadow-md shadow-sm rounded outline outline-1 outline-red-500', selectedRows.length > 1 ? 'bg-gray-300' : 'bg-white')}>
            <div className="flex justify-center items-center text-red-500">
             <FaTrash size={17} />
            </div>
          </button>
          <DeleteTooltip />
        </div>
      </div>
    </td>
    </>
  );
};

const LoadingComponent = ({ step }: { step: number }) => {
  const text = step === 1 ? 'To register an employee, click the create button or upload csv file.' : 'N/A';
  return (
    <>
      <tr className="p-4 text-center border-b border-blue-gray-50">
        <td colSpan={8} className="p-6">
          <span className="flex justify-center space-x-4 w-full text-center">
            <p className="p-2 text-gray-400">
              {text}
            </p>
          </span>
        </td>
      </tr>
    </>
  )
}

export default function TRows({ completeEmployees, setUpdateEmployeeProfile, setRemoveModalState, setUpdateJobInfo }: RowProps) {
  const { currentEmployees, employees, setSelectedEmployee, setSelectedRows, selectedRows } = useContext(EmployeeContext);
  const { step } = useContext(EmployeeRegistrationContext);

  const handleSelected = (e: React.ChangeEvent<HTMLInputElement>, employee: Employee) => {
    if (employee.id) {
      if (e.target.checked) {
        setSelectedRows((prev: any) => [...prev, employee.id]);
      } else {
        setSelectedRows((prev: any) => prev.filter((id: any) => id !== employee.id));
      }
    }
  };

  const renderVerifiedText = (step: number, employee: Employee, completeEmployees: any[]) => {
    // console.log(completeEmployees, employee.id)
    if (step === 1) {
      return (
        <>
          {!completeEmployees.includes(employee.id) ? (
            <>
              This icon shows whether an employee has completed their personal information, contact information, and emergency contact details: <span className="font-semibold">gray</span> for <span className="text-orange-500">incomplete</span>, <span className="font-semibold">blue</span> for <span className="text-green-600">complete</span>.
            </>
          ) : (
            <>
              Employee has <span className="text-green-600 font-semi-bold">completed</span> their personal information, contact information, and emergency contact details.
            </>
          )}
        </>
      )
    } else {
      return (
        <>
          {!completeEmployees.includes(employee.id) ? (
            <>
              This icon shows whether the admin has completed employee's job information details: <span className="font-semibold text-white">blue</span> for <span className="text-green-600">complete</span>.
            </>
          ) : (
            <>
              Admin has <span className="text-green-600 font-semi-bold">completed</span> employee's job information details.
            </>
          )}
        </>
      )
    }
  }

  return (
    <>
      {!employees || employees.length === 0 ? (
        <LoadingComponent step={step} />
      ) : (
        currentEmployees?.map((employee) => (
          <tr
            className="p-2 text-center border-b border-blue-gray-50"
            key={employee.id}>
            <td>
              <input
                type="checkbox"
                checked={selectedRows.includes(employee.id)}
                onChange={(e) => {
                  handleSelected(e, employee);
                }}
              />
            </td>
            <td className="relative p-2 text-center border-b border-blue-gray-50 group">
              <span className={classNames('', completeEmployees.includes(employee.id) ? "text-blue-600" : "text-slate-400")}>
                <FiCheckCircle size={17} />
              </span>
              <span className="absolute w-56 top-3.5 scale-0 rounded-lg bg-[#344960] p-2 text-xs text-white group-hover:scale-100 flex -right-52">
                <p className="text-xs font-normal text-left">
                  {renderVerifiedText(step, employee, completeEmployees)}
                </p>
                <div className="absolute w-3 h-3 bg-[#344960] transform rotate-45 top-4 -left-1.5"></div>
              </span>
            </td>
            <td className="p-2 text-center border-b border-blue-gray-50">
              <p className="font-normal text-blue-gray-900">
                {employee?.last_name}
              </p>
            </td>
            <td className="p-2 text-center border-b border-blue-gray-50">
              <p className="font-normal text-blue-gray-900">
                {employee?.first_name}
              </p>
            </td>
            <td className="p-2 text-center border-b border-blue-gray-50">
              <p className="font-normal text-blue-gray-900">
                {employee?.email}
              </p>
            </td>
            <SendEmailTD employee={employee} />
            <ActionsTD employee={employee} setSelectedEmployee={setSelectedEmployee}
              setUpdateEmployeeProfile={setUpdateEmployeeProfile} setUpdateJobInfo={setUpdateJobInfo}
              setRemoveModalState={setRemoveModalState}
            />
          </tr>
        ))
      )}
    </>
  );
}
