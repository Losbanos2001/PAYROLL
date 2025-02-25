import React, { useState, useEffect, useContext } from "react";
import { AccountContext, TimekeeperContext } from "../../../contexts";
import { TimekeeperAccount, ISendStateTimekeeper } from "../../../types";
import { useQueries } from '@tanstack/react-query';
import { get1to1Accs, get1toManyAccs } from "./helpers/api";
import { dummyTimekeeperData } from './helpers/dummyData';

export default function AccountWrapper({ children, }: { children: React.ReactNode; }) {
  const [currentAccounts, setCurrentAccounts] = useState<TimekeeperAccount[]>([]);
  const [accounts, setAccounts] = useState<TimekeeperAccount[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [maxPage, setMaxPage] = useState(1);
  const [selectedAccount, setSelectedAccount] = useState<any[] | {}>({})
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [enabledAccounts, setEnabledAccounts] = useState<any[]>([]);
  const { step, hybridTableType, accessType } = useContext(TimekeeperContext)

  const [sendState, setSendState] = useState<ISendStateTimekeeper>({
    account: {
      id: 0,
      username: "",
      email: ""
    },
    isOpen: false,
    type: ""
  });

  const [sentEmailsByID, setSentEmailsByID] = useState<any[]>([]);
  const [resetPassByID, setResetPassByID] = useState<any[]>([]);
  const [resetSignInByID, setResetSignInByID] = useState<any[]>([]);
  // const [enabledAccessByID, setEnabledAccessByID] = useState<any[]>([]);

  const results = useQueries({
    queries: [
      { 
        queryKey: ['1toM'], 
        queryFn: () => get1toManyAccs(), 
        enabled: step === 2 || step === 3,
        retry: 1,
        initialData: dummyTimekeeperData
      },
      { 
        queryKey: ['1to1'], 
        queryFn: () => get1to1Accs(), 
        enabled: step === 2 || step === 3,
        retry: 1,
        initialData: dummyTimekeeperData
      },
    ],
    combine: (results) => {
      return {
        accounts: results.map((result) => result.data),
        pending: results.some((result) => result.isPending),
      }
    },
  });

  useEffect(() => {
    if (!results.pending) {
      if (accessType === 'Hybrid') {
        if (hybridTableType === '1to1') {
          setAccounts(results?.accounts[1])
        } else {
          setAccounts(results?.accounts[0])
        }
      } else {
        if (accessType === '1to1') {
          setAccounts(results?.accounts[1])
        } else if (accessType === '1toM') {
          setAccounts(results?.accounts[0])
        }
      }
    }
  }, [hybridTableType, accessType, results]);

  useEffect(() => {
    console.log(results.accounts[0])
  }, [accounts])

  useEffect(() => {
    let filteredAccounts = accounts;
    if (searchTerm !== '') {
      filteredAccounts = accounts?.filter((account: TimekeeperAccount) => {
        const userNameMatch = account?.username?.toLowerCase().includes(searchTerm.toLowerCase());
        const emailMatch = account?.email.toLowerCase().includes(searchTerm.toLowerCase());
        return emailMatch || userNameMatch;
      });
    }

    const start = (currentPage - 1) * 10;
    const end = start + 10;
    setCurrentAccounts(filteredAccounts?.slice(start, end));
    setMaxPage(Math.ceil(filteredAccounts?.length / 10));
  }, [accounts, currentPage, searchTerm]);

  useEffect(() => { // temp
    if (sentEmailsByID.length > 0) {
      const timer = setTimeout(() => {
        setSentEmailsByID([]);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [sentEmailsByID]);

  useEffect(() => {
    console.log('Selected Account:', selectedAccount);
  }, [selectedAccount]);

  return (
    <AccountContext.Provider
      value={{
        accounts, sendState, setSendState,
        currentAccounts, setCurrentAccounts,
        selectedAccount, setSelectedAccount,
        currentPage, setCurrentPage,
        searchTerm, setSearchTerm,
        maxPage, setMaxPage,
        sentEmailsByID, setSentEmailsByID,
        resetPassByID, setResetPassByID,
        resetSignInByID, setResetSignInByID,
        selectedRows, setSelectedRows,
        enabledAccounts, setEnabledAccounts,
      }}>
      {children}
    </AccountContext.Provider>
  );
}
