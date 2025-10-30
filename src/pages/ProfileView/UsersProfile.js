import Aos from "aos";
import React, { useEffect, useState } from "react";
// import { FiCalendar, FiMapPin, FiUsers } from 'react-icons/fi';
import { useDispatch } from "react-redux";
import {
  createUserConnection,
  viewUserProfile,
} from "../../redux/Users/userSlice";
import {
  convertTimestampToDate,
  formatDateRange,
  getDuration,
} from "../../components/utils/globalFunction";
import ExpEduCard from "../../components/ui/cards/Card";
import Button from "../../components/ui/Button/Button";
import { RiUserAddFill } from "react-icons/ri";
import { toast } from "sonner";
import { BsCalendarEvent, BsEye, BsPeople } from "react-icons/bs";
// import { GoVerified } from 'react-icons/go';
import CertificateCard from "../../components/ui/cards/CertificateCard";
import SkillTag from "../../components/ui/SkillTag/SkillTag";
import { MdOutlineContentCopy } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { BaseUrl } from "../../components/hooks/axiosProvider";
// import Loader from '../Loader/Loader';

const StatsCard = ({ icon, value, label }) => (
  <div className="flex flex-col items-center p-4 glassy-card rounded-lg">
    <div className="text-2xl font-bold glassy-text-primary">{value}</div>
    <div className="text-sm glassy-text-secondary">{label}</div>
  </div>
);

const ProfileCard = ({ formData, handleResumeDownload }) => {
  const profile = formData?.personalInfo || {};

  const frameStatusChange = (status) => {
    switch (status) {
      case "none":
        return "Not available";
      case "open_for_project":
        return "Open For Project";
      case "open_for_internship":
        return "Open For Internship";
      case "open_for_job":
        return "Open For Job";
      default:
        return null;
    }
  };

  return (
    <div className="flex items-start gap-4 w-full">
      <img
        src={
          profile?.profile_picture_url ||
          "/0684456b-aa2b-4631-86f7-93ceaf33303c.png"
        }
        alt="Profile"
        className="w-16 h-16 rounded-lg object-cover border"
      />
      <div className="flex flex-col flex-1">
        <div className="flex items-center flex-wrap gap-2">
          {profile?.first_name && (
            <h1 className="text-lg font-semibold glassy-text-primary">
              {`${profile?.first_name || ""} ${profile?.last_name || ""}`}
            </h1>
          )}
          {profile?.is_verified && (
            <img src="/image (2).png" alt="verified" className="w-5 h-5" />
          )}
        </div>
        {profile?.headline && (
          <p className="text-sm glassy-text-primary font-medium mt-1">
            {profile?.headline}
          </p>
        )}
        {profile?.address?.city?.name && (
          <p className="text-sm glassy-text-primary mt-1">
            {profile?.address?.city?.name || "N/A"},{" "}
            {profile?.address?.state?.name || "N/A"}
          </p>
        )}
        <div className="flex flex-wrap gap-2 mt-3">
          {profile?.frame_status !== "none" && (
            <button className="border  text-sm px-3 py-1  rounded-md glassy-button font-medium">
              {frameStatusChange(profile?.frame_status)}
            </button>
          )}
          <button
            className="border  text-sm px-3 py-1 rounded-md glassy-button font-medium flex items-center gap-1"
            onClick={() => handleResumeDownload(profile)}
          >
            Profile URL <MdOutlineContentCopy />
          </button>
        </div>
      </div>
    </div>
  );
};

const UsersProfile = ({ currentUserId }) => {
  const dispatch = useDispatch();
  const path = window.location.pathname;
  const userId = path.split("/").pop();
  const [formData, setFormData] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await dispatch(viewUserProfile({ userId })).unwrap();
      setFormData(res?.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    // Initialize AOS with more configuration options
    Aos.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
      mirror: false,
      offset: 100,
    });

    if (userId) {
      fetchData();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, userId]);

  const handleConnect = async () => {
    setLoading(true);
    try {
      const res = await dispatch(
        createUserConnection({ connection_user_id: userId })
      ).unwrap();
      toast.success(res?.message);
      fetchData();
      setLoading(false);
    } catch (error) {
      toast.error(error);
      setLoading(false);
    }
  };

  const handleResumeDownload = async (data) => {
    const url = `${BaseUrl}user-details/${data?.username}/${data?._id}`;
    // const url = `${BaseUrl}user/profile/${data?.first_name}/${data?._id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("URL copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <>
      <div className="w-full p-4">
        <div>
          <nav className="flex justify-start items-center gap-2 md:mb-2 text-sm mx-4">
            <span
              className="glassy-text-primary cursor-pointer"
              onClick={() => navigate(`/user/feed`)}
            >
              Home
            </span>
            <span className="glassy-text-primary">›</span>
            <span
              className="glassy-text-primary cursor-pointer"
              onClick={() => navigate(`/user/suggested-users?tab=user`)}
            >
              Suggested Profiles
            </span>
            <span className="glassy-text-primary">›</span>
            <span className="font-medium text-blue-600 cursor-pointer">
              Profile Preview
            </span>
          </nav>
        </div>
        <div className="min-h-screen  py-8">
          <div className=" mx-auto  ">
            <div className="grid grid-cols-1  gap-8  ">
              <div className="lg:col-span-2 space-y-2 ">
                <div
                  className=" rounded-lg p-6 glassy-card border border-[#D3D3D3]"
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6 w-full">
                    <div className="w-full md:flex-1">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                        <ProfileCard
                          formData={formData}
                          handleResumeDownload={handleResumeDownload}
                        />
                        {currentUserId &&
                          String(currentUserId) !==
                            String(formData?.personalInfo?._id) && (
                            <div
                              className="mt-4 md:mt-0"
                              data-aos="fade-up"
                              data-aos-delay="400"
                            >
                              <Button
                                className="w-full glassy-button"
                                variant={
                                  formData?.userConnection
                                    ? "connected"
                                    : "connect"
                                }
                                icon={
                                  !formData?.userConnection && (
                                    <RiUserAddFill className="mr-1" />
                                  )
                                }
                                onClick={() => handleConnect(formData)}
                                loading={isLoading}
                              >
                                {formData?.userConnection
                                  ? "Disconnect"
                                  : "Connect"}
                              </Button>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                  <div className=" mt-5">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 md:grid-cols-2">
                      <div className="exp-edu-card">
                        <h2 className="md:mb-1 lg:mb-1 xl:text-lg lg:text-[14px] md:text-[12px]  font-semibold glassy-text-primary">
                          LATEST WORK EXPERIENCE
                        </h2>
                        <ExpEduCard
                          logo={
                            formData?.latestExperience?.logo_url ||
                            "/Img/Profile/Frame (1).png"
                          }
                          title={
                            formData?.latestExperience?.profileName ||
                            "Add your latest work experience"
                          }
                          company={
                            formData?.latestExperience?.companyName ||
                            "Click the + button to add details about your job role and company"
                          }
                          duration={
                            formData?.latestExperience?.start_date &&
                            formData?.latestExperience?.end_date
                              ? formatDateRange(
                                  formData?.latestExperience?.start_date,
                                  formData?.latestExperience?.end_date
                                )
                              : "Start and end date not added"
                          }
                          // location={formData?.profileInfo?.latestCompany?.headquarters?.address_line_1 || "Location not specified"}
                        />
                      </div>

                      <div className="exp-edu-card">
                        <h2 className="md:mb-1 lg:mb-1 xl:text-lg lg:text-[14px] md:text-[12px] font-semibold glassy-text-primary">
                          LATEST EDUCATION
                        </h2>
                        <ExpEduCard
                          logo={
                            formData?.latestEducation?.logo_url ||
                            "/Img/Profile/Frame.png"
                          }
                          title={
                            formData?.latestEducation?.institution ||
                            "Add your latest education details"
                          }
                          company={
                            formData?.latestEducation?.field_of_studies ||
                            "Click the + button to include your course and department"
                          }
                          duration={
                            formData?.latestEducation?.start_date &&
                            formData?.latestEducation?.end_date
                              ? formatDateRange(
                                  formData.latestEducation.start_date,
                                  formData?.latestEducation.end_date
                                )
                              : "Start and end date not added"
                          }
                        />
                      </div>
                      <div className="lg:col-span-1 md:col-span-2 mt-6 lg:mt-0">
                        <h2 className="md:mb-1 lg:mb-2 lg:text-lg md:text-[14px] font-semibold glassy-text-primary">
                          Top Skills
                        </h2>
                        <div className="flex flex-wrap gap-2">
                          {formData?.topSkills?.data?.length > 0 ? (
                            formData?.topSkills?.data?.map((item, index) => (
                              <SkillTag
                                key={index}
                                skill={item.skill_name}
                                variant={item.variant}
                              />
                            ))
                          ) : (
                            <p className="w-full bg-yellow-50 text-yellow-800 text-sm p-2 rounded-md border border-yellow-200 shadow-sm">
                              🚀 No skills added yet. Verify your education and
                              update your skills to showcase your expertise!
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {formData?.personalInfo?.summary && (
                  <div
                    className="glassy-card rounded-lg p-6 border border-[#D3D3D3]"
                    data-aos="fade-up"
                  >
                    <h2 className="text-xl font-bold glassy-text-primary mb-4">
                      About
                    </h2>
                    <p className="glassy-text-primary leading-relaxed">
                      {formData?.personalInfo?.summary}
                    </p>
                  </div>
                )}

                {formData?.personalInfo && (
                  <div className="glassy-card rounded-xl shadow-sm p-4 border ">
                    <div className="grid grid-cols-3 gap-2">
                      <StatsCard
                        icon={<BsEye className="w-5 h-5" />}
                        value={formData?.personalInfo?.profile_views || 0}
                        label="Profile Views"
                      />
                      <StatsCard
                        icon={<BsPeople className="w-5 h-5" />}
                        value={formData?.personalInfo?.follower_count || 0}
                        label="Followers"
                      />
                      <StatsCard
                        icon={<RiUserAddFill className="w-5 h-5" />}
                        value={formData?.personalInfo?.connection_count || 0}
                        label="Connections"
                      />
                    </div>
                  </div>
                )}

                <div className="glassy-card rounded-lg p-6 border border-[#D3D3D3]">
                  <h2 className="text-xl font-bold glassy-text-primary mb-6">
                    EXPERIENCE
                  </h2>
                  {formData?.experiences.length > 0 ? (
                    <>
                      <div className="items-center  grid grid-cols-2">
                        {formData.experiences.map((exp, index) => (
                          <div key={index} className="flex flex-col">
                            <div className="flex justify-start items-start gap-2">
                              <img
                                src={
                                  exp?.logo_url || "/Img/Profile/Frame (1).png"
                                }
                                alt="logo"
                                onError={(e) =>
                                  (e.target.src = "/Img/Profile/Frame (1).png")
                                }
                                className="w-10 h-10  rounded"
                              />
                              <div>
                                <h3 className="font-semibold glassy-text-primary text-base">
                                  {exp.companyName || ""}
                                </h3>
                                <p className="text-[#00000099]/60 text-sm">
                                  {exp.profileName || ""}
                                </p>
                                {exp.start_date && (
                                  // <p className="glassy-text-primary mb-2">
                                  //   {convertTimestampToDate(exp.start_date)} -{" "}
                                  //   {convertTimestampToDate(exp.end_date)}
                                  // </p>
                                  <p className="glassy-text-secondary mb-2">
                                    {exp.start_date
                                      ? new Date(
                                          exp.start_date
                                        ).toLocaleDateString("en-US", {
                                          month: "short",
                                          year: "numeric",
                                        })
                                      : "Start Date"}{" "}
                                    -{" "}
                                    {exp.end_date
                                      ? new Date(
                                          exp.end_date
                                        ).toLocaleDateString("en-US", {
                                          month: "short",
                                          year: "numeric",
                                        })
                                      : "Present"}
                                  </p>
                                )}
                                {exp.grade && (
                                  <p className="glassy-text-primary">
                                    Grade: {exp.grade}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="px-6 py-5 text-center border-2 border-gray-300 border-dashed rounded-lg glassy-card hover:border-blue-300 transition-colors duration-300">
                        <div className="flex items-center justify-center mx-auto mb-4">
                          <img
                            src={`/Img/Profile/Frame (1).png`}
                            alt=""
                            className="hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <h3 className="mb-2 text-[20px]  font-semibold glassy-text-primary">
                          {`No experiences added`}
                        </h3>
                        <p className="text-sm glassy-text-secondary">
                          {`Add your professional experiences to build a comprehensive profile`}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                <div className="glassy-card rounded-lg p-6 border border-[#D3D3D3]">
                  <h2 className="text-xl font-bold glassy-text-primary mb-6">
                    Education
                  </h2>
                  {formData?.educations.length > 0 ? (
                    <div>
                      {formData?.educations?.map((edu, index) => (
                        <div
                          key={index}
                          className="mb-6 pb-6 border-b border-[#C3D6FF] last:border-b-0 last:pb-0 last:mb-0 "
                        >
                          <div className="flex justify-between items-start pb-2">
                            <div className="flex justify-start items-start gap-2">
                              <img
                                src={edu?.logo_url}
                                alt="logo"
                                onError={(e) =>
                                  (e.target.src = "/Img/Profile/Frame.png")
                                }
                                className="w-10 h-10 rounded-full"
                              />
                              <div>
                                <h3 className="font-bold glassy-text-primary text-lg">
                                  {edu.institution || "Unspecified institution"}
                                </h3>
                                <p className="glassy-text-primary text-sm">
                                  {edu.degree || "No degree specified"}
                                </p>
                                <p className="glassy-text-secondary text-sm flex items-center gap-1 mt-1">
                                  <BsCalendarEvent size={12} />{" "}
                                  {getDuration(edu.start_date, edu.end_date)}
                                </p>
                              </div>
                            </div>
                          </div>
                          {edu?.skills_acquired?.map((e) => (
                            <span className="text-xl font-bold glassy-text-secondary rounded-full px-2 py-0.5 border text-[10px] mr-1">
                              {e?.name}
                            </span>
                          ))}
                          {/* <SkillsCard skills={edu?.skills_acquired} /> */}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <div className="px-6 py-5 text-center border-2  border-dashed rounded-lg glassy-card  transition-colors duration-300">
                        <div className="flex items-center justify-center mx-auto mb-4">
                          <img
                            src={`/Img/Profile/Frame.png`}
                            alt=""
                            className="hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <h3 className="mb-2 text-[20px]  font-semibold glassy-text-primary">
                          {`No Education records`}
                        </h3>
                        <p className="text-sm glassy-text-secondary">
                          {`Add your education history to enhance your profile`}
                        </p>
                      </div>
                    </>
                  )}
                </div>
                <div className="glassy-card p-6 rounded-md border border-[#D3D3D3]">
                  <h2 className="text-xl font-bold glassy-text-primary mb-6 ">
                    projects
                  </h2>
                  {formData?.projects.length > 0 ? (
                    <div
                      className={`${
                        formData?.projects.length > 1
                          ? "grid md:grid-cols-2 grid-cols-1 gap-2 items-center"
                          : "certificate"
                      } `}
                    >
                      {formData?.projects?.map((ele, index) => (
                        <CertificateCard
                          certificateName={ele?.name}
                          issueBy={ele?.issuing_organization}
                          description={ele?.description}
                          date={convertTimestampToDate(ele?.issue_date)}
                          certificateUrlOrNumber={ele?.file_url}
                          imageUrl={ele?.media_url}
                        />
                      ))}
                    </div>
                  ) : (
                    <div>
                      <div className="px-6 py-5 text-center border-2 border-gray-300 border-dashed rounded-lg glassy-card hover:border-blue-300 transition-colors duration-300">
                        <div className="flex items-center justify-center mx-auto mb-4">
                          <img
                            src={`/Img/Profile/fi_1336494.png`}
                            alt=""
                            className="hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <h3 className="mb-2 text-[20px]  font-semibold glassy-text-primary">
                          {`No  Project`}
                        </h3>
                        <p className="text-sm glassy-text-secondary">
                          {`Add your Project to build a comprehensive profile`}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="glassy-card p-6 rounded-md border border-[#D3D3D3]">
                  <h2 className="capitalize text-base glassy-text-primary font-medium py-2">
                    Certifications
                  </h2>
                  {formData?.certifications.length > 0 ? (
                    <div
                      className={`${
                        formData?.certifications.length > 1
                          ? "grid md:grid-cols-2 grid-cols-1 gap-2 items-center"
                          : "certificate"
                      }`}
                    >
                      {formData?.certifications?.map((ele, index) => (
                        <CertificateCard
                          certificateName={ele?.name}
                          issueBy={ele?.issuing_organization}
                          description={ele?.description}
                          date={convertTimestampToDate(ele?.issue_date)}
                          certificateUrlOrNumber={ele?.credential_url}
                          imageUrl={ele?.media_url}
                          record={ele}
                          username={formData}
                        />
                      ))}
                    </div>
                  ) : (
                    <div>
                      <div className="px-6 py-5 text-center border-2 border-gray-300 border-dashed rounded-lg glassy-card hover:border-blue-300 transition-colors duration-300">
                        <div className="flex items-center justify-center mx-auto mb-4">
                          <img
                            src={`/Img/Profile/Frame (2).png`}
                            alt=""
                            className="hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <h3 className="mb-2 text-[20px]  font-semibold glassy-text-primary">
                          {`No Certifications added`}
                        </h3>
                        <p className="text-sm glassy-text-secondary">
                          {`Add your certifications to build a comprehensive profile`}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UsersProfile;
