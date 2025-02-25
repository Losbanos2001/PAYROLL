import DeleteModal from './modals/DeleteModal';
import TRows from './TRows';
import TFooter from './TFooter';
import DynamicConfirmModal from './modals/DynamicConfirmModal';
import THeaders from './THeaders';
import UpdateEmployeeProfileModal from './modals/UpdateEmployeeProfileModal';
import UpdateJobInfoModal from './modals/UpdateJobInfoModal';
import { EmployeeContext, EmployeeRegistrationContext } from '../../../contexts';
import { hasAllProperties, incompleteEmployeeProfile, incompleteEmployeeJobProfile } from './helpers/utils';
import { useContext, useEffect, useState } from 'react';

export default function TableWrapper() {
  const {
    employees, setSelectedRows, selectedRows,
    setSendState, sendState
  } = useContext(EmployeeContext);
  const { step } = useContext(EmployeeRegistrationContext);
  const [completeEmployees, setCompleteEmployees] = useState<any[] | undefined>([]);
  const [updateEmployeeProfile, setUpdateEmployeeProfile] = useState(false)
  const [updateJobInfo, setUpdateJobInfo] = useState(false)
  const [removeModalState, setRemoveModalState] = useState(false)

  const handleSendClose = () => {
    setSendState((prevState) => ({
      ...prevState,
      isOpen: false,
      employee: {
        id: 0,
        first_name: "",
        last_name: "",
        email: ""
      },
      type: ""
    }));
  };

  const handleUpdateProfileClose = () => {
    setUpdateEmployeeProfile(false);
  }

  const handleUpdateJobInfoClose = () => {
    setUpdateJobInfo(false);
  }

  const handleRemoveClose = () => {
    setRemoveModalState(false);
  }

  const completedIds = (employees: any, properties: any) => {
    const completeIds: any[] = [];
    employees?.forEach((employee: any) => {
      if (hasAllProperties(employee, properties)) {
        if (step === 2) {
          completeIds.push(employee.employeeId);
        }
        else completeIds.push(employee.id);
      }
    });
    return completeIds;
  }

  useEffect(() => {
    let completeEmployees;
    if (step == 1) {
      // console.log(employees)
      completeEmployees = completedIds(employees, incompleteEmployeeProfile);
    } else if (step === 2) {
      // console.log(employees)
      const jobProfiles = employees?.map(employee => ({
        employeeId: employee.id,
        ...employee.job_profile
      }));
      completeEmployees = completedIds(jobProfiles, incompleteEmployeeJobProfile);
    }
    setCompleteEmployees(completeEmployees);
    // console.log(completeEmployees);
  }, [employees, step]);

  useEffect(() => {
    setSelectedRows([]);
  }, [step])

  return (
    <>
      <DynamicConfirmModal
        isOpen={sendState.isOpen}
        onClose={handleSendClose}
      />
      <UpdateEmployeeProfileModal isOpen={updateEmployeeProfile} onClose={handleUpdateProfileClose} />
      <UpdateJobInfoModal isOpen={updateJobInfo} onClose={handleUpdateJobInfoClose} />
      <DeleteModal isOpen={removeModalState} onClose={handleRemoveClose} />
      
      <div className="relative">
        <div className="overflow-y-auto max-h-48">
          <table className="w-full table-auto">
            <thead className="sticky top-[-1px] z-10 text-sm whitespace-nowrap">
              <tr className="bg-white border-b-2">
                <THeaders setRemoveModalState={setRemoveModalState} />
              </tr>
            </thead>
            <tbody>
              <TRows
                setUpdateEmployeeProfile={setUpdateEmployeeProfile}
                setUpdateJobInfo={setUpdateJobInfo}
                setRemoveModalState={setRemoveModalState}
                completeEmployees={completeEmployees as any[]}
              />
            </tbody>
          </table>
        </div>
      </div>
      
      <TFooter />
    </>
  );
}