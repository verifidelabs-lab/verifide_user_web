import React from 'react';

const VerifiedLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="relative">
        {/* Outer rotating ring */}
        <div className="w-32 h-32 border-4 border-transparent border-t-blue-400 border-r-purple-400 rounded-full animate-spin"></div>
        
        {/* Inner pulsing ring */}
        <div className="absolute inset-2 w-24 h-24 border-2 border-transparent border-b-cyan-300 border-l-pink-300 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        
        {/* V Letter Container */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Glowing background for V */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 blur-lg opacity-60 animate-pulse"></div>
            
            {/* Main V Letter */}
            <div className="relative text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 animate-pulse">
              V
            </div>
            
            {/* Sparkle effects */}
            <div className="absolute -top-2 -right-2 w-2 h-2 bg-yellow-300 rounded-full animate-ping"></div>
            <div className="absolute -bottom-1 -left-1 w-1 h-1 bg-pink-300 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute top-1 right-4 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
        
        {/* Verification checkmark animation */}
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-bounce" style={{ animationDelay: '0.3s' }}>
            <svg className="w-3 h-3 glassy-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        
        {/* Orbiting dots */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
          <div className="absolute top-0 left-1/2 w-2 h-2 bg-blue-400 rounded-full transform -translate-x-1/2 -translate-y-2"></div>
          <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-purple-400 rounded-full transform -translate-x-1/2 translate-y-2"></div>
          <div className="absolute left-0 top-1/2 w-2 h-2 bg-cyan-400 rounded-full transform -translate-x-2 -translate-y-1/2"></div>
          <div className="absolute right-0 top-1/2 w-2 h-2 bg-pink-400 rounded-full transform translate-x-2 -translate-y-1/2"></div>
        </div>
      </div>
      

    </div>
  );
};

export default VerifiedLoader;