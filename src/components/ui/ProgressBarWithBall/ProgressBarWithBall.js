
const ProgressBarWithBall = () => {
  
  const progress = 40; 

  return (
    <div className='p-10 h-full flex items-center'>
      <div className="flex flex-col items-center h-[37rem] w-2 mb-4 relative">
        
        <div className="relative flex-1 w-full glassy-card rounded-full overflow-hidden">
          
          <div
            className="absolute top-0 w-full bg-blue-600 transition-all duration-300"
            style={{
              height: `${progress}%`,
              borderRadius: '9999px'
            }}
          ></div>
        </div>

        
        <div
          className="absolute -right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
          style={{
            top: `calc(${progress}% - 1rem)` 
          }}
        >
          <div className="w-6 h-6 rounded-full glassy-card flex items-center justify-center text-xs font-bold text-blue-600">
            <img src="/progressIcon.png" alt="" className="w-6 h-6"/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBarWithBall