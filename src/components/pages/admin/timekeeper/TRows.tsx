import React, { useContext, useEffect } from "react";
import { MdEmail, MdEdit, MdDelete, MdReplay, MdLockReset, MdKey } from "react-icons/md";
import { TimekeeperContext, AccountContext } from "../../../contexts";
import { TimekeeperAccount } from "../../../types";
import CustomToast from "@/components/Toast/CustomToast";
import toast from 'react-hot-toast';
import { SendEmailTooltip, ResetSignInTooltip, ResetPassTooltip, ResendEmailTooltip, DeleteTooltip, EditTooltip } from '../timekeeper/Tooltip';
import classNames from "@/helpers/classNames";

interface RowProps {
  setEditFormState: React.Dispatch<React.SetStateAction<boolean>>;
  setRemoveModalState: React.Dispatch<React.SetStateAction<boolean>>;
}

interface TDProps {
  account: TimekeeperAccount;
  setEditFormState: React.Dispatch<React.SetStateAction<boolean>>;
  setRemoveModalState: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedAccount: any;
}

const showToast = (message: string, type: string) => {
  toast.custom(() => <CustomToast message={message} type={type} />, {
    duration: 4000,
  });
};

const SendEmailTD = ({ account }: { account: TimekeeperAccount }) => {
  // const [resend, setResend] = React.useState(false);
  const { sentEmailsByID, setSelectedRows, selectedRows, setSendState } = useContext(AccountContext);

  const handleSingleSend = () => {
    setSelectedRows([account.id]);
    setSendState((prevState) => ({
      ...prevState,
      isOpen: true,
      account: {
        id: account.id,
        username: account.username,
        email: account.email,
      },
      type: 'sendEmail'
    }));
  };

  const btnClass = classNames('p-2 hover:drop-shadow-md shadow-sm rounded font-medium outline outline-1 disabled:outline-black disabled:bg-gray-300', sentEmailsByID.includes(account.id)
    ? "outline-slate-900 text-slate-900 bg-gray-300 font-light"
    : "outline-slate-900 text-slate-900 bg-white")

  const text = sentEmailsByID.includes(account.id) ? 'Sent' : 'Send'

  /* useEffect(() => {
    console.log(sentEmailsByID)
  }, [sentEmailsByID]) */

  return (
    <td className="flex flex-auto gap-2 justify-center items-center p-4 text-center border-b border-blue-gray-50">
      <span className="relative">
        <button type="button" onClick={handleSingleSend} disabled={selectedRows.length > 1}
          className={btnClass}>
          <div className="flex justify-center items-center space-x-2.5">
            <MdEmail className="w-4 h-4" />
            <p className="text-xs">{text}</p>
          </div>
        </button>
        <SendEmailTooltip />
      </span>
      <span className="relative group">
        <button type="button" disabled={selectedRows.length > 1}
          className={`px-2.5 py-2 hover:drop-shadow-md shadow-sm rounded font-medium outline outline-1 outline-slate-900 text-slate-900 bg-white disabled:outline-black disabled:bg-gray-300`}>
          <div className="flex justify-center items-center space-x-2.5">
            <MdReplay className="w-4 h-4" />
          </div>
        </button>
        <ResendEmailTooltip />
      </span>
    </td>
  );
};

const ActionsTD = ({ account, setSelectedAccount, setEditFormState, setRemoveModalState }: TDProps) => {
  const { accessType, step } = useContext(TimekeeperContext);
  const { selectedRows, setSelectedRows, setSendState } = useContext(AccountContext);

  // const handleUpdate = (account: any) => {
  //   setSelectedRows([account.id])
  const handleUpdate = (account: TimekeeperAccount) => {
    console.log('Updating account:', account);
    setSelectedAccount(account);
    setEditFormState(true);
  }

  const renderActionBtns = () => {
    if (accessType === '1toM' || (accessType === 'Hybrid' && step === 2)) {
      return (
        <>
          <div className="relative group">
            <button disabled={selectedRows.length > 1} onClick={() => { handleUpdate(account) }}
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
                setSelectedRows([account.id])
                setSelectedAccount({
                  id: account.id,
                  username: account.username,
                })
                setRemoveModalState(true);
              }}
              className={`px-2.5 py-2 hover:drop-shadow-md shadow-sm rounded outline outline-1 outline-red-500 disabled:outline-black disabled:bg-gray-300`}>
              <div className="flex justify-center items-center text-red-500">
                <MdDelete className="w-4 h-4" />
              </div>
            </button>
            <DeleteTooltip />
          </div>
        </>
      );
    }
    return null;
  };

  const handleResetSignInAttempts = () => {
    setSelectedRows([account.id])
    setSendState((prevState) => ({
      ...prevState,
      isOpen: true,
      account: {
        id: account.id,
        username: account.username,
        email: account.email,
      },
      type: 'resetSignIn'
    }));
  }

  const handleResetPassword = () => {
    setSelectedRows([account.id])
    setSendState((prevState) => ({
      ...prevState,
      isOpen: true,
      account: {
        id: account.id,
        username: account.username,
        email: account.email
      },
      type: 'resetPass'
    }));
  }

  return (
    <td className="p-4 text-center border-b border-blue-gray-50">
      <div className="flex justify-center items-center space-x-3">
        <div className="relative group">
          <button disabled={selectedRows.length > 1} onClick={handleResetSignInAttempts}
            className={`px-2.5 py-2 hover:drop-shadow-md shadow-sm rounded outline outline-1 disabled:outline-black disabled:bg-gray-300`}>
            <div className="flex justify-center items-center">
              <MdKey className="w-4 h-4" />
            </div>
          </button>
          <ResetSignInTooltip />
        </div>
        <div className="relative group">
          <button disabled={selectedRows.length > 1} onClick={handleResetPassword}
            className={`px-2.5 py-2 hover:drop-shadow-md shadow-sm rounded outline outline-1 disabled:outline-black disabled:bg-gray-300`}>
            <div className="flex justify-center items-center">
              <MdLockReset className="w-4 h-4" />
            </div>
          </button>
          <ResetPassTooltip />
        </div>
        {renderActionBtns()}
      </div>
    </td>
  );
};

