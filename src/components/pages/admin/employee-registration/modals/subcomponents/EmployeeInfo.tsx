import { FC } from 'react';
import { Control, Controller } from 'react-hook-form';
import { Employee } from '@/components/types';
import { nationalities } from '../../helpers/constants';

interface EmployeeInfoProps {
  control: Control<Employee>;
  errors: any;
}

const EmployeeInfo: FC<EmployeeInfoProps> = ({ control, errors }) => (
  <>
    <div>
      <label htmlFor="first_name" className="label-modal">First Name</label>
        <input
          placeholder='Enter First Name...'
          className="input-text-modal"
          {...control.register('first_name', { required: 'First name is required*' })}
        />
     {errors.first_name && <div className="mt-1 text-red-500">{errors.first_name.message}</div>}
    </div>
    <div>
      <label htmlFor="middle_name" className="label-modal">Middle Name</label>
        <input
          placeholder='Enter Middle Name...'
          className="input-text-modal"
          {...control.register('middle_name', { required: 'Middle name is required*' })}
        />
      {errors.middle_name && <div className="mt-1 text-red-500">{errors.middle_name.message}</div>}
    </div>
    <div>
      <label htmlFor="last_name" className="label-modal">Last Name</label>
        <input
          placeholder='Enter Last Name...'
          className="input-text-modal"
         {...control.register('last_name', { required: 'Last name is required*' })}
        />
      {errors.last_name && <div className="mt-1 text-red-500">{errors.last_name.message}</div>}
    </div>
    <div>
      <label htmlFor="extension" className="label-modal">Extension</label>
        <input
          placeholder='Enter Extension (e.g Sr., Jr., III)'
          className="input-text-modal"
          {...control.register('extension')}
        />
    </div>
    <div>
      <label htmlFor="gender" className="label-modal">Gender</label>
        <select
          className="input-text-modal"
          {...control.register('gender', { required: 'Gender is required*' })}
        >
          <option value="">Select gender:</option>
          <option value="F">Female</option>
          <option value="M">Male</option>
        </select>
      {errors.gender && <div className="mt-1 text-red-500">{errors.gender.message}</div>}
    </div>
    <div>
      <label htmlFor="birthday" className="block text-sm font-medium text-gray-700">Birthday</label>
        <input
          type="date"
          className="input-text-modal"
          {...control.register('birthday', { required: 'Birthday is required*' })}
        />
      {errors.birthday && <div className="mt-1 text-red-500">{errors.birthday.message}</div>}
    </div>
    <div>
      <label htmlFor="civil_status" className="label-modal">Civil Status</label>
        <select
          className="input-text-modal"
          {...control.register('civil_status', { required: 'Civil status is required*' })}
        >
          <option value="">Select civil status:</option>
          <option value="Single">Single</option>
          <option value="Married">Married</option>
          <option value="Divorced">Divorced</option>
          <option value="Separated">Separated</option>
          <option value="Widowed">Widowed</option>
        </select>
      {errors.civil_status && <div className="mt-1 text-red-500">{errors.civil_status.message}</div>}
    </div>
    <div>
      <label htmlFor="nationality" className="label-modal">Nationality</label>
        <select
          className="input-text-modal"
          {...control.register('nationality', { required: 'Nationality is required*' })}
        >
          <option value="" disabled>Select nationality:</option>
          {nationalities.map((nat, index) => (
          <option key={index} value={nat}>{nat}</option>))}
       </select>
      {errors.nationality && <div className="mt-1 text-red-500">{errors.nationality.message}</div>}
    </div>
    <div>
      <label htmlFor="place_of_birth" className="label-modal">Place of Birth</label>
        <input
          placeholder='Enter Place of Birth...'
          className="input-text-modal"
          {...control.register('place_of_birth', { required: 'Place of birth is required*' })}
        />
      {errors.place_of_birth && <div className="mt-1 text-red-500">{errors.place_of_birth.message}</div>}
    </div>
  <div>
    <label htmlFor="mothers_maiden_name" className="label-modal">Mother's Maiden Name</label>
      <input
        placeholder="Enter Mother's Maiden Name..."
        className="input-text-modal"
         {...control.register('mother_maiden_name', { required: "Mother's maiden name is required*" })}
      />
    {errors.mothers_maiden_name && <div className="mt-1 text-red-500">{errors.mothers_maiden_name.message}</div>}
  </div>
</>
);

export default EmployeeInfo;