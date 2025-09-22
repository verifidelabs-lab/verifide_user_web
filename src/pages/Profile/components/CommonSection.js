import React, { useEffect } from 'react';
import { GoPlus } from "react-icons/go";
import Button from '../../../components/ui/Button/Button';
import { SkillsCard, SkillsCard2 } from '../../../components/ui/cards/Card';
import { PiCalendarDotDuotone } from "react-icons/pi";
import { PiGraduationCapLight } from "react-icons/pi";
import { FaRegEdit } from 'react-icons/fa';
import { RiDeleteBin6Line } from "react-icons/ri";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { MdOutlineVerified } from "react-icons/md";


const CommonSection = ({
  title = "EDUCATION",
  buttonText = "Add Education",
  emptyStateTitle = "No Education Records",
  emptyStateDescription = "Add your education history to enhance your profile",
  handleOpenModal,
  logo = "/Img/Profile/Frame.png",
  type,
  data = [],
  onEdit,
  onDelete,
  loadingStates = { deletingItems: {} }
}) => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: false
    });
  }, []);

  const hasRecords = data.length > 0;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const isItemDeleting = (itemId) => {
    return loadingStates.deletingItems[itemId] || false;
  };




  return (
    <div className="w-full p-4 mx-auto bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between mb-6">
        <h2 className="md:text-sm text-xs font-semibold tracking-wide text-gray-800 uppercase">
          {title}
        </h2>
        <Button
          onClick={handleOpenModal}
          children={buttonText}
          icon={<GoPlus />}
          className="hover:scale-105 transition-transform duration-200"
        />
      </div>

      {!hasRecords ? (
        <div className="px-6 py-5 text-center border-2 border-gray-300 border-dashed rounded-lg bg-[#FBFBFB] hover:border-blue-300 transition-colors duration-300">
          <div className="flex items-center justify-center mx-auto mb-4">
            <img src={logo} alt='' className="hover:scale-110 transition-transform duration-300" />
          </div>
          <h3 className="mb-2 text-[20px]  font-semibold text-[#000000E6]">
            {emptyStateTitle}
          </h3>
          <p className="text-sm text-gray-500">
            {emptyStateDescription}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {data.map((record, index) => {
            const isDeleting = isItemDeleting(record._id);


            return (
              <div
                key={record.id}
                className={`p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-300 ${isDeleting ? 'opacity-70 pointer-events-none' : ''
                  }`}
                data-aos-delay={index * 100}
              >
                <div className="group">
                  <div className="w-full border-b border-[#0000001A]/10 pb-6 space-y-2 group-hover:border-blue-200 transition-colors duration-300">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-[#000000E6] text-lg flex justify-start items-center gap-2">
                          <span className='bg-[#EAF1FF] rounded-full md:w-8 md:h-8 h-6  w-6 flex items-center capitalize justify-center text-[#000000] font-medium text-sm hover:bg-blue-100 transition-colors duration-300'>
                            <PiGraduationCapLight className="hover:scale-110 transition-transform duration-300" />
                          </span>
                          <span className="hover:text-blue-600 transition-colors duration-300 md:text-base text-xs truncate break-words text-wrap capitalize">
                            {title === "EDUCATION" ? record.institution_id?.name : title === "EXPERIENCE" ? record?.company_id?.name : record?.name}
                          </span>
                          <span>{record?.status === "approved" && <img src='/image (2).png' alt='approved' className='t' />}</span>
                        </h3>
                        <p className="text-[#6B6B6B] text-xs font-medium capitalize hover:text-gray-800 transition-colors duration-300">
                          {
                            record?.issuing_organization ? (
                              <span>{record?.issuing_organization}</span>
                            ) : (
                              <span>
                                {title === "EDUCATION" ? record.degree_id?.name : title === "EXPERIENCE" ? record?.industries_id?.name : record?.institution_id?.name}
                              </span>
                            )
                          }
                        </p>
                      </div>
                      <div className='lg:block hidden'>

                        <div className="md:mt-3  mt-0 md:text-sm text-[10px] text-gray-500 bg-[#EAF1FF] capitalize rounded-2xl md:px-4 px-2 py-1 flex justify-start items-center gap-1 hover:bg-blue-100 hover:text-blue-600 transition-colors duration-300">
                          <PiCalendarDotDuotone className="hover:scale-110 transition-transform duration-300" />
                          {
                            record?.issue_date ? (
                              <span>{formatDate(record?.issue_date)}</span>
                            ) : (
                              <span>
                                {formatDate(record.start_date)} -{' '}
                                {record.currentlyStudying || record.currentlyWorking || !record?.end_date || record.currently_available
                                  ? 'Present'
                                  : formatDate(record.end_date)}
                              </span>
                            )
                          }

                        </div>
                      </div>
                    </div>

                    <div className="mb-2 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-300">
                      {record.description ? record.description : record?.profile_role_id?.name}
                    </div>

                    {(record.skills_acquired?.length > 0) && (
                      <SkillsCard2
                        title='Skills Acquired'
                        skills={record?.skills_acquired || []}
                        limit={10}
                        className="hover:shadow-md transition-shadow duration-300"
                      />
                    )}
                  </div>

                  <div className='flex justify-between place-items-center pt-2'>
                    <div className='lg:opacity-0  opacity-100'>

                      <div className="  mt-0 lg:text-sm text-[10px] text-gray-500 bg-[#EAF1FF] capitalize rounded-2xl md:px-4 px-2 py-1 flex justify-start items-center gap-1 hover:bg-blue-100 hover:text-blue-600 transition-colors duration-300">
                        <PiCalendarDotDuotone className="hover:scale-110 transition-transform duration-300" />
                        {
                          record?.issue_date ? (
                            <span>{formatDate(record?.issue_date)}</span>
                          ) : (
                            <span>
                              {formatDate(record.start_date)} -{' '}
                              {record.currentlyStudying || record.currentlyWorking ? 'Present' : formatDate(record.end_date)}
                            </span>
                          )
                        }
                      </div>
                    </div>
                    {!['requested', 'approved'].includes(record?.status) &&

                      <div className="flex justify-end items-center gap-2 py-2">
                        <button
                          onClick={() => onEdit(type, record)}
                          disabled={isDeleting}
                          className={`flex items-center gap-1 ${isDeleting
                            ? 'text-blue-400 cursor-not-allowed'
                            : 'text-blue-600 hover:text-blue-800 hover:scale-105'
                            } transition-all duration-200`}
                        >
                          <span className={`bg-[#E6EEFF] w-10 h-10 rounded-full flex justify-center items-center ${isDeleting ? 'bg-blue-100' : 'hover:bg-blue-100'
                            } transition-colors duration-300`}>
                            <FaRegEdit className="hover:scale-110 transition-transform duration-300" />
                          </span>
                          Edit
                        </button>

                        <button
                          onClick={() => onDelete(type, record._id)}
                          disabled={isDeleting}
                          className={`flex items-center gap-1 ${isDeleting
                            ? 'text-red-400 cursor-not-allowed'
                            : 'text-red-600 hover:text-red-800 hover:scale-105'
                            } transition-all duration-200 ml-2`}
                        >
                          <span className={`relative bg-[#E6EEFF] w-10 h-10 rounded-full flex justify-center items-center ${isDeleting
                            ? 'bg-red-100'
                            : 'hover:bg-red-100'
                            } transition-colors duration-300`}>
                            <RiDeleteBin6Line className={`${isDeleting ? 'scale-110' : 'hover:scale-110'
                              } transition-transform duration-300`} />

                            {isDeleting && (
                              <>
                                <span className="absolute -left-2 w-4 h-5 bg-red-400 rounded-sm transform origin-right transition-all duration-500 animate-fileDelete">
                                  <span className="absolute top-0 left-0.5 w-3 h-0.5 bg-red-200"></span>
                                </span>

                                <span className="absolute inset-0 rounded-full border-2 border-red-300 animate-ping opacity-0"></span>
                              </>
                            )}
                          </span>

                          {isDeleting ? (
                            <span className="flex items-center gap-1">
                              <span className="inline-block w-2 h-2 bg-red-400 rounded-full animate-bounce"></span>
                              <span className="inline-block w-2 h-2 bg-red-400 rounded-full animate-bounce delay-75"></span>
                              <span className="inline-block w-2 h-2 bg-red-400 rounded-full animate-bounce delay-150"></span>
                            </span>
                          ) : "Delete"}
                        </button>
                      </div>

                    }
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CommonSection;