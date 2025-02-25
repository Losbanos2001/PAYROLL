import { useForm, Controller } from 'react-hook-form';
import MultiSelect from '../MultiSelect';
import useGetDepartmentData from '../../self-service/location/hooks/Department/useGetDepatmentData';
import useGetLocationData from '../../self-service/location/hooks/Location/useGetLocationData';
import { FormTooltip } from '../Tooltip';
import { AccountContext } from '@/components/contexts';
import useUpdateAccount from '../hooks/useUpdateAccount';
import { useQueries, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState, useMemo, useContext } from "react";
import toast from 'react-hot-toast';
import CustomToast from '@/components/Toast/CustomToast';

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
}

type TimekeeperValues = {
	username: string;
	email: string;
	location: string[];
	department: string[];
	rate_status: string[];
};

type SelectedState = {
	location: string[];
	department: string[];
	rate_status: string[];
};

interface QueryData {
	data: {
		[key: string]: any[];
	};
}

export default function EditFormModal({ isOpen, onClose }: ModalProps) {
	const [selected, setSelected] = useState<SelectedState>({
		location: [],
		department: [],
		rate_status: [],
	});
	const { selectedAccount, setSelectedRows } = useContext(AccountContext);
	const [queryKey, setQueryKey] = useState<string>("");
	const [tooltipVisible, setTooltipVisible] = useState<string | null>(null);
	const { mutate, isPending } = useUpdateAccount();
	const queryClient = useQueryClient();

	const rateStatus = ["Hourly", "Daily", "Monthly", "Freelance/Contract", "Commission"];

	const { control, handleSubmit, reset, setValue, register, formState: { errors, isValid } } = useForm<TimekeeperValues>({
		defaultValues: {
			username: "",
			email: "",
			location: [],
			department: [],
			rate_status: [],
		}
	});

	const queries = useMemo(() => [
		{ queryKey: ['locationData'], queryFn: () => useGetLocationData(), enabled: isOpen },
		{ queryKey: ['departmentData'], queryFn: () => useGetDepartmentData(), enabled: isOpen },
	], [isOpen]);

	const query = useQueries({
		queries,
		combine: (results) => ({
			data: results.map((result) => {
				let transformedData: { [key: string]: any } = {};
				for (let key in (result.data as unknown as QueryData['data'] || {})) {
					transformedData[key] = ((result.data as unknown as QueryData['data']) || {})[key]
						.map((item: { [key: string]: any }) => item[key])
						.filter((value: any) => value !== '[Empty]');

					transformedData[key] = transformedData[key].filter((value: any, index: any, self: any) => {
						return self.indexOf(value) === index;
					});
				}
				return transformedData;
			}),
			pending: results.some((result) => result.isPending),
		}),
	});

	useEffect(() => {
		if (selectedAccount) {
			setValue('username', selectedAccount.username);
			setValue('email', selectedAccount.email);
			
			const locationArray = selectedAccount.location?.split(', ') || [];
			const departmentArray = selectedAccount.department?.split(', ') || [];
			const rateStatusArray = selectedAccount.rate_status?.split(', ') || [];
			
			setValue('location', locationArray);
			setValue('department', departmentArray);
			setValue('rate_status', rateStatusArray);
			
			setSelected({
				location: locationArray,
				department: departmentArray,
				rate_status: rateStatusArray
			});

			setQueryKey(selectedAccount.account_type === 'one to one' ? '1to1' : '1toM');
		}
	}, [selectedAccount, setValue]);

	useEffect(() => {
		register("username", { required: "(Required)" });
		register("email", {
			required: "(Required)",
			pattern: {
				value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
				message: "(Invalid email address.)"
			}
		});
		register("location", {
			required: "(Required)",
			validate: value => value.length > 0 && value.every(v => query?.data[0]?.locations.includes(v))
		});
		register("department", {
			required: "(Required)",
			validate: value => value.length > 0 && value.every(v => query?.data[1]?.departments.includes(v))
		});
		register("rate_status", {
			required: "(Required)",
			validate: value => value.length > 0 && value.every(v => rateStatus.includes(v))
		});
	}, [register, query?.data, rateStatus]);

	const onSubmit = async (data: TimekeeperValues) => {
		const transformedValues = {
			id: selectedAccount.id,
			...data,
			location: data.location.join(', '),
			department: data.department.join(', '),
			rate_status: data.rate_status.join(', ')
		};

		mutate(transformedValues, {
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['accounts'] });
				toast.custom(
					() => <CustomToast message="Successfully updated account." type="success" />,
					{ duration: 4000 }
				);
				handleClose();
			},
			onError: (error: any) => {
				toast.custom(
					() => <CustomToast message={error.message || 'Failed to update account.'} type="error" />,
					{ duration: 4000 }
				);
			},
		});
	};

	const handleClose = () => {
		setSelected({ location: [], department: [], rate_status: [] });
		setSelectedRows([]);
		reset();
		onClose();
	};

	return (
		<>
			{isOpen && (
				<div className="absolute z-50 block">
					<div className="fixed inset-0 overflow-y-auto">
						<div className="flex items-center justify-center min-h-screen px-4 pt-2 pb-20 text-center sm:block sm:p-0">
							<div className="fixed inset-0 transition-opacity">
								<div className="absolute inset-0 bg-[#5982ff] opacity-40 mix-blend-lighten"></div>
							</div>
							<span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
							<div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle w-fit sm:mx-6 md:mx-28">
								<div className="text-center sm:text-left">
								{query.pending ? (
									<div className="p-10">Please wait...</div>
									) : (
									<form onSubmit={handleSubmit(onSubmit)}>
									<div className="flex justify-between w-full p-5 bg-blue-600">
										<h3 className="pr-2 text-lg font-medium leading-6 text-white truncate">
											Edit Timekeeper Account
										</h3>
										<button onClick={handleClose}>
											<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" fill="white"/>
											</svg>
										</button>
									</div>
									<div className="mx-10">
												<div className="my-4 space-y-3">
													<div>
														<label htmlFor="username" className="label-modal">
															Username<span className="text-red-500">*</span>
															{errors.username && (
																<span className="text-red-500 ml-1.5">{errors.username.message}</span>
															)}
														</label>
														<Controller
															name="username"
															control={control}
															render={({ field }) => (
																<input
																	{...field}
																	type="text"
																	className="input-text-modal"
																	placeholder="Enter Username..."
																/>
															)}
														/>
													</div>
													<div>
														<label htmlFor="email" className="label-modal">
															Email<span className="text-red-500">*</span>
															{errors.email && (
																<span className="text-red-500 ml-1.5">{errors.email.message}</span>
															)}
														</label>
														<Controller
															name="email"
															control={control}
															render={({ field }) => (
																<input
																	{...field}
																	type="email"
																	className="input-text-modal"
																	placeholder="Enter Email..."
																/>
															)}
														/>
													</div>
													<div>
														<span
															onMouseEnter={() => setTooltipVisible('location-label')}
															onMouseLeave={() => setTooltipVisible(null)}>
															<label htmlFor="location" id="location-label" className="label-modal">
																Location<span className="text-red-500">*</span>
																{errors.location && (
																	<span className="text-red-500 ml-1.5">{errors.location.message}</span>
																)}
															</label>
															{tooltipVisible === 'location-label' && (
																<FormTooltip id="location-label" type="location" action="default" tooltipVisible={tooltipVisible} />
															)}
														</span>
														<Controller
															name="location"
															control={control}
															render={({ field }) => (
																<MultiSelect
																	initialSelected={field.value}
																	setSelected={setSelected}
																	selected={selected.location}
																	items={query?.data[0]?.locations}
																	itemType="location"
																	setFieldValue={(name: string, value: string[]) => setValue(name as keyof TimekeeperValues, value)}
																/>
															)}
														/>
														<div className="flex space-x-3 mt-2.5">
															<button
																type="button"
																onClick={() => {
																	setValue('location', query?.data[0]?.locations);
																	setSelected(prev => ({ ...prev, location: query?.data[0]?.locations }));
																}}
																className="underline text-slate-400 hover:text-slate-800"
															>
																Select All
															</button>
															<button
																type="button"
																onClick={() => {
																	setValue('location', []);
																	setSelected(prev => ({ ...prev, location: [] }));
																}}
																className="underline text-slate-400 hover:text-slate-800"
															>
																Deselect All
															</button>
														</div>
													</div>
													<div>
														<span
															onMouseEnter={() => setTooltipVisible('department-label')}
															onMouseLeave={() => setTooltipVisible(null)}>
															<label htmlFor="department" id="department-label" className="label-modal">
																Department<span className="text-red-500">*</span>
																{errors.department && (
																	<span className="text-red-500 ml-1.5">{errors.department.message}</span>
																)}
															</label>
															{tooltipVisible === 'department-label' && (
																<FormTooltip id="department-label" type="department" action="default" tooltipVisible={tooltipVisible} />
															)}
														</span>
														<Controller
															name="department"
															control={control}
															render={({ field }) => (
																<MultiSelect
																	initialSelected={field.value}
																	setSelected={setSelected}
																	selected={selected.department}
																	items={query?.data[1]?.departments}
																	itemType="department"
																	setFieldValue={(name: string, value: string[]) => setValue(name as keyof TimekeeperValues, value)}
																/>
															)}
														/>
														<div className="flex space-x-3 mt-2.5">
															<button
																type="button"
																onClick={() => {
																	setValue('department', query?.data[1]?.departments);
																	setSelected(prev => ({ ...prev, department: query?.data[1]?.departments }));
																}}
																className="underline text-slate-400 hover:text-slate-800"
															>
																Select All
															</button>
															<button
																type="button"
																onClick={() => {
																	setValue('department', []);
																	setSelected(prev => ({ ...prev, department: [] }));
																}}
																className="underline text-slate-400 hover:text-slate-800"
															>
																Deselect All
															</button>
														</div>
													</div>
													<div>
														<span
															onMouseEnter={() => setTooltipVisible('rate_status-label')}
															onMouseLeave={() => setTooltipVisible(null)}>
															<label htmlFor="rate_status" id="rate_status-label" className="label-modal">
																Rate Status<span className="text-red-500">*</span>
																{errors.rate_status && (
																	<span className="text-red-500 ml-1.5">{errors.rate_status.message}</span>
																)}
															</label>
															{tooltipVisible === 'rate_status-label' && (
																<FormTooltip id="rate_status-label" type="rate_status" action="default" tooltipVisible={tooltipVisible} />
															)}
														</span>
														<Controller
															name="rate_status"
															control={control}
															render={({ field }) => (
																<MultiSelect
																	initialSelected={field.value}
																	setSelected={setSelected}
																	selected={selected.rate_status}
																	items={rateStatus}
																	itemType="rate_status"
																	setFieldValue={(name: string, value: string[]) => setValue(name as keyof TimekeeperValues, value)}
																/>
															)}
														/>
														<div className="flex space-x-3 mt-2.5">
															<button
																type="button"
																onClick={() => {
																	setValue('rate_status', rateStatus);
																	setSelected(prev => ({ ...prev, rate_status: rateStatus }));
																}}
																className="underline text-slate-400 hover:text-slate-800"
															>
																Select All
															</button>
															<button
																type="button"
																onClick={() => {
																	setValue('rate_status', []);
																	setSelected(prev => ({ ...prev, rate_status: [] }));
																}}
																className="underline text-slate-400 hover:text-slate-800"
															>
																Deselect All
															</button>
														</div>
													</div>
												</div>
												<div className="justify-between my-7 sm:flex sm:flex-row-reverse">
													<span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
														<button
															disabled={isPending || !isValid}
															type="submit"
															className={`upload-csv-btn ${
																isPending || !isValid ? 'bg-gray-400 cursor-not-allowed' : ''
															}`}
														>
															{isPending ? "Submitting..." : !isValid ? "Invalid fields" : "Update"}
														</button>
													</span>
													<span className="flex w-full mt-3 rounded-md shadow-sm sm:mt-0 sm:w-auto">
														<button
															type="button"
															onClick={handleClose}
															className="cancel-upload-csv-btn"
														>
															Close
														</button>
													</span>
												</div>
											</div>
										</form>		
									)}
								</div>	
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}