import toast from "react-hot-toast";
import CustomToast from "@/components/Toast/CustomToast";
import { FC, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { IoSettingsSharp } from "react-icons/io5";
import classNames from "@/helpers/classNames";
import useTagRestday from "@/components/hooks/useTagRestDay";
import useAddSchedule from "../hooks/useAddSchedule";
import useGetScheduleData from '../hooks/useGetScheduleData';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  refetch?: () => void;
}

interface FormData {
  name: string;
  timein: string;
  timeout: string;
  workhours: string;
  flexible_time: boolean;
  workdays: number[]; 
  break_details: {
    breakfrom: string;
    breakto: string;
  }[];
}

const CreateScheduleModal: FC<ModalProps> = ({ isOpen, onClose, refetch }) => {
  const modalClassName = isOpen ? "block absolute z-10" : "hidden";
  const [inputRestday, setInputRestday] = useState("");
  const { } =
    useTagRestday(inputRestday, setInputRestday);
  const [isScheduleSettingsOpen, setIsScheduleSettingsOpen] = useState(false);
  const [scheduleSettings, setScheduleSettings] = useState({
    flexible_time: false,
    breakhours: 0.0,
    isFlexibleHoursChecked: false,
    isFixedHoursChecked: false,
    isBreakTimeChecked: false,
    breaks: 0,
  });

  const { control, handleSubmit, reset, setValue, getValues } =
    useForm<FormData>({
      defaultValues: {
        name: "",
        timein: "",
        timeout: "",
        workhours: "",
        flexible_time: false,
        workdays: [], // Initialize as an empty array
        break_details: [
          {
            breakfrom: "",
            breakto: "",
          },
        ],
      },
    });

  const [timeInputs, setTimeInputs] = useState<
    { breakfrom: string; breakto: string }[]
  >([]);

  const { refetch: refetchScheduleData } = useGetScheduleData(1, 10);

  const showToast = (message: string, type: string) => {
    toast.custom(() => <CustomToast message={message} type={type} />, {
      duration: 4000,
    });
  };

  const { mutate, isPending} = useAddSchedule();

  const onSubmit = async (data: any) => {
    if (!data.timein || !data.timeout) {
      showToast("Please provide both Time In and Time Out.", "error");
      return;
    }

    const timeIn = data.timein.split(":").map(Number);
    const timeOut = data.timeout.split(":").map(Number);

    if (timeIn.length !== 2 || timeOut.length !== 2) {
      showToast("Time In and Time Out must be in HH:MM format.", "error");
      return;
    }

    let breakHours = 0;
    if (scheduleSettings.isBreakTimeChecked && scheduleSettings.isFixedHoursChecked) {
      if (data.break_details && scheduleSettings.breaks) {
        data.break_details = data.break_details.slice(0, scheduleSettings.breaks);
      }
      breakHours = data.break_details?.reduce((total: number, breakTime: { breakfrom: string; breakto: string }) => {
        const [fromHours, fromMinutes] = breakTime.breakfrom.split(":").map(Number);
        const [toHours, toMinutes] = breakTime.breakto.split(":").map(Number);
        const breakDuration = (toHours - fromHours) + (toMinutes - fromMinutes) / 60;
          return total + breakDuration;
        }, 0) || 0;
    } else {
      breakHours = Number(scheduleSettings.breakhours) || 0;
    }

    const totalWorkHours =
      timeOut[0] - timeIn[0] + (timeOut[1] - timeIn[1]) / 60;

    if (scheduleSettings.flexible_time) {
    } else if (scheduleSettings.isFlexibleHoursChecked) {
      const totalExpectedHours = totalWorkHours - breakHours;
      if (Number(data.workhours) !== totalExpectedHours) {
        showToast(
          `Hours Per Day Must be ${totalExpectedHours.toFixed(2)} Hours.`,
          "error"
        );
        return;
      }
    } else if (scheduleSettings.isFixedHoursChecked) {
      const totalExpectedHours = totalWorkHours - breakHours;
      if (Number(data.workhours) !== totalExpectedHours) {
        showToast(
          `Hours Per Day Must be ${totalExpectedHours.toFixed(2)} Hours.`,
          "error"
        );
        return;
      }
    } else {
      if (data.workhours && Number(data.workhours) !== totalWorkHours) {
        showToast(
          `Hours Per Day Must be ${totalWorkHours.toFixed(2)} Hours.`,
          "error"
        );
        return;
      }
    }

    const selectedWorkdays = data.workdays || [];

    const breakTimes = timeInputs.map((input) => ({
      from: input.breakfrom,
      to: input.breakto,
    }));

    const submitData = {
      ...data,
      workdays: selectedWorkdays,
      breakTimes, 
      ...scheduleSettings,
    };

    mutate(submitData);

    setScheduleSettings({
      flexible_time: false,
      breakhours: 0.0,
      isFlexibleHoursChecked: false,
      isFixedHoursChecked: false,
      isBreakTimeChecked: false,
      breaks: 0,
    });
    reset();
  };

  const handleClose = (resetForm: any) => {
    resetForm();
    onClose();
  };

  const handleSaveSettings = async () => {
    try {
      const breakType = scheduleSettings.isFixedHoursChecked
        ? "fixed"
        : scheduleSettings.isFlexibleHoursChecked
        ? "flexible"
        : "nobreak";

      setScheduleSettings((prev) => ({
        ...prev,
        flexible_time: scheduleSettings.flexible_time,
        breaks: scheduleSettings.breaks,
        breakhours: scheduleSettings.breakhours,
        break_type: breakType,
      }));
      setIsScheduleSettingsOpen(false);
      if (refetch && typeof refetch === 'function') {
        await refetch();
      }
      if (refetchScheduleData && typeof refetchScheduleData === 'function') {
        await refetchScheduleData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Add state for error messages
  const [errorMessages] = useState<{ [key: string]: string }>(
    {}
  );

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {isOpen && (
          <div className={`modal ${modalClassName}`}>
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex items-center justify-center min-h-screen px-4 pt-2 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity">
                  <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:pb-6 w-[406px]">
                  <div className="text-center sm:text-left">
                    <div className="flex justify-between w-full p-2 bg-blue-600">
                      <h3 className="text-lg font-medium leading-6 text-white">
                        Create Schedules
                      </h3>
                      <button type="button" onClick={() => handleClose(reset)}>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z"
                            fill="white"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="flex justify-end px-4 py-2 ">
                      <div
                        onClick={() => setIsScheduleSettingsOpen(true)}
                        className="p-2 border-2 cursor-pointer"
                      >
                        {" "}
                        {/* Open ScheduleSettings modal on click */}
                        <IoSettingsSharp className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="px-4 py-4 mx-6">
                      <div className="flex flex-col">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div>
                              <label
                                htmlFor="schedule_code"
                                className="mb-1 text-sm font-normal"
                              >
                                Schedule Code
                              </label>
                              <Controller
                                control={control}
                                name="name"
                                render={({ field }) => (
                                  <input
                                    {...field}
                                    className={`pl-2 border-2 h-[46px] w-full border-[#878787] rounded-[5px]`}
                                    type="text"
                                    id="schedule_code"
                                  />
                                )}
                              />
                            </div>
                          </div>
                          <div className="flex space-x-4">
                            <div className="py-2 xl:w-1/2 lg:w-full">
                              <h1 className="mb-1 text-sm font-normal">
                                Time In
                              </h1>
                              <div className="flex space-x-2">
                                <Controller
                                  control={control}
                                  name="timein"
                                  render={({ field }) => (
                                    <>
                                      <input
                                        {...field}
                                        className="px-2 border-2 border-[#878787] rounded-[5px] h-[53.57px] w-full"
                                        type="text"
                                        placeholder="HH:MM:SS"
                                      />
                                      {errorMessages.timein && (
                                        <p className="text-red-500">
                                          {errorMessages.timein}
                                        </p>
                                      )}
                                    </>
                                  )}
                                />
                              </div>
                            </div>
                            <div className="py-2 xl:w-1/2 lg:w-full">
                              <h1 className="mb-1 text-sm font-normal">
                                Time Out
                              </h1>
                              <div className="flex space-x-2">
                                <Controller
                                  control={control}
                                  name="timeout"
                                  render={({ field }) => (
                                    <>
                                      <input
                                        {...field}
                                        className="px-2 border-2 border-[#878787] rounded-[5px] h-[53.57px] w-full"
                                        type="text"
                                        placeholder="HH:MM:SS"
                                      />
                                      {errorMessages.timeout && (
                                        <p className="text-red-500">
                                          {errorMessages.timeout}
                                        </p>
                                      )}
                                    </>
                                  )}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <label
                                htmlFor="workhours"
                                className="mb-1 text-sm font-normal"
                              >
                                Work Hours
                              </label>
                              <Controller
                                control={control}
                                name="workhours"
                                render={({ field }) => (
                                  <input
                                    {...field}
                                    className={`pl-2 border-2 h-[46px] w-full border-[#878787] rounded-[5px]`}
                                    type="number"
                                    id="workhours"
                                  />
                                )}
                              />
                            </div>
                          </div>
                          <div>
                            <label
                              htmlFor="rest_day"
                              className="mb-1 text-sm font-normal"
                            >
                              Rest Day
                            </label>
                            <div className="flex flex-col">
                              {[
                                "Sunday",
                                "Monday",
                                "Tuesday",
                                "Wednesday",
                                "Thursday",
                                "Friday",
                                "Saturday",
                              ].map((day, index) => (
                                <div key={day} className="flex items-center">
                                  <input
                                    type="checkbox"
                                    id={day}
                                    value={index} // Corresponding number for the day
                                    onChange={(e) => {
                                      const value = Number(e.target.value);
                                      const currentWorkdays =
                                        getValues("workdays") || []; // Get current workdays
                                      if (e.target.checked) {
                                        // Add to workdays if checked
                                        setValue("workdays", [
                                          ...currentWorkdays,
                                          value,
                                        ]);
                                      } else {
                                        // Remove from workdays if unchecked
                                        setValue(
                                          "workdays",
                                          currentWorkdays.filter(
                                            (day: number) => day !== value
                                          )
                                        );
                                      }
                                    }}
                                  />
                                  <label htmlFor={day} className="ml-2">
                                    {day}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="pt-10 mt-2 sm:flex sm:flex-row-reverse">
                        <span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
                          <button type="submit"
                            disabled={isPending}
                            className="inline-flex justify-center w-full rounded-md border border-transparent px-10 py-2 bg-[#355FD0] text-base leading-6 font-bold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:shadow-outline-green transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                          >
                            {isPending ? 'Saving...' : 'Save'}
                          </button>
                        </span>
                        <span className="flex w-full mt-3 rounded-md shadow-sm sm:mt-0 sm:w-auto">
                          <button type="button"
                            className="cancel-upload-csv-btn"
                            onClick={() => handleClose(reset)}
                            >
                            Close
                          </button>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>

      {/* ScheduleSettings modal component */}
      {isScheduleSettingsOpen && (
        <div className={`block absolute z-10 modal`}>
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-2 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:pb-6 w-[406px]">
                <div className="text-center sm:text-left">
                  <div className="flex justify-between w-full p-2 bg-blue-600">
                    <h3 className="text-lg font-medium leading-6 text-white">
                      Schedule Settings
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsScheduleSettingsOpen(false)}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z"
                          fill="white"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="px-4 py-4 mx-6">
                    {/* Add your form fields for Schedule Settings here */}
                    <div className="flex flex-col">
                      <div className="mb-4">
                        <input
                          type="checkbox"
                          id="flexible_time"
                          checked={scheduleSettings.flexible_time}
                          onChange={(e) => {
                            setScheduleSettings((prev) => ({
                              ...prev,
                              flexible_time: e.target.checked,
                              isBreakTimeChecked: false,
                            }));
                          }}
                          disabled={scheduleSettings.isBreakTimeChecked}
                        />
                        <label
                          htmlFor="flexible_time"
                          className="pl-2 text-sm font-normal"
                        >
                          Flexible Schedule
                        </label>
                      </div>
                      <div>
                        <div className="mb-4">
                          <input
                            type="checkbox"
                            id="break_time"
                            checked={scheduleSettings.isBreakTimeChecked}
                            onChange={(e) => {
                              setScheduleSettings((prev) => ({
                                ...prev,
                                isBreakTimeChecked: e.target.checked,
                                flexible_time: false,
                              }));
                            }}
                            disabled={scheduleSettings.flexible_time}
                          />
                          <label
                            htmlFor="break_time"
                            className="pl-2 text-sm font-normal"
                          >
                            Breaktime
                          </label>
                        </div>
                        {scheduleSettings.isBreakTimeChecked && (
                          <div className="flex flex-col pl-4 space-y-6">
                            <div>
                              <input
                                type="checkbox"
                                id="flexible_hours"
                                checked={
                                  scheduleSettings.isFlexibleHoursChecked
                                }
                                onChange={(e) => {
                                  setScheduleSettings((prev) => ({
                                    ...prev,
                                    isFlexibleHoursChecked: e.target.checked,
                                    isFixedHoursChecked: false,
                                  }));
                                }}
                              />
                              <label
                                htmlFor="flexible_hours"
                                className="pl-2 text-sm font-normal"
                              >
                                Flexible Hours
                              </label>
                              <div
                                className={classNames(
                                  "mt-2",
                                  scheduleSettings.isFlexibleHoursChecked
                                    ? "block"
                                    : "hidden"
                                )}
                              >
                                <label
                                  htmlFor="flexible_hours"
                                  className="pl-2 text-sm font-normal"
                                >
                                  No. of Hours
                                </label>
                                <input
                                  disabled={
                                    !scheduleSettings.isFlexibleHoursChecked
                                  }
                                  type="number"
                                  placeholder="24"
                                  value={scheduleSettings.breakhours || ""}
                                  onChange={(e) => {
                                    setScheduleSettings((prev) => ({
                                      ...prev,
                                      breakhours: Number(e.target.value),
                                    }));
                                  }}
                                  className="px-2 border-2 border-[#878787] rounded-[5px] h-[53.57px] w-full"
                                />
                              </div>
                            </div>
                            <div>
                              <input
                                type="checkbox"
                                id="fixed_hours"
                                checked={scheduleSettings.isFixedHoursChecked}
                                onChange={(e) => {
                                  setScheduleSettings((prev) => ({
                                    ...prev,
                                    isFixedHoursChecked: e.target.checked,
                                    isFlexibleHoursChecked: false,
                                  }));
                                }}
                              />
                              <label
                                htmlFor="fixed_hours"
                                className="pl-2 text-sm font-normal"
                              >
                                Fixed Hours
                              </label>
                              <div
                                className={classNames(
                                  "mt-2",
                                  scheduleSettings.isFixedHoursChecked
                                    ? "block"
                                    : "hidden"
                                )}
                              >
                                <label
                                  htmlFor="fixed_hours"
                                  className="pl-2 text-sm font-normal"
                                >
                                  No. of Breaks
                                </label>
                                <input
                                  disabled={
                                    !scheduleSettings.isFixedHoursChecked
                                  }
                                  type="number"
                                  placeholder="24"
                                  value={scheduleSettings.breaks || ""}
                                  onChange={(e) => {
                                    const breaks = Number(e.target.value);
                                    setScheduleSettings((prev) => ({
                                      ...prev,
                                      breaks: breaks,
                                    }));
                                    // Update the number of time inputs based on breaks
                                    setTimeInputs(
                                      Array.from(
                                        { length: breaks },
                                        (_, ) => ({ breakfrom: "", breakto: "" })
                                      )
                                    );
                                  }}
                                  className="px-2 border-2 border-[#878787] rounded-[5px] h-[53.57px] w-full"
                                />
                              </div>
                              <div className={classNames(
                                  "mt-2",
                                  scheduleSettings.isFixedHoursChecked
                                    ? "block"
                                    : "hidden"
                                )}>
                              {timeInputs.map((_, index) => (
                                <div key={index} className="flex space-x-2">
                                  <div className="py-2 xl:w-1/2 lg:w-full">
                                    <h1 className="mb-1 text-sm font-normal">
                                      From
                                    </h1>
                                    <div className="flex space-x-2">
                                      <Controller
                                        control={control}
                                        name={`break_details.${index}.breakfrom`}
                                        render={({ field }) => (
                                          <input
                                            {...field}
                                            className="px-2 border-2 border-[#878787] rounded-[5px] h-[53.57px] w-full"
                                            type="text"
                                            placeholder="HH:MM:SS"
                                            onChange={(e) => {
                                              const newTimeInputs = [...timeInputs];
                                              newTimeInputs[index].breakfrom = e.target.value;
                                              setTimeInputs(newTimeInputs);
                                              field.onChange(e);
                                            }}
                                          />
                                        )}
                                      />
                                    </div>
                                  </div>
                                  <div className="py-2 xl:w-1/2 lg:w-full">
                                    <h1 className="mb-1 text-sm font-normal">
                                      To
                                    </h1>
                                    <div className="flex space-x-2">
                                      <Controller
                                        control={control}
                                        name={`break_details.${index}.breakto`}
                                        render={({ field }) => (
                                          <input
                                            {...field}
                                            className="px-2 border-2 border-[#878787] rounded-[5px] h-[53.57px] w-full"
                                            type="text"
                                            placeholder="HH:MM:SS"
                                            onChange={(e) => {
                                              const newTimeInputs = [...timeInputs];
                                              newTimeInputs[index].breakto = e.target.value;
                                              setTimeInputs(newTimeInputs);
                                              field.onChange(e);
                                            }}
                                          />
                                        )}
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="px-10 pt-10 mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
                        <button
                          type="submit"
                          className="inline-flex px-2 justify-center w-full rounded-md border border-transparent py-2 bg-[#355FD0] text-base leading-6 font-bold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                          onClick={handleSaveSettings}
                        >
                          Save Settings
                        </button>
                      </span>
                      <span className="flex w-full mt-3 rounded-md shadow-sm sm:mt-0 sm:w-auto">
                        <button
                          type="button"
                          className="cancel-upload-csv-btn"
                          onClick={() => setIsScheduleSettingsOpen(false)}
                        >
                          Close
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateScheduleModal;