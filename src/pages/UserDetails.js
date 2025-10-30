import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiUrl } from "../components/hooks/axiosProvider";
import Button from "../components/ui/Button/Button";
import { useDispatch } from "react-redux";
import { getProfile } from "../redux/slices/authSlice";

const UserDetails = () => {
  const { id, username } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUserData, setIsUserData] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // useEffect(() => {
  //   if (isUserData) {
  //     // Redirect to the user's own profile page (example)
  //     navigate(`/user/profile/${username}/${id}`);
  //   }
  // }, [isUserData, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let res;
        if (username) {
          res = await fetch(
            `${apiUrl}user/profiles/view-user-profile?username=${username}`,
            {
              method: "GET",
            }
          );
        } else if (id) {
          res = await fetch(
            `${apiUrl}user/profiles/view-user-profile?userId=${id}`,
            {
              method: "GET",
            }
          );
        }

        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();
        if (data.error) throw new Error(data.message);

        setUserData(data.data);

        // Update meta tags
        updateMetaTags(data.data.personalInfo);

        // 🔹 Redux dispatch after fetch
        const reduxRes = await dispatch(getProfile()).unwrap();
        setIsUserData(reduxRes?.data);
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id || username) {
      fetchData();
    }
  }, [id, username, dispatch]);

  // Function to update meta tags
  const updateMetaTags = (personalInfo) => {
    // Update or create meta tags for Open Graph
    const metaTags = [
      {
        property: "og:title",
        content: `${personalInfo.first_name} ${personalInfo.last_name}`,
      },
      {
        property: "og:description",
        content: personalInfo.summary || "User Profile",
      },
      { property: "og:image", content: personalInfo.profile_picture_url },
      { property: "og:url", content: window.location.href },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: `${personalInfo.first_name} ${personalInfo.last_name}`,
      },
      {
        name: "twitter:description",
        content: personalInfo.summary || "User Profile",
      },
      { name: "twitter:image", content: personalInfo.profile_picture_url },
    ];

    metaTags.forEach((tag) => {
      let metaElement =
        document.querySelector(`meta[property="${tag.property}"]`) ||
        document.querySelector(`meta[name="${tag.name}"]`);

      if (!metaElement) {
        metaElement = document.createElement("meta");
        if (tag.property) {
          metaElement.setAttribute("property", tag.property);
        } else if (tag.name) {
          metaElement.setAttribute("name", tag.name);
        }
        document.head.appendChild(metaElement);
      }

      if (tag.property) {
        metaElement.setAttribute("property", tag.property);
      } else if (tag.name) {
        metaElement.setAttribute("name", tag.name);
      }
      metaElement.setAttribute("content", tag.content);
    });

    // Update page title
    document.title = `${personalInfo.first_name} ${personalInfo.last_name} | Profile`;
  };

  // Format date from timestamp
  const formatDate = (timestamp) => {
    if (!timestamp) return "Present";
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-xl">Error: {error}</div>
      </div>
    );

  if (!userData)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="glassy-text-secondary text-xl">No profile data found</div>
      </div>
    );

  const { personalInfo, educations, experiences, projects, certifications } =
    userData;

  const isImage = (url) => {
    const imageExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".webp",
      ".bmp",
      ".svg",
    ];
    return imageExtensions.some((ext) => url.toLowerCase().endsWith(ext));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Server-side rendering meta tags (will be replaced by JavaScript) */}
      <noscript>
        <meta
          property="og:title"
          content={`${personalInfo.first_name} ${personalInfo.last_name}`}
        />
        <meta
          property="og:description"
          content={personalInfo.summary || "User Profile"}
        />
        <meta property="og:image" content={personalInfo.profile_picture_url} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="profile" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`${personalInfo.first_name} ${personalInfo.last_name}`}
        />
        <meta
          name="twitter:description"
          content={personalInfo.summary || "User Profile"}
        />
        <meta name="twitter:image" content={personalInfo.profile_picture_url} />
      </noscript>

      <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="glassy-card rounded-lg shadow overflow-hidden">
          <div className="h-48 bg-gradient-to-r from-blue-500 to-blue-700"></div>

          <div className="px-6 pb-6 relative">
            <div className="flex flex-col sm:flex-row">
              <div className="relative -mt-16 sm:mr-6">
                {personalInfo.profile_picture_url ? (
                  <img
                    src={personalInfo.profile_picture_url}
                    alt={`${personalInfo.first_name} ${personalInfo.last_name}`}
                    className="h-32 w-32 rounded-full border-4 border-white object-cover"
                  />
                ) : (
                  <img
                    src={`/0684456b-aa2b-4631-86f7-93ceaf33303c.png`}
                    alt={`${personalInfo.first_name} ${personalInfo.last_name}`}
                    className="h-32 w-32 rounded-full border-4 border-white object-cover"
                  />
                )}
              </div>

              <div className="flex-1 mt-4 sm:mt-2">
                <h1 className="text-2xl font-bold glassy-text-primary">
                  {personalInfo?.first_name} {personalInfo?.last_name}
                </h1>
                <p className="text-gray-700">{personalInfo?.headline}</p>
                <p className="glassy-text-secondary text-sm mt-1">
                  {personalInfo?.address?.city?.name}{" "}
                  {personalInfo?.address?.state?.name}{" "}
                  {personalInfo?.address?.country?.name}
                  {/* <span className="text-blue-600 ml-1">Contact info</span> */}
                </p>

                <div className="flex flex-wrap items-center mt-3 text-sm glassy-text-secondary">
                  <span className="mr-4">
                    {personalInfo.connection_count} connections
                  </span>
                  <span className="mr-4">
                    {personalInfo.follower_count} followers
                  </span>
                  <span>{personalInfo.profile_views} profile views</span>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {personalInfo?.frame_status !== "none" && (
                    <button className="bg-blue-600 hover:bg-blue-700 glassy-text-primary font-medium py-1.5 px-4 rounded-full text-sm">
                      {personalInfo?.frame_status === "none"
                        ? ""
                        : personalInfo?.frame_status}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            {personalInfo.summary && (
              <div className="glassy-card rounded-lg shadow p-6">
                <h2 className="text-xl font-bold glassy-text-primary mb-4">About</h2>
                <p className="text-gray-700">{personalInfo.summary}</p>
              </div>
            )}

            {/* Experience Section */}
            <div className="glassy-card rounded-lg shadow p-6">
              <h2 className="text-xl font-bold glassy-text-primary mb-4">
                Experience
              </h2>
              {experiences.map((exp, index) => (
                <div key={index} className="mb-6 last:mb-0">
                  <div className="flex">
                    <div className="mr-4 flex-shrink-0">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 glassy-text-secondary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold glassy-text-primary">
                        {exp.profileName}
                      </h3>
                      <p className="text-gray-700">{exp.companyName}</p>
                      <p className="glassy-text-secondary text-sm">
                        {formatDate(exp.start_date)} -{" "}
                        {formatDate(exp.end_date)}
                      </p>
                      <p className="glassy-text-secondary text-sm">
                        {exp.industryName}
                      </p>
                      {exp.description && (
                        <p className="text-gray-700 mt-2">{exp.description}</p>
                      )}
                      {exp.skills_acquired &&
                        exp.skills_acquired.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {exp.skills_acquired.map((skill) => (
                              <span
                                key={skill._id}
                                className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full"
                              >
                                {skill.name}
                              </span>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Education Section */}
            <div className="glassy-card rounded-lg shadow p-6">
              <h2 className="text-xl font-bold glassy-text-primary mb-4">
                Education
              </h2>
              {educations.map((edu, index) => (
                <div key={index} className="mb-6 last:mb-0">
                  <div className="flex">
                    <div className="mr-4 flex-shrink-0">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 glassy-text-secondary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 14l9-5-9-5-9 5 9 5z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 14l9-5-9-5-9 5 9 5z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 14v6l9-5m-9 5l-9-5m9 5v-6m0 0l-9-5m9 5l9-5"
                          />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold glassy-text-primary">
                        {edu.institution}
                      </h3>
                      <p className="text-gray-700">
                        {edu.degree} - {edu.field_of_studies}
                      </p>
                      <p className="glassy-text-secondary text-sm">
                        {formatDate(edu.start_date)} -{" "}
                        {formatDate(edu.end_date)}
                      </p>
                      {edu.description && (
                        <p className="text-gray-700 mt-2">{edu.description}</p>
                      )}
                      {edu.skills_acquired &&
                        edu.skills_acquired.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {edu.skills_acquired.map((skill) => (
                              <span
                                key={skill._id}
                                className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full"
                              >
                                {skill.name}
                              </span>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Projects Section */}
            <div className="glassy-card rounded-lg shadow p-6">
              <h2 className="text-xl font-bold glassy-text-primary mb-4">Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((project, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    {isImage(project?.media_url) ? (
                      <img
                        src={project?.media_url}
                        alt="preview"
                        className="w-full md:max-w-full md:min-h-80 min-h-80 max-h-80 object-contain"
                      />
                    ) : (
                      <iframe
                        src={`https://docs.google.com/gview?url=${encodeURIComponent(
                          project?.media_url
                        )}&embedded=true`}
                        title="file-preview"
                        className="w-full h-80 border rounded"
                      />
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold glassy-text-primary">
                        {project.name}
                      </h3>
                      <p className="glassy-text-secondary text-sm">
                        {formatDate(project.start_date)} -{" "}
                        {formatDate(project.end_date)}
                      </p>
                      <p className="text-gray-700 text-sm mt-2 line-clamp-3">
                        {project.description}
                      </p>
                      {project.company && (
                        <p className="text-gray-700 text-sm mt-2">
                          <span className="font-medium">Company:</span>{" "}
                          {project.company}
                        </p>
                      )}

                      {project.institution && (
                        <div className="flex justify-start gap-2 items-center ">
                          <p className=" text-sm font-semibold glassy-text-primary">
                            Institute
                          </p>
                          <p className="text-xs glassy-text-secondary font-medium">
                            {project.institution}
                          </p>
                        </div>
                      )}
                      {project.file_url && (
                        <a
                          href={project.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 text-sm mt-2 inline-block"
                        >
                          View Project
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications Section */}
            <div className="glassy-card rounded-lg shadow p-6">
              <h2 className="text-xl font-bold glassy-text-primary mb-4">
                {" "}
                Certifications
              </h2>
              {certifications.map((cert, index) => (
                <div key={index} className="mb-6 last:mb-0">
                  <div className="flex">
                    <div className="mr-4 flex-shrink-0">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 glassy-text-secondary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold glassy-text-primary">
                        {cert.name}
                      </h3>
                      <p className="text-gray-700">
                        {cert.issuing_organization}
                      </p>
                      <p className="glassy-text-secondary text-sm">
                        Issued {formatDate(cert.issue_date)}
                      </p>
                      {cert.credential_id && (
                        <p className="glassy-text-secondary text-sm">
                          Credential ID {cert.credential_id}
                        </p>
                      )}
                      {cert.credential_url && (
                        <a
                          href={cert.credential_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 text-sm mt-1 inline-block"
                        >
                          Show credential
                        </a>
                      )}
                      {cert.skills_acquired &&
                        cert.skills_acquired.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {cert.skills_acquired.map((skill) => (
                              <span
                                key={skill._id}
                                className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full"
                              >
                                {skill.name}
                              </span>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
