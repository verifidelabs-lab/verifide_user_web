import React from 'react';
import Input from '../../../components/Atoms/Input/Input';
import Button from '../../../components/Atoms/Button/Button';

const PersonalInformation = () => {
  return (
    <div className="flex flex-col gap-6 glassy-card border rounded-2xl">
      <div className="p-6 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold glassy-text-primary">Personal Information</h3>

        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <Input label="Full Name" value="Amit Kumar" />
          <Input label="User ID" placeholder="www.verifide.xyz/User Id" />
          <Input label="Email" placeholder="Enter your Email" />
          <Input label="Phone Number" value="+91 1234567890" />
          <Input type='select' label="Gender" options={['Select', 'Male', 'Female', 'Other']} />
          <Input type='select' label="City" options={['Select', 'Mumbai', 'Delhi', 'Bangalore']} />
          <Input type='select' label="State" options={['Select', 'Maharashtra', 'Delhi', 'Karnataka']} />
          <Input type='select' label="Country" options={['Select', 'India', 'USA', 'UK']} />
        </div>

        <div className="mt-6">
          <label className="block mb-2 text-sm font-medium text-gray-700">Professional Bio *</label>
          <textarea
            className="w-full h-32 p-3 border border-gray-300 rounded-lg"
            placeholder="Write a short professional biography"
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformation;
