import React, { useContext, useState } from "react";
import { TimekeeperContext, AccountContext } from "@/components/contexts";
import { HeaderTooltip } from '../timekeeper/Tooltip'
import { TimekeeperAccount } from "@/components/types";
import { MdUnfoldMore } from "react-icons/md";

type TableColumns = 'username' | 'email';

interface sendEmailProps {
  step: number;
  selectedRows: any[];
  currentAccounts: TimekeeperAccount[];
}

export default function THeaders({
  setRemoveModalState
}: { setRemoveModalState: React.Dispatch<React.SetStateAction<boolean>> }) {
  const { step, accessType, hybridTableType } = useContext(TimekeeperContext);
  const {
    currentAccounts, setCurrentAccounts,
    setSelectedRows, selectedRows,
    setSelectedAccount, setSendState,
    setEnabledAccounts, enabledAccounts,
  } = useContext(AccountContext);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [sortColumn, setSortColumn] = useState<TableColumns>('username');

  // chatgpt-ed...
  const handleSort = (column: TableColumns) => {
    setSortColumn(column);
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');

    const sortedEmpData = [...currentAccounts].sort((a, b) => {
      const aValue = (a as any)[column];
      const bValue = (b as any)[column];

      return aValue.localeCompare(bValue) * (sortDirection === 'asc' ? 1 : -1);
    });
    setCurrentAccounts(sortedEmpData);
  }

  const handleSelectedAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(currentAccounts.map((employee) => employee.id));
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
          account: selectedRows
            .map((id: any) => currentAccounts.find((item: any) => item.id === id))
            .filter((item): item is TimekeeperAccount => Boolean(item)),
          type: 'resetSignIn'
        }));
        break;
      case "2":
        setSendState((prevState) => ({
          ...prevState,
          isOpen: true,
          account: selectedRows
            .map((id: any) => currentAccounts.find((item: any) => item.id === id))
            .filter((item): item is TimekeeperAccount => Boolean(item)),
          type: 'resetPass'
        }));
        break;
      case "3":
        if (!currentAccounts) return;
        const temp = selectedRows?.map((id: any) => currentAccounts.find((item: any) => item.id === id)).filter(Boolean);
        const newSelectedData = temp?.map((item: any) => ({ id: item.id, username: item.username, account_type: hybridTableType }));
        setSelectedAccount(newSelectedData);
        setRemoveModalState(true);
        break;
      default:
        break;
    }
  }

  /* const getColumnType = () => {
    if (accessType === "1toM" || (accessType === 'Hybrid' && step !== 3)) {
      return 'username';
    } else {
      return 'name';
    }
  }; */

  const getColumnLabel = () => {
    if (accessType === "1toM" || (accessType === 'Hybrid' && step !== 3)) {
      return 'Username';
    } else {
      return 'Name';
    }
  };

  const renderHeader = () => {
    const handleEnable = () => {
      setEnabledAccounts(prev => [...prev, ...selectedRows]);
      setSendState((prevState) => ({
        ...prevState,
        isOpen: true,
        account: selectedRows
          .map((id: any) => currentAccounts.find((item: any) => item.id === id))
          .filter((item): item is TimekeeperAccount => Boolean(item)),
        type: 'enable'
      }));
    }

    const handleDisable = () => {
      setEnabledAccounts(prev => prev.filter(account => !selectedRows.includes(account)));
      setSendState((prevState) => ({
        ...prevState,
        isOpen: true,
        account: selectedRows
          .map((id: any) => currentAccounts.find((item: any) => item.id === id))
          .filter((item): item is TimekeeperAccount => Boolean(item)),
        type: 'disable'
      }));
    }

    if (accessType === '1to1' || (accessType === 'Hybrid' && step === 3)) {
      return (
        <th className="th-outer">
          <p className={`font-semibold`}>
            Enable Timekeeper Access
          </p>
          {enabledAccounts.some(account => selectedRows.includes(account)) ? (
            <div className="relative group">
              <p className="text-xs text-slate-700 font-normal hover:underline mt-1.5" onClick={handleDisable}>
                Disable Timekeeper Access to Selected Users
              </p>
              <HeaderTooltip text='Click this to disable timekeeper access to multiple users.' />
            </div>
          ) : selectedRows.length > 1 ? (
            <div className="relative group">
              <p className="text-xs text-slate-700 font-normal hover:underline mt-1.5" onClick={handleEnable}>
                Enable Timekeeper Access to Selected Users
              </p>
              <HeaderTooltip text='Click this to enable timekeeper access to multiple users.' />
            </div>
          ) : null}
        </th>
      );
    }
    return null;
  };

  /* useEffect(() => {
    console.log(selectedRows.map((id: any) => currentAccounts.find((item: any) => item.id === id)))
  }, [selectedRows]) */

  return (
    <>
      <th className="th-outer">
        <input disabled={currentAccounts?.length === 0}
          type="checkbox"
          onChange={handleSelectedAll}
          checked={currentAccounts?.length > 0 && selectedRows?.length === currentAccounts?.length}
        />
      </th>
      <th className="th-outer" onClick={() => handleSort('username')}>
        <div className="flex flex-row justify-center items-center space-x-1.5">
          <p className="font-semibold">{getColumnLabel()}</p>
          <span className="text-blue-600"><MdUnfoldMore className="w-4 h-4" /></span>
        </div>
      </th>
      <th className="th-outer" onClick={() => handleSort('email')}>
        <div className="flex flex-row justify-center items-center space-x-1.5">
          <p className="font-semibold">Email</p>
          <span className="text-blue-600"><MdUnfoldMore className="w-4 h-4" /></span>
        </div>
      </th>
      <th className="th-outer">
        <p className="font-semibold">Generated Password</p>
      </th>
      {renderHeader()}
      <SendEmailHeader
        step={step}
        selectedRows={selectedRows}
        currentAccounts={currentAccounts}
      />
      <th className="th-outer">
        <p className="font-semibold">Sign In Attempts</p>
      </th>
      {selectedRows.length > 1 ? (
        <th className="relative th-outer group">
          <select onChange={handleSelectChange} className="bg-gray-50 border border-1 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" name="dropdown-actions">
            <option value="">Select Action:</option>
            <option value="1">Reset Sign In Attempts</option>
            <option value="2">Reset Password</option>
            {accessType === '1to1' || (accessType === 'Hybrid' && step === 3) ? null : <option value="3">Delete</option>}
          </select>
          <span className="absolute z-10 w-fit top-12 scale-0 rounded-lg bg-[#344960] p-4 text-xs text-white group-hover:scale-100 flex -left-[330px]">
            <p className="text-xs font-normal text-left">
              Click this drop-down button to{" "}
              <span className="italic underline">reset sign in attempts/</span> <span className="italic underline">reset password/</span> <span className="italic underline">delete</span> {" "}
              the selected employees.
            </p>
            <div className="absolute w-3 h-3 bg-[#344960] transform rotate-45 -top-1 left-[400px]"></div>
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

const SendEmailHeader = ({ step, currentAccounts, selectedRows }: sendEmailProps) => {
  const { setSendState } = useContext(AccountContext);
  const selectedAccounts = currentAccounts?.filter(acc => selectedRows.find((id: any) => id === acc.id));

  const handleBulkOpen = () => {
    if (selectedAccounts.length < 2) {
      return alert('Please select more than one account.'); // temp
    }
    else {
      setSendState((prevState) => ({
        ...prevState,
        isOpen: true,
        account: selectedRows
          .map((id: any) => currentAccounts.find((item: any) => item.id === id))
          .filter((item): item is TimekeeperAccount => Boolean(item)),
        type: 'sendEmail'
      }));
    }
  }

  return (
    <th className="th-outer">
      <span className="relative group">
        <p className="font-semibold text-blue-500 hover:underline" onClick={handleBulkOpen}>
          Send Credential via Email
        </p>
        {selectedRows.length > 1 && <HeaderTooltip text='Click this to send credentials via email to selected users.' />}
      </span>

      <span className="relative group">
        <p className="text-xs font-normal text-blue-500 underline">Resend Email</p>
        {selectedRows.length > 1 && <HeaderTooltip text='Click this to re-send credentials via email to selected users.' />}
      </span>
    </th>
  );
};