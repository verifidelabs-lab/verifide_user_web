/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { viewUserProfile } from "../../redux/Users/userSlice";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import NoDataFound from "../../components/ui/No Data/NoDataFound";
import { capitalizeWords, formatDateByMomentTimeZone } from "../../components/utils/globalFunction";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Resume = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { username } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const resumeRef = useRef();

  const fetchData = async () => {
    try {
      setLoading(true);
      const payload = {};

      if (username) {
        payload.username = username
      }

      const response = await dispatch(viewUserProfile(payload)).unwrap();
      if (response.error) {
        toast.error(response?.message || "We're sorry for the inconvenience! There was an issue processing your request.")
      }
      setProfileData(response?.data || null);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error(
        "We're sorry for the inconvenience! There was an issue processing your request."
      );
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    setIsGeneratingPDF(true);
    
    // Get the resume element
    const resumeElement = resumeRef.current;
    
    // Use html2canvas to capture the resume as an image
    html2canvas(resumeElement, {
      scale: 2, // Higher scale for better quality
      useCORS: true, // Allow cross-origin images
      logging: false,
    }).then((canvas) => {
      // Convert canvas to image data
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      
      // Calculate PDF dimensions
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Initialize PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      let heightLeft = imgHeight;
      let position = 0;
      
      // Add first page
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Download the PDF
      const fileName = `Resume_${profileData.personalInfo.first_name}_${profileData.personalInfo.last_name}.pdf`;
      pdf.save(fileName);
      
      setIsGeneratingPDF(false);
    }).catch((error) => {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF. Please try again.');
      setIsGeneratingPDF(false);
    });
  };

  useEffect(() => {
    fetchData()
  }, []);

  if (!profileData) {
    return (
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div>
          <nav className="flex justify-start items-center gap-2 mb-2 text-sm">
            <span className="glassy-text-secondary cursor-pointer" onClick={() => navigate(`/user/feed`)}>Home</span>
            <span className="glassy-text-secondary">›</span>
            <span className="glassy-text-secondary cursor-pointer" onClick={() => navigate(`/user/profile`)}>Profile</span>
            <span className="glassy-text-secondary">›</span>
            <span className="font-medium text-blue-600 cursor-pointer">Resume Preview</span>
          </nav>
        </div>
        <div className="flex flex-col items-center justify-center h-72 gap-3 animate-pulse">
          <NoDataFound message={"User details not found. Please log in again or contact support."} />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-72 gap-3 animate-pulse">
        <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span className="glassy-text-secondary">Loading...</span>
      </div>
    );
  }

  return (
    <>
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex justify-between items-center mb-4">
          <nav className="flex justify-start items-center gap-2 text-sm">
            <span className="glassy-text-secondary cursor-pointer" onClick={() => navigate(`/user/feed`)}>Home</span>
            <span className="glassy-text-secondary">›</span>
            <span className="glassy-text-secondary cursor-pointer" onClick={() => navigate(`/user/profile`)}>Profile</span>
            <span className="glassy-text-secondary">›</span>
            <span className="font-medium text-blue-600 cursor-pointer">Resume Preview</span>
          </nav>
          
          <button
            onClick={downloadPDF}
            disabled={isGeneratingPDF}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 glassy-text-primary font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingPDF ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span>Download PDF</span>
              </>
            )}
          </button>
        </div>

        <div className="min-h-screen py-10 flex justify-center">
          <div ref={resumeRef} className="w-[900px] glassy-card shadow-xl grid grid-cols-3 rounded-lg overflow-hidden">
            {/* Left Sidebar */}
            <div className="glassy-card glassy-text-primary p-6 flex flex-col gap-8">
              {/* Profile Image */}
              <div className="flex justify-center">
                <img
                  src={profileData?.personalInfo?.profile_picture_url || '/0684456b-aa2b-4631-86f7-93ceaf33303c.png'}
                  alt="profile"
                  className="w-32 h-32 rounded-full border-4 border-yellow-500 object-cover"
                  onError={(e) => {
                    e.target.onerror = null; // prevent infinite loop
                    e.target.src = '/0684456b-aa2b-4631-86f7-93ceaf33303c.png'; // fallback image
                  }}
                />
              </div>

              {/* Contact */}
              <div>
                <h2 className="text-xl font-semibold mb-3 border-b border-yellow-400 pb-1 glassy-text-primary">
                  Contact Me
                </h2>
                <p className="mb-2">📞 +{profileData?.personalInfo?.country_code?.dial_code} {profileData?.personalInfo?.phone_number}</p>
                <p className="mb-2 break-words break-all">✉️ {profileData?.personalInfo.email}</p>
                <p>
                  📍 {profileData?.personalInfo?.address?.address_line_1}
                  {profileData?.personalInfo?.address?.address_line_2 ? `, ${profileData.personalInfo.address.address_line_2}` : ""}
                  {profileData?.personalInfo?.address?.city?.name ? `, ${profileData.personalInfo.address.city.name}` : ""}
                  {profileData?.personalInfo?.address?.state?.name ? `, ${profileData.personalInfo.address.state.name}` : ""}
                  {profileData?.personalInfo?.address?.pin_code ? ` - ${profileData.personalInfo.address.pin_code}` : ""}
                  {profileData?.personalInfo?.address?.country?.name ? `, ${profileData.personalInfo.address.country.name}` : ""}
                </p>
              </div>

              {/* Certificates */}
              {Array.isArray(profileData.certifications) && profileData.certifications.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-3 border-b border-yellow-400 pb-1 glassy-text-primary">
                    Certificate
                  </h2>
                  <ul className="list-disc list-inside space-y-2">
                    {profileData.certifications.sort((a, b) => b.issue_date - a.issue_date).map((cert, index) => (
                      <li key={index}>{capitalizeWords(cert.name)}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Education */}
              {Array.isArray(profileData.educations) && profileData.educations.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-3 border-b border-yellow-400 pb-1 glassy-text-primary">
                    Education
                  </h2>
                  <ul className="space-y-3">
                    {profileData.educations.map((edu, index) => (
                      <li key={index}>
                        <p className="font-medium text-lg">{capitalizeWords(edu.institution)}</p>
                        <p className="text-sm glassy-text-secondary">
                          {capitalizeWords(edu.degree)} (
                          {formatDateByMomentTimeZone(edu.start_date, "YYYY")} -{" "}
                          {edu.currently_available
                            ? "Present"
                            : formatDateByMomentTimeZone(edu.end_date, "YYYY")}
                          )
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Content */}
            <div className="col-span-2 p-10 flex flex-col gap-10">
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold glassy-text-primary capitalize">{profileData.personalInfo.first_name} {profileData.personalInfo.last_name}</h1>
                <p className="glassy-text-secondary text-lg">{profileData.personalInfo.headline}</p>
              </div>

              {/* About */}
              <div>
                <h2 className="text-3xl font-semibold text-yellow-500 mb-2 glassy-text-primary">
                  About Me
                </h2>
                <p className="glassy-text-primary leading-relaxed break-words break-all ">
                  {profileData.personalInfo.summary}
                </p>
              </div>

              {/* Job Experience */}
              {Array.isArray(profileData.experiences) && profileData.experiences.length > 0 && (
                <div>
                  <h2 className="text-3xl font-semibold text-yellow-500 mb-4 glassy-text-primary">
                    Job Experience
                  </h2>

                  {profileData.experiences.map((exp, index) => (
                    <div key={index} className="mb-6">
                      {/* Company + Role */}
                      <p className="font-semibold text-lg glassy-text-secondary">
                        {exp.companyName} — {exp.profileName}
                      </p>

                      {/* Dates */}
                      <p className="text-sm glassy-text-secondary">
                        {formatDateByMomentTimeZone(exp.start_date, "YYYY")} -{" "}
                        {exp.currently_available
                          ? "Present"
                          : exp.end_date
                            ? formatDateByMomentTimeZone(exp.end_date, "YYYY")
                            : "N/A"}
                      </p>

                      {/* Description */}
                      {exp.description && (
                        <p className="glassy-text-primary mt-1">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Skills */}
              {profileData?.topSkills?.data?.length > 0 && (
                <div>
                  <h2 className="text-3xl font-semibold text-yellow-500 mb-4 glassy-text-primary">
                    Skills
                  </h2>
                  <div className="grid grid-cols-2 gap-2 glassy-text-primary">
                    {profileData.topSkills.data.map((skill) => (
                      <span key={skill.skill_id}>✔ {skill.skill_name}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Resume;