const LoadingComponent = () => {
  return (
    <>
      <tr className="p-4 text-center border-b border-blue-gray-50">
        <td colSpan={8} className="p-6">
          <span className="flex flex-col justify-center space-x-4 w-full text-center">
            <p className="p-2 text-gray-400">
              There's no data yet.
            </p>
            <p className="p-2 text-gray-400">
              Please click "create" button to add Timekeeper Accounts.
            </p>
          </span>
        </td>
      </tr>
    </>
  )
}

export default function TRows({ setEditFormState, setRemoveModalState }: RowProps) {
  const { step, accessType, setHybridTableType } = useContext(TimekeeperContext);
  const {
    enabledAccounts, setEnabledAccounts,
    setSelectedAccount, selectedRows,
    setSelectedRows, currentAccounts, accounts
  } = useContext(AccountContext);

  const handleSelected = (e: React.ChangeEvent<HTMLInputElement>, account: TimekeeperAccount) => {
    if (account.id) {
      if (e.target.checked) {
        setSelectedRows((prev: any) => [...prev, account.id]);
      } else {
        setSelectedRows((prev: any) => prev.filter((id: any) => id !== account.id));
      }
    }
  };

  const handleEnabled = (e: React.ChangeEvent<HTMLInputElement>, account: TimekeeperAccount) => {
    if (account.id) {
      if (e.target.checked) {
        setEnabledAccounts((prev: any) => [...prev, account.id]);
        showToast(`Successfully enabled timekeeper access.`, 'success');
      } else {
        setEnabledAccounts((prev: any) => prev.filter((id: any) => id !== account.id));
        showToast(`Successfully disabled timekeeper access.`, 'success');
      }
    }
  };

  const renderAccessCheckbox = (account: any) => {
    if (accessType === '1to1' || (accessType === 'Hybrid' && step === 3)) {
      return (
        <td>
          <input
            type="checkbox"
            checked={enabledAccounts.includes(account.id)}
            onChange={(e) => { handleEnabled(e, account) }}
          />
        </td>
      );
    }
    return null;
  };

  useEffect(() => {
    if (accessType === 'Hybrid') {
      switch (step) {
        case 2:
          setHybridTableType('1toM')
          break;
        case 3:
          setHybridTableType('1to1')
          break;
        default:
          break;
      }
    }
  }, [step, accessType])

  return (
    <>
      {accounts?.length > 0 ? currentAccounts.map((account) => (
        <tr key={account.id} className="z-10 p-4 text-center border-b border-blue-gray-50">
          <td>
            <input
              type="checkbox"
              checked={selectedRows.includes(account.id)}
              onChange={(e) => { handleSelected(e, account) }}
            />
          </td>
          <td className="p-4 text-center border-b border-blue-gray-50">
            <p className="font-normal text-blue-gray-900">
              {account.username}
            </p>
          </td>
          <td className="p-4 text-center border-b border-blue-gray-50">
            <p className="font-normal text-blue-gray-900">
              {account.email}
            </p>
          </td>
          <td className="p-4 text-center border-b border-blue-gray-50">
            <p className="font-normal text-blue-gray-900">
              {account.generated_password}
            </p>
          </td>
          {renderAccessCheckbox(account)}
          <SendEmailTD account={account} />
          <td className="p-4 text-center border-b border-blue-gray-50">
            <p className="font-normal text-blue-gray-900">
              {account.attempts}
            </p>
          </td>
          <ActionsTD
            setEditFormState={setEditFormState} setRemoveModalState={setRemoveModalState}
            account={account}
            setSelectedAccount={setSelectedAccount}
          />
        </tr>
      )) : <LoadingComponent />}
    </>
  );
}
