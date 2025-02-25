import { FC } from 'react';
import { Control } from 'react-hook-form';
import { contactRelationship } from '../../helpers/constants';
import { Employee } from '@/components/types';

interface EmergencyContactProps {
  control: Control<Employee>; 
  errors: any;
}

const EmergencyContact: FC<EmergencyContactProps> = ({ control, errors }) => (
    <>
    <div>
      <label htmlFor="contact_person" className="label-modal">Contact Person</label>
       <input
           className="input-text-modal"
           {...control.register('contact_person', { required: 'Contact person is required*' })}
        />
      {errors.contact_person && <div className="mt-1 text-red-500">{errors.contact_person.message}</div>}
    </div>
    <div>
      <label htmlFor="relationship" className="label-modal">Relationship</label>
        <select
           className="input-text-modal"
           {...control.register('relationship', { required: 'Relationship is required*' })}
          >
           {contactRelationship.map((rel, index) => (
           <option key={index} value={rel}>{rel}</option>
          ))}
        </select>
      {errors.relationship && <div className="mt-1 text-red-500">{errors.relationship.message}</div>}
    </div>
    <div>
      <label htmlFor="contact_person_num" className="label-modal">Contact Number</label>
        <input
          type="tel"
         className="input-text-modal"
          {...control.register('contact_person_num', { required: 'Contact number is required*' })}
        />
      {errors.contact_person_num && <div className="mt-1 text-red-500">{errors.contact_person_num.message}</div>}
    </div>
    <div>
      <label htmlFor="contact_person_address" className="label-modal">Contact Person Address</label>
        <input
         className="input-text-modal"
         {...control.register('contact_person_address', { required: 'Contact Person address is required*' })}
        />
      {errors.contact_person_address && <div className="mt-1 text-red-500">{errors.contact_person_address.message}</div>}
    </div>
  </>
);


export default EmergencyContact;
