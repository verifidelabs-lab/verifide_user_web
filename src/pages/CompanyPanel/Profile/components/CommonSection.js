import React from 'react'
import { GoPlus } from "react-icons/go";
import Button from '../../../components/Atoms/Button/Button';

const CommonSection = ({
  title = "EDUCATION",
  buttonText = "Add Education",
  emptyStateTitle = "No Education Records",
  emptyStateDescription = "Add your education history to enhance your profile",
  educationRecords = [],
  handleOpenModal,
  logo = "/Img/Profile/Frame.png"
}) => {
  const hasEducationRecords = educationRecords && educationRecords.length > 0;
  return (
    <div className="w-full max-w-4xl p-4 mx-auto glassy-card border border-gray-200 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-semibold tracking-wide text-gray-800 uppercase">
          {title}
        </h2>
    
      </div>
      {!hasEducationRecords ? (
        <div className="px-6 py-5 text-center border-2 border-gray-300 border-dashed rounded-lg glassy-card">
          <div className="flex items-center justify-center mx-auto mb-4">
            <img src={logo} alt='' />
          </div>
          <h3 className="mb-2 text-[20px] font-semibold text-gray-900">
            {emptyStateTitle}
          </h3>
          <p className="text-sm glassy-text-secondary">
            {emptyStateDescription}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {educationRecords.map((record, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{record.degree}</h3>
                  <p className="text-gray-600">{record.institution}</p>
                  <p className="text-sm glassy-text-secondary">{record.duration}</p>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CommonSection

