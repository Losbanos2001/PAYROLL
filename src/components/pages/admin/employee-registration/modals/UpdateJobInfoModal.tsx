import * as Yup from 'yup';
import { useContext, useEffect, useMemo } from 'react';
import { EmployeeContext } from '../../../../contexts';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useGetDummyLocationData, useGetDummyDepartmentData, useGetDummyPositionData, useGetDummyEmploymentTypeData, useGetDummyScheduleData } from '../hooks/useDummyData';
import { initialJobProfileValues } from '../helpers/utils';
import { useQueries } from '@tanstack/react-query';
import useUpdateInfo from '../hooks/useUpdateInfo';
import type { JobProfile } from "../../../..//types";
import toast from "react-hot-toast";
import CustomToast from "../../../../Toast/CustomToast"
import { useQueryClient } from '@tanstack/react-query';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface QueryData {
  [key: string]: any[];
}

export default function UpdateJobInfoModal({ isOpen, onClose }: ModalProps) {
  const { selectedEmployee, setSelectedRows, setSelectedEmployee } = useContext(EmployeeContext)
  const { mutate } = useUpdateInfo()
  const queryClient = useQueryClient()

  const queries = useMemo(() => [
    { queryKey: ['locationData'], queryFn: () => useGetDummyLocationData() },
    { queryKey: ['departmentData'], queryFn: () => useGetDummyDepartmentData() },
    { queryKey: ['positionsData'], queryFn: () => useGetDummyPositionData() },
    { queryKey: ['employementTypesData'], queryFn: () => useGetDummyEmploymentTypeData() },
    { queryKey: ['schedulesData'], queryFn: () => useGetDummyScheduleData() }
  ], []);

  const query = useQueries({
    queries,
    combine: (results) => {
      return {
        data: results.map((result) => {
          if (result.data) {
            const key = Object.keys(result.data)[0];
            const items = Array.isArray((result.data as unknown as QueryData)[key]) 
              ? (result.data as unknown as QueryData)[key].filter((item: any) => item[key] !== '[Empty]') 
              : [];

            return {
              [key]: items
            };
          }
        }).filter(Boolean),
        pending: results.some((result) => result.isPending),
      };
    },
  });

  const jobInfoSchema = Yup.object().shape({
    id: Yup.number().optional(),
    employment_type: Yup.string().oneOf(
      query.data[3]?.employmenttypes?.map((type: any) => type.employmenttypes) || [],
      'Invalid employment type'
    ),
    date_hired: Yup.string().nullable(),
    schedule: Yup.string().oneOf(
      query.data[4]?.schedule?.map((sched: any) => sched.schedule_code) || [],
      'Invalid schedule'
    ),
    rate_status: Yup.string().oneOf(["Hourly", "Daily", "Monthly", "Freelance/Contract", "Commission"], "Invalid rate status"),
    department: Yup.string().oneOf(
      query.data[1]?.departments?.map((dep: any) => dep.departments) || [],
      'Invalid department'
    ),
    position: Yup.string().oneOf(
      query.data[2]?.positions?.map((pos: any) => pos.positions) || [],
      'Invalid position'
    ),
    hrs_per_day: Yup.number(),
    basic_salary: Yup.number().typeError('Invalid input.').positive('Invalid input.'),
    days_per_mos: Yup.number(),
    confidential_level: Yup.string().oneOf(["Low", "Medium", "High", "Very High"], "Invalid confidential level"),
    salary_effective_date: Yup.string().nullable(),
    location: Yup.string().oneOf(
      query.data[0]?.locations?.map((loc: any) => loc.locations) || [],
      'Invalid location'
    ),
  }) as Yup.ObjectSchema<JobProfile>;

  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting, isValid },
    reset,
    setValue
  } = useForm<JobProfile>({
    resolver: yupResolver<JobProfile>(jobInfoSchema),
    defaultValues: selectedEmployee,
    mode: 'onChange'
  });

  useEffect(() => {
    if (selectedEmployee) {
      const keys = Object.keys(initialJobProfileValues) as (keyof JobProfile)[];
      keys.forEach((key) => {
        setValue(key, selectedEmployee[key] ?? '', { shouldValidate: true });
      });
    }
  }, [selectedEmployee, setValue]);

  const onSubmit = async (data: any) => {
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== null && value !== '')
    );

    const updatedJobInfo = {
      employee_profile_id: selectedEmployee?.id,
      ...filteredData,
    };
    
    mutate(updatedJobInfo, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["employees"] });
        toast.custom(
          () => <CustomToast message="Successfully updated employee." type="success" />,
          { duration: 4000 }
        );
        handleClose();
      },
      onError: (error: any) => {
        toast.custom(
          () => <CustomToast message={error.message} type="error" />,
          { duration: 4000 }
        );
      },
    });
  };

  const handleClose = () => {
    reset();
    setSelectedRows([]);
    onClose();
  };

  return (
    <>
      {(isOpen) && (
        <div className="block absolute z-50">
          <div className="overflow-y-auto fixed inset-0">
            <div className="flex justify-center items-center px-4 pt-2 pb-20 min-h-screen text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
              <div className="inline-block overflow-hidden text-left align-bottom bg-white rounded-lg shadow-xl transition-all transform sm:my-8 sm:align-middle w-fit sm:mx-6 md:mx-28">
                <div className="text-center sm:text-left">
                  <div className="flex justify-between p-5 w-full bg-blue-600">
                    <h3 className="pr-2 text-lg font-medium leading-6 text-white truncate">
                      Update Employee Job Information
                    </h3>
                    <button onClick={() => { reset(); setSelectedRows([]); handleClose() }}>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z"
                          fill="white"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="mx-10">
                    <div className="flex flex-row justify-between my-6">
                      <h1 className="text-lg font-semibold text-blue-600">Job Information</h1>
                      <p onClick={() => reset(initialJobProfileValues)} className="mb-3 underline cursor-pointer text-end">
                        Clear All
                      </p>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="grid gap-5 my-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div>
                          <label htmlFor="employment_type" className="label-modal">
                            Employment Type
                            {errors.employment_type && (
                              <span className="ml-1 font-normal text-red-500">
                                {errors.employment_type.message}
                              </span>
                            )}
                          </label>
                          <select
                            className="input-text-modal"
                            {...register('employment_type')}
                          >
                            <option value="">Select employment type:</option>
                            {query.data[3]?.employmenttypes?.map((type: any) => (
                              <option key={type.id} value={type.employmenttypes}>
                                {type.employmenttypes}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label htmlFor="date_hired" className="label-modal">
                            Date Hired
                            {errors.date_hired && (
                              <span className="ml-1 font-normal text-red-500">
                                {errors.date_hired.message}
                              </span>
                            )}
                          </label>
                          <input
                            className="input-text-modal"
                            {...register('date_hired')}
                            type="date"
                            id="date_hired"
                            placeholder="Select date"
                          />
                        </div>
                        <div>
                          <label htmlFor="schedule" className="label-modal">
                            Schedule
                            {errors.schedule && (
                              <span className="ml-1 font-normal text-red-500">
                                {errors.schedule.message}
                              </span>
                            )}
                          </label>
                          <select
                            className="input-text-modal"
                            {...register('schedule')}
                            id="schedule"
                          >
                            <option value="">Select schedule:</option>
                            {query.data[4]?.schedule?.map((sched: any) => (
                              <option key={sched.id} value={sched.schedule_code}>
                                {sched.schedule_code}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label htmlFor="rate_status" className="label-modal">
                            Rate Status
                            {errors.rate_status && (
                              <span className="ml-1 font-normal text-red-500">
                                {errors.rate_status.message}
                              </span>
                            )}
                          </label>
                          <select
                            className="input-text-modal"
                            {...register('rate_status')}
                            id="rate_status"
                          >
                            <option value="">Select rate status:</option>
                            <option value="Hourly">Hourly</option>
                            <option value="Daily">Daily</option>
                            <option value="Monthly">Monthly</option>
                            <option value="Freelance/Contract">Freelance/Contract</option>
                            <option value="Commission">Commission</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="department" className="label-modal">
                            Department
                            {errors.department && (
                              <span className="ml-1 font-normal text-red-500">
                                {errors.department.message}
                              </span>
                            )}
                          </label>
                          <select
                            className="input-text-modal"
                            {...register('department')}
                            id="department"
                          >
                            <option value="">Select department:</option>
                            {query.data[1]?.departments?.map((dep: any) => (
                              <option key={dep.id} value={dep.departments}>
                                {dep.departments}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label htmlFor="position" className="label-modal">
                            Position
                            {errors.position && (
                              <span className="ml-1 font-normal text-red-500">
                                {errors.position.message}
                              </span>
                            )}
                          </label>
                          <select
                            className="input-text-modal"
                            {...register('position')}
                            id="position"
                          >
                            <option value="">Select position:</option>
                            {query.data[2]?.positions?.map((pos: any) => (
                              <option key={pos.id} value={pos.positions}>
                                {pos.positions}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label htmlFor="hrs_per_day" className="label-modal">
                            Hours per Day
                            {errors.hrs_per_day && (
                              <span className="ml-1 font-normal text-red-500">
                                {errors.hrs_per_day.message}
                              </span>
                            )}
                          </label>
                          <input
                            className="input-text-modal"
                            {...register('hrs_per_day')}
                            type="number"
                            id="hrs_per_day"
                            placeholder="Select hours"
                            max="24" min="1"
                          />
                        </div>
                        <div>
                          <label htmlFor="basic_salary" className="label-modal">
                            Base Salary
                            {errors.basic_salary && (
                              <span className="ml-1 font-normal text-red-500">
                                {errors.basic_salary.message}
                              </span>
                            )}
                          </label>
                          <input
                            className="input-text-modal"
                            {...register('basic_salary')}
                            type="text"
                            id="basic_salary"
                            placeholder="Select base salary"
                          />
                        </div>
                        <div>
                          <label htmlFor="days_per_mos" className="label-modal">
                            Days per Month
                            {errors.days_per_mos && (
                              <span className="ml-1 font-normal text-red-500">
                                {errors.days_per_mos.message}
                              </span>
                            )}
                          </label>
                          <input
                            className="input-text-modal"
                            {...register('days_per_mos')}
                            type="number"
                            id="days_per_mos"
                            max="31" min="1"
                            placeholder="Select days"
                          />
                        </div>
                        <div>
                          <label htmlFor="confidential_level" className="label-modal">
                            Confidential Level
                            {errors.confidential_level && (
                              <span className="ml-1 font-normal text-red-500">
                                {errors.confidential_level.message}
                              </span>
                            )}
                          </label>
                          <select
                            className="input-text-modal"
                            {...register('confidential_level')}
                            id="confidential_level"
                          >
                            <option value="">Select level:</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Very High">Very High</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="salary_effective_date" className="label-modal">
                            Salary Effectivity Date
                            {errors.salary_effective_date && (
                              <span className="ml-1 font-normal text-red-500">
                                {errors.salary_effective_date.message}
                              </span>
                            )}
                          </label>
                          <input
                            className="input-text-modal"
                            {...register('salary_effective_date')}
                            type="date"
                            id="salary_effective_date"
                            placeholder="Select date"
                          />
                        </div>
                        <div>
                          <label htmlFor="location" className="label-modal">
                            Main
                            {errors.location && (
                              <span className="ml-1 font-normal text-red-500">
                                {errors.location.message}
                              </span>
                            )}
                          </label>
                          <select
                            className="input-text-modal"
                            {...register('location')}
                            id="location"
                          >
                            <option value="">Select location:</option>
                            {query.data[0]?.locations?.map((loc: any) => (
                              <option key={loc.id} value={loc.locations}>
                                {loc.locations}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="justify-between my-7 sm:flex sm:flex-row-reverse">
                        <span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
                          <button 
                            disabled={isSubmitting || !isValid} 
                            type="submit"
                            className={`inline-flex justify-center px-10 py-2 w-full text-base font-bold leading-6 rounded-md border shadow-sm transition duration-150 ease-in-out focus:outline-none sm:text-sm sm:leading-5 ${
                              isSubmitting || !isValid 
                                ? 'bg-gray-400 text-gray-100 cursor-not-allowed border-gray-500'
                                : 'text-white bg-blue-600 border-blue-700 hover:bg-blue-500 hover:shadow-md focus:shadow-outline-blue'
                            }`}
                          >
                            {isSubmitting ? "Submitting..." : !isValid ? "Invalid fields" : "Save Updates"}
                          </button>
                        </span>
                        <span className="flex mt-3 w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
                          <button 
                            type="button" 
                            onClick={handleClose}
                            className="px-16 cancel-upload-csv-btn"
                          >
                            Close
                          </button>
                        </span>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}