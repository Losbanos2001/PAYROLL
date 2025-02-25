import { FC } from 'react';
import { Control } from 'react-hook-form';
import { regionsPH } from '../../helpers/constants';
import { Employee } from '@/components/types';

interface ContactInfoProps {
  control: Control<Employee>; 
  errors: any;
}

const ContactInfo: FC<ContactInfoProps> = ({ control, errors }) => (
 <>
    <div>
      <label htmlFor="email" className="label-modal">Email</label>
        <input
          type="email"
          className="input-text-modal"
          {...control.register('email', { required: 'Email is required*' })}
        />
      {errors.email && <div className="mt-1 text-red-500">{errors.email.message}</div>}
    </div>
    <div>
      <label htmlFor="address" className="label-modal">Address</label>
        <input
          className="input-text-modal"
          {...control.register('address', { required: 'Address is required*' })}
        />
      {errors.address && <div className="mt-1 text-red-500">{errors.address.message}</div>}
    </div>
    <div>
      <label htmlFor="region" className="label-modal">Region</label>
      <select
         className="input-text-modal"
        {...control.register('region', { required: 'Region is required*' })}
      >
        {regionsPH.map((region, index) => (
          <option key={index} value={region}>{region}</option>
        ))}
      </select>
      {errors.region && <div className="mt-1 text-red-500">{errors.region.message}</div>}
    </div>
    <div>
      <label htmlFor="local_home_address" className="label-modal">Local Home Address</label>
      <input
         className="input-text-modal"
        {...control.register('local_address', { required: 'Local home address is required*' })}
      />
      {errors.local_address && <div className="mt-1 text-red-500">{errors.local_address.message}</div>}
    </div>
    <div>
      <label htmlFor="local_home_zip" className="label-modal">Local Home Address Zip Code</label>
      <input
         className="input-text-modal"
        {...control.register('local_address_zip', { required: 'Local home address zip code is required*' })}
      />
      {errors.local_address_zip && <div className="mt-1 text-red-500">{errors.local_address_zip.message}</div>}
    </div>
    <div>
      <label htmlFor="zip_code" className="label-modal">Zip Code</label>
      <input
         className="input-text-modal"
        {...control.register('zip_code', { required: 'Zip Code is required*' })}
      />
      {errors.zip_code && <div className="mt-1 text-red-500">{errors.zip_code.message}</div>}
    </div>
    <div>
      <label htmlFor="foreign_address" className="label-modal">Foreign Address</label>
      <input
        className="input-text-modal"
        {...control.register('foreign_address')}
      />
    </div>
    <div>
      <label htmlFor="foreign_address_zip" className="label-modal">Foreign Address Zip Code</label>
      <input
        className="input-text-modal"
        {...control.register('foreign_address_zip')}
      />
    </div>
    <div>
      <label htmlFor="rdo_code" className="block text-sm font-medium text-gray-700">RDO Code</label>
      <input
        className="input-text-modal"
        {...control.register('rdo_code')}
      />
    </div>
    <div>
      <label htmlFor="contact_number" className="block text-sm font-medium text-gray-700">Contact Number</label>
      <input
        type="tel"
        className="input-text-modal"
        {...control.register('contact_num', { required: 'Contact number is required*' })}
      />
      {errors.contact_num && <div className="mt-1 text-red-500">{errors.contact_num.message}</div>}
    </div>
  </>
);
export default ContactInfo;
