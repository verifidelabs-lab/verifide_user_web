import React from 'react'
import { BsDownload } from 'react-icons/bs'
import Button from '../../../components/Atoms/Button/Button'

const ProfileCardData = () => {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex-shrink-0 w-32 h-32 overflow-hidden bg-gray-200 rounded-lg">
        <img
          src="https://plus.unsplash.com/premium_photo-1670071482460-5c08776521fe?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D"
          alt="Profile"
          className="object-cover w-full"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <img src="/Img/GroupMain.png" alt="group" />
          <h1 className="text-2xl font-bold text-gray-900">Sarah Joe</h1>
          <div className="flex items-center justify-center w-5 h-5 bg-blue-500 rounded-full">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        <p className="mt-1 text-lg text-gray-700">Management Executive at Zara</p>
        <p className="text-sm text-gray-500">Jaipur, Rajasthan</p>
        <div className="flex items-center mt-4 space-x-3">
    
        </div>
      </div>
    </div>
  )
}

export default ProfileCardData