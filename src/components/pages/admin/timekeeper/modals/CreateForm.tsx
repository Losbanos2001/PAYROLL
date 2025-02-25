import { useForm, Controller } from 'react-hook-form';
import MultiSelect from '../../timekeeper/MultiSelect';
import useGetDepartmentData from '../../self-service/location/hooks/Department/useGetDepatmentData';
import useGetLocationData from '../../self-service/location/hooks/Location/useGetLocationData';
import { FormTooltip } from '../Tooltip';
import { TimekeeperContext } from '@/components/contexts';
import useAddAccount from '../hooks/useAddAccount'
import { useQueries, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState, useMemo, useContext } from "react";
import toast from 'react-hot-toast';
import CustomToast from '@/components/Toast/CustomToast';
import { dummyLocations, dummyDepartments } from '../helpers/dummyData';

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

// Add type for the expected data structure
interface QueryData {
  data: {
    [key: string]: any[];
  };
}

export default function CreateFormModal({ isOpen, onClose }: ModalProps) {
  const [selected, setSelected] = useState<SelectedState>({
    location: [],
    department: [],
    rate_status: [],
  });
  const { accessType, hybridTableType } = useContext(TimekeeperContext);
  const [queryKey, setQueryKey] = useState<string>("");
	const [tooltipVisible, setTooltipVisible] = useState<string | null>(null);
	const { mutate, isPending} = useAddAccount();
	const queryClient = useQueryClient();

  const rateStatus = ["Hourly", "Daily", "Monthly", "Freelance/Contract", "Commission"];

  // Flag to toggle between dummy data and API data
  const useDummyData = true; // Set this to false when you want to use API data

  const { control, handleSubmit, reset, setValue, register, formState: { errors, isValid, isSubmitting } } = useForm<TimekeeperValues>({
    defaultValues: {
      username: "",
      email: "",
      location: [],
      department: [],
      rate_status: [],
    }
  });

  const queries = useMemo(() => [
    { queryKey: ['locationData'], queryFn: () => useGetLocationData(), enabled: isOpen && !useDummyData },
    { queryKey: ['departmentData'], queryFn: () => useGetDepartmentData(), enabled: isOpen && !useDummyData },
  ], [isOpen, useDummyData]);

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
    if (accessType === '1to1' || (accessType === 'Hybrid' && hybridTableType === '1to1')) {
      setQueryKey('1to1');
    } else {
      setQueryKey('1toM');
    }
  }, [accessType, hybridTableType]);

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
      validate: value => value.length > 0 && value.every(v => 
        useDummyData 
          ? dummyLocations.includes(v)
          : query?.data[0]?.locations.includes(v)
      )
    });
    register("department", {
      required: "(Required)",
      validate: value => value.length > 0 && value.every(v => 
        useDummyData 
          ? dummyDepartments.includes(v)
          : query?.data[1]?.departments.includes(v)
      )
    });
    register("rate_status", {
      required: "(Required)",
      validate: value => value.length > 0 && value.every(v => rateStatus.includes(v))
    });
  }, [register, query?.data, rateStatus]);

  const onSubmit = async (data: TimekeeperValues) => {
    const accountType = queryKey === '1to1' ? "one to one" : "one to many";
    const transformedValues = {
      ...data,
      account_type: accountType,
      location: data.location.join(', '),
      department: data.department.join(', '),
      rate_status: data.rate_status.join(', ')
    };
	mutate(transformedValues, {
		onSuccess: (data: any) => {
		  queryClient.invalidateQueries({ queryKey: ['accounts'] });
		  toast.custom(
			() => <CustomToast message={`Account created successfully! Data: ${JSON.stringify(data)}`} type="success" />,
			{ duration: 4000 }
		  );
		  reset();
		  onClose();
		},
		onError: (error: any) => {
		  queryClient.invalidateQueries({ queryKey: ['accounts'] });
		  toast.custom(
			() => <CustomToast message={`Error: ${error?.message || 'Failed to add account.'}`} type="error" />,
			{ duration: 4000 }
		  );
		},
	  });
	};	  

  const handleClose = () => {
    setSelected({ location: [], department: [], rate_status: [] });
    reset();
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div className="block absolute z-50">
          <div className="overflow-y-auto fixed inset-0">
            <div className="flex justify-center items-center px-4 pt-2 pb-20 min-h-screen text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity">
                <div className="absolute inset-0 bg-[#5982ff] opacity-40 mix-blend-lighten"></div>
              </div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
              <div className="inline-block overflow-hidden text-left align-bottom bg-white rounded-lg shadow-xl transition-all transform sm:my-8 sm:align-middle w-fit sm:mx-6 md:mx-28">
                <div className="text-center sm:text-left">
                  {query.pending && !useDummyData ? (
                    <div className="p-10">Please wait...</div>
                  ) : (
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="flex justify-between p-5 w-full bg-blue-600">
                        <h3 className="pr-2 text-lg font-medium leading-6 text-white truncate">
                          Create Timekeeper Account
                        </h3>
                        <button type="button" onClick={handleClose}>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" fill="white"/>
                          </svg>
                        </button>
                      </div>
                      <div className="mx-10">
                        <div className="my-4 space-y-3">
                          {/* Username Field */}
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

                          {/* Email Field */}
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

                          {/* Location MultiSelect */}
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
                                    items={useDummyData ? dummyLocations : query?.data[0]?.locations}
                                    itemType="location"
                                    setFieldValue={(name: string, value: string[]) => setValue(name as keyof TimekeeperValues, value)}
                                  />
                                )}
                              />
                              {/* Location Select/Deselect buttons */}
                              <div className="flex space-x-3 mt-2.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const locations = useDummyData ? dummyLocations : query?.data[0]?.locations;
                                    setValue('location', locations);
                                    setSelected(prev => ({ ...prev, location: locations }));
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

                          {/* Department MultiSelect */}
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
                                    items={useDummyData ? dummyDepartments : query?.data[1]?.departments}
                                    itemType="department"
                                    setFieldValue={(name: string, value: string[]) => setValue(name as keyof TimekeeperValues, value)}
                                  />
                                )}
                              />
                              <div className="flex space-x-3 mt-2.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const departments = useDummyData ? dummyDepartments : query?.data[1]?.departments;
                                    setValue('department', departments);
                                    setSelected(prev => ({ ...prev, department: departments }));
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

                          {/* Rate Status MultiSelect */}
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
                              type="submit"
                              disabled={isPending}
                              className={`inline-flex justify-center w-full rounded-md border px-10 py-2 text-base leading-6 font-bold text-white shadow-sm focus:outline-none transition ease-in-out duration-150 sm:text-sm sm:leading-5 ${
                                !isValid
                                  ? 'bg-green-600 border-green-700'
                                  : 'bg-blue-600 border-blue-700 hover:bg-green-800 hover:shadow-md'
                              }`}
                            >
                              {isPending ? "Submitting..." : "Submit"}
                            </button>
                          </span>
                          <span className="flex mt-3 w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
                            <button
                              type="button"
                              onClick={handleClose}
                              className="inline-flex justify-center px-10 py-2 w-full text-base font-bold leading-6 text-white bg-red-500 rounded-md border border-red-600 shadow-sm transition duration-150 ease-in-out focus:outline-none hover:bg-red-700 focus:shadow-outline-blue sm:text-sm sm:leading-5"
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