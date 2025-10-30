import React, { useState } from 'react';

const OrbitalMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  const menuItems = {
    'fullstack': {
      title: 'Full Stack Developer',
      items: [
        'React & Node.js Development',
        'Database Design & Management',
        'API Development & Integration',
        'Cloud Deployment & DevOps',
        'Performance Optimization',
        'Security Implementation'
      ]
    },
    'backend': {
      title: 'Backend Developer',
      items: [
        'Server-side Architecture',
        'Database Optimization',
        'RESTful API Design',
        'Microservices Architecture',
        'Authentication & Authorization',
        'Performance Monitoring'
      ]
    },
    'frontend': {
      title: 'Frontend Developer',
      items: [
        'Modern JavaScript Frameworks',
        'Responsive Web Design',
        'UI/UX Implementation',
        'Cross-browser Compatibility',
        'Performance Optimization',
        'Accessibility Standards'
      ]
    },
    'ml': {
      title: 'ML Engineer',
      items: [
        'Machine Learning Models',
        'Data Pipeline Development',
        'Model Training & Optimization',
        'Neural Network Architecture',
        'MLOps & Deployment',
        'Data Analysis & Visualization'
      ]
    },
    'devops': {
      title: 'DevOps Engineer',
      items: [
        'CI/CD Pipeline Setup',
        'Infrastructure as Code',
        'Container Orchestration',
        'Monitoring & Logging',
        'Security Automation',
        'Cloud Platform Management'
      ]
    },
    'product': {
      title: 'Product Manager',
      items: [
        'Product Strategy & Vision',
        'User Research & Analysis',
        'Feature Planning & Prioritization',
        'Stakeholder Management',
        'Agile Methodology',
        'Market Analysis'
      ]
    },
    'qa': {
      title: 'QA Engineer',
      items: [
        'Test Automation Frameworks',
        'Manual Testing Strategies',
        'Performance Testing',
        'Security Testing',
        'Bug Tracking & Reporting',
        'Quality Assurance Processes'
      ]
    },
    'ai': {
      title: 'AI Developer',
      items: [
        'Artificial Intelligence Solutions',
        'Natural Language Processing',
        'Computer Vision',
        'Deep Learning Models',
        'AI Integration & Deployment',
        'Ethical AI Development'
      ]
    },
    'data': {
      title: 'Data Scientist',
      items: [
        'Statistical Analysis & Modeling',
        'Data Mining & Exploration',
        'Predictive Analytics',
        'Big Data Processing',
        'Data Visualization',
        'Business Intelligence'
      ]
    }
  };

  const handleMenuClick = (role) => {
    setActiveMenu(role);
    setMenuOpen(true);
  };

  return (
    <div className=''>
      <div className="flex justify-star">
        <img src="/whitelogo.png" alt="logo" className="" />
      </div>
      <div className="flex items-center justify-center w-full">
        <div className="relative lg:w-[700px] md:h-[700px] ">
      
          <div className="absolute left-[calc(50%-70px)] top-[calc(50%-70px)] w-[140px] h-[140px] rounded-full glassy-card shadow-2xl flex items-center justify-center z-10">
            <div className="w-[130px] h-[130px] rounded-full flex items-center justify-center">
              <div className="">
                <img src='/profile.png' alt='' className='rounded-full' />
              </div>
            </div>
          </div>

          {/* Inner Circle - Smaller size, slower speed */}
          <div className="absolute left-[calc(50%-140px)] top-[calc(50%-140px)] w-[280px] h-[280px] border-2 border-dashed border-white/50 rounded-full">
            <div
              className="absolute w-[70px] h-[70px] rounded-full glassy-card/95 backdrop-blur-sm shadow-xl flex items-center justify-center cursor-pointer hover:scale-110 transition-transform animate-[orbit-inner_120s_linear_infinite] group"
              onClick={() => handleMenuClick('fullstack')}
              style={{
                left: 'calc(50% - 35px)',
                top: 'calc(50% - 35px)',
                transformOrigin: '35px 35px',
                animationDelay: '0s'
              }}
            >
              <div className="text-center text-xs font-medium text-gray-700 animate-[counter-orbit-inner_120s_linear_infinite]">
                Full Stack Developer
              </div>
              <div className="absolute w-[160px] left-[calc(50%-80px)] top-[-50px] glassy-card/90 glassy-text-primary rounded-lg text-center text-xs py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                Full Stack Development
              </div>
            </div>
            <div
              className="absolute w-[70px] h-[70px] rounded-full glassy-card/95 backdrop-blur-sm shadow-xl flex items-center justify-center cursor-pointer hover:scale-110 transition-transform animate-[orbit-inner_120s_linear_infinite] group"
              onClick={() => handleMenuClick('backend')}
              style={{
                left: 'calc(50% - 35px)',
                top: 'calc(50% - 35px)',
                transformOrigin: '35px 35px',
                animationDelay: '-40s'
              }}
            >
              <div className="text-center text-xs font-medium text-gray-700 animate-[counter-orbit-inner_120s_linear_infinite]">
                Backend Developer
              </div>
              <div className="absolute w-[160px] left-[calc(50%-80px)] top-[-50px] glassy-card/90 glassy-text-primary rounded-lg text-center text-xs py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                Backend Development
              </div>
            </div>
            <div
              className="absolute w-[70px] h-[70px] rounded-full glassy-card/95 backdrop-blur-sm shadow-xl flex items-center justify-center cursor-pointer hover:scale-110 transition-transform animate-[orbit-inner_120s_linear_infinite] group"
              onClick={() => handleMenuClick('frontend')}
              style={{
                left: 'calc(50% - 35px)',
                top: 'calc(50% - 35px)',
                transformOrigin: '35px 35px',
                animationDelay: '-80s'
              }}
            >
              <div className="text-center text-xs font-medium text-gray-700 animate-[counter-orbit-inner_120s_linear_infinite]">
                Frontend Developer
              </div>
              <div className="absolute w-[160px] left-[calc(50%-80px)] top-[-50px] glassy-card/90 glassy-text-primary rounded-lg text-center text-xs py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                Frontend Development
              </div>
            </div>
          </div>

          {/* Middle Circle - Medium size, medium speed */}
          <div className="absolute left-[calc(50%-220px)] top-[calc(50%-220px)] w-[440px] h-[440px] border-2 border-dashed border-white/50 rounded-full">
            <div
              className="absolute w-[80px] h-[80px] rounded-full glassy-card/95 backdrop-blur-sm shadow-xl flex items-center justify-center cursor-pointer hover:scale-110 transition-transform animate-[orbit-middle_80s_linear_infinite] group"
              onClick={() => handleMenuClick('ai')}
              style={{
                left: 'calc(50% - 40px)',
                top: 'calc(50% - 40px)',
                transformOrigin: '40px 40px',
                animationDelay: '0s'
              }}
            >
              <div className="text-center text-xs font-medium text-gray-700 animate-[counter-orbit-middle_80s_linear_infinite]">
                AI Developer
              </div>
              <div className="absolute w-[160px] left-[calc(50%-80px)] top-[-50px] glassy-card/90 glassy-text-primary rounded-lg text-center text-xs py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                AI Development
              </div>
            </div>

            <div
              className="absolute w-[80px] h-[80px] rounded-full glassy-card/95 backdrop-blur-sm shadow-xl flex items-center justify-center cursor-pointer hover:scale-110 transition-transform animate-[orbit-middle_80s_linear_infinite] group"
              onClick={() => handleMenuClick('ml')}
              style={{
                left: 'calc(50% - 40px)',
                top: 'calc(50% - 40px)',
                transformOrigin: '40px 40px',
                animationDelay: '-26.67s'
              }}
            >
              <div className="text-center text-xs font-medium text-gray-700 animate-[counter-orbit-middle_80s_linear_infinite]">
                ML Engineer
              </div>
              <div className="absolute w-[160px] left-[calc(50%-80px)] top-[-50px] glassy-card/90 glassy-text-primary rounded-lg text-center text-xs py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                Machine Learning
              </div>
            </div>

            <div
              className="absolute w-[80px] h-[80px] rounded-full glassy-card/95 backdrop-blur-sm shadow-xl flex items-center justify-center cursor-pointer hover:scale-110 transition-transform animate-[orbit-middle_80s_linear_infinite] group"
              onClick={() => handleMenuClick('devops')}
              style={{
                left: 'calc(50% - 40px)',
                top: 'calc(50% - 40px)',
                transformOrigin: '40px 40px',
                animationDelay: '-53.33s'
              }}
            >
              <div className="text-center text-xs font-medium text-gray-700 animate-[counter-orbit-middle_80s_linear_infinite]">
                DevOps Engineer
              </div>
              <div className="absolute w-[160px] left-[calc(50%-80px)] top-[-50px] glassy-card/90 glassy-text-primary rounded-lg text-center text-xs py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                DevOps Engineering
              </div>
            </div>
          </div>

          {/* Outer Circle - Largest size, fastest speed */}
          <div className="absolute left-[calc(50%-320px)] top-[calc(50%-320px)] w-[640px] h-[640px] border-2 border-dashed border-white/50 rounded-full">
            <div
              className="absolute w-[90px] h-[90px] rounded-full glassy-card/95 backdrop-blur-sm shadow-xl flex items-center justify-center cursor-pointer hover:scale-110 transition-transform animate-[orbit-outer_40s_linear_infinite] group"
              onClick={() => handleMenuClick('data')}
              style={{
                left: 'calc(50% - 45px)',
                top: 'calc(50% - 45px)',
                transformOrigin: '45px 45px',
                animationDelay: '0s'
              }}
            >
              <div className="text-center text-xs font-medium text-gray-700 animate-[counter-orbit-outer_40s_linear_infinite]">
                Data Scientist
              </div>
              <div className="absolute w-[160px] left-[calc(50%-80px)] top-[-50px] glassy-card/90 glassy-text-primary rounded-lg text-center text-xs py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                Data Science
              </div>
            </div>

            <div
              className="absolute w-[90px] h-[90px] rounded-full bg-[#F3E3FF] border border-[#9910FF94]/50 shadow-xl flex items-center justify-center cursor-pointer hover:scale-110 transition-transform animate-[orbit-outer_40s_linear_infinite] group"
              onClick={() => handleMenuClick('product')}
              style={{
                left: 'calc(50% - 45px)',
                top: 'calc(50% - 45px)',
                transformOrigin: '45px 45px',
                animationDelay: '-13.33s'
              }}
            >
              <div className="text-center text-xs font-medium text-whiteanimate-[counter-orbit-outer_40s_linear_infinite]">
                Product Manager
              </div>
              <div className="absolute w-[160px] left-[calc(50%-80px)] top-[-50px] glassy-card/90 glassy-text-primary rounded-lg text-center text-xs py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                Product Management
              </div>
            </div>

            <div
              className="absolute w-[90px] h-[90px] rounded-full glassy-card/95 backdrop-blur-sm shadow-xl flex items-center justify-center cursor-pointer hover:scale-110 transition-transform animate-[orbit-outer_40s_linear_infinite] group"
              onClick={() => handleMenuClick('qa')}
              style={{
                left: 'calc(50% - 45px)',
                top: 'calc(50% - 45px)',
                transformOrigin: '45px 45px',
                animationDelay: '-26.67s'
              }}
            >
              <div className="text-center text-xs font-medium text-gray-700 animate-[counter-orbit-outer_40s_linear_infinite]">
                QA Engineer
              </div>
              <div className="absolute w-[160px] left-[calc(50%-80px)] top-[-50px] glassy-card/90 glassy-text-primary rounded-lg text-center text-xs py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                Quality Assurance
              </div>
            </div>
          </div>

          {menuOpen && (
            <div
              className="absolute inset-0 z-30 flex items-center justify-center w-full h-full rounded-full glassy-card/95 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
            >
              <div className="max-w-sm p-8 text-center">
                <div className="w-[80px] h-[80px] rounded-full bg-gradient-to-t from-[#2563EB] to-[#FFFFFF] mx-auto mb-6 flex items-center justify-center shadow-xl">
                  <div className="text-xs font-medium glassy-text-primary">
                    {activeMenu?.toUpperCase()}
                  </div>
                </div>
                <h2 className="mb-4 text-2xl font-bold glassy-text-primary">
                  {menuItems[activeMenu]?.title}
                </h2>
                <ul className="space-y-2 text-sm glassy-text-secondary border border-blue-500">
                  {menuItems[activeMenu]?.items.map((item, index) => (
                    <li key={index} className="py-1 border-b border-gray-200 last:border-b-0">
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="px-6 py-2 mt-6 text-sm glassy-text-primary transition-colors bg-gray-800 rounded-full hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        <style jsx>{`
          @keyframes orbit-inner {
            from { transform: rotate(0deg) translateX(140px) rotate(0deg); }
            to { transform: rotate(360deg) translateX(140px) rotate(-360deg); }
          }

          @keyframes counter-orbit-inner {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          @keyframes orbit-middle {
            from { transform: rotate(0deg) translateX(220px) rotate(0deg); }
            to { transform: rotate(360deg) translateX(220px) rotate(-360deg); }
          }

          @keyframes counter-orbit-middle {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          @keyframes orbit-outer {
            from { transform: rotate(0deg) translateX(320px) rotate(0deg); }
            to { transform: rotate(360deg) translateX(320px) rotate(-360deg); }
          }

          @keyframes counter-orbit-outer {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default OrbitalMenu;