import React, { useState, useEffect } from "react";
import { LogsContext } from "../../../contexts";
import { useQuery} from '@tanstack/react-query';
import { getLogs } from "./helpers/api";
import { dummyPayrollData } from './helpers/dummyData';

export default function LogWrapper({ children, }: { children: React.ReactNode; }) {
	const [currentLogs, setCurrentLogs] = useState<any[]>([]);
	const [logs, setLogs] = useState<any[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [maxPage, setMaxPage] = useState(1);
	const [selectedLog, setSelectedLog] = useState<any>({
		id: 0,
		employee: {
			id: '',
			firstname: '',
			lastname: '',
			old_employee_id: null,
			employeeid: '',
			employeeid2: 0,
			email: ''
		},
		date: '',
		sync_id: '0',
		timein: '',
		timeout: '',
		timeinImg: null,
		timeoutImg: null,
		timein_reason: '',
		timeout_reason: '',
		remove_reason: null,
		is_active: false,
		company: 0
	})
	const [selectedRows, setSelectedRows] = useState<any[]>([]);
	

	const { data: logsData, isLoading } = useQuery({
		queryKey: ['logs'],
		// queryFn: getLogs
		queryFn: () => Promise.resolve(dummyPayrollData)
	});

	const formatDateTime = (dateTimeString: string) => {
		const date = new Date(dateTimeString);

		const month = date.toLocaleString('en-US', { month: 'short' });
		const day = date.getDate();
		const year = date.getFullYear();
		const hour = date.getHours() % 12 || 12;
		const minute = date.getMinutes().toString().padStart(2, '0');
		const second = date.getSeconds().toString().padStart(2, '0');
		const period = date.getHours() < 12 ? 'AM' : 'PM';

		return `${month} ${day}, ${year} | ${hour}:${minute}:${second} ${period}`;
	}

	useEffect(() => {
		if (!isLoading) {
			// const data: any[] = logsData?.map((item: any) => ({
			const data = logsData?.map((item: any) => ({
				...item,
				employee: {
					id: item.employee.id,
					firstname: item.employee.firstname,
					lastname: item.employee.lastname,
					old_employee_id: item.employee.old_employee_id,
					employeeid: item.employee.employeeid,
					employeeid2: item.employee.employeeid2,
					email: item.employee.email,
				},
				//formatDateTime(item.time_in),
				//formatDateTime(item.time_out)
			// }));
			})) ?? [];
			setLogs(data)
			// setLogs(logsData)
		}
	}, [isLoading, logsData]);

	useEffect(() => {
		if (logs) console.log(logs)
	}, [logs])

	/* useEffect(() => {
		const logsSample = [
			{
				id: 1,
				date: "2024-05-01",
				employee: "John Doe",
				employee_id: "101",
				reason: "",
				time_in: "08:00:00 AM",
				time_out: "17:30:00 PM",
			},
			{
				id: 2,
				date: "2024-05-01",
				employee: "John Dayada",
				employee_id: "102",
				reason: "",
				time_in: "08:00:00 AM",
				time_out: "17:30:00 PM",
			},
			{
				id: 3,
				date: "2024-05-01",
				employee: "John Dolondon",
				employee_id: "103",
				reason: "",
				time_in: "08:00:00 AM",
				time_out: "17:30:00 PM",
			}
		]
		setLogs(logsSample)
	}, []) */

	useEffect(() => {
		let filteredAccounts = logs;

		const start = (currentPage - 1) * 10;
		const end = start + 10;
		setCurrentLogs(filteredAccounts?.slice(start, end));
		setMaxPage(Math.ceil(filteredAccounts?.length / 10));
	}, [logs, currentPage]);

	return (
		<LogsContext.Provider
			value={{
				logs, setLogs,
				currentLogs, setCurrentLogs,
				selectedLog, setSelectedLog,
				currentPage, setCurrentPage,
				maxPage, setMaxPage,
				selectedRows, setSelectedRows
			}}>
			{children}
		</LogsContext.Provider>
	);
}
