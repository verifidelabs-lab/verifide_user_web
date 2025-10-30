import "aos/dist/aos.css";
import { getCookie } from "../../components/utils/cookieHandler";

const ROLES = {
  SUPER_ADMIN: 1,
  ADMIN: 2,
  COMPANIES: 3,
  COMPANIES_ADMIN: 7,
  INSTITUTIONS: 4,
  INSTITUTIONS_ADMIN: 8,
};

const Profile = ({ adminProfileData, companiesProfileData, instituteProfileData }) => {
  const userRole = Number(getCookie("USER_ROLE"));

  const profileData =
    [ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(userRole)
      ? adminProfileData
      : [ROLES.COMPANIES, ROLES.COMPANIES_ADMIN].includes(userRole)
        ? companiesProfileData
        : [ROLES.INSTITUTIONS, ROLES.INSTITUTIONS_ADMIN].includes(userRole)
          ? instituteProfileData
          : {};


  const getDefaultName = (roleId) => {
    switch (roleId) {
      case 1:
      case 2:
        return "Super Admin";
      case 3:
      case 7:
        return "Company";
      case 4:
      case 8:
        return "Institute";
      default:
        return "User";
    }
  };

  const renderInstituteData = (instituteData) => {
    return (
      <div className="grid sm:grid-cols-2 gap-4 text-sm glassy-text-primary">
        <div>
          <span className="font-semibold glassy-text-primary">Name:</span> {instituteData.name ?? "N/A"}
        </div>
        <div>
          <span className="font-semibold glassy-text-primary">Display Name:</span> {instituteData.display_name ?? "N/A"}
        </div>
        <div>
          <span className="font-semibold glassy-text-primary">Description:</span> {instituteData.description ?? "N/A"}
        </div>
        <div>
          <span className="font-semibold glassy-text-primary">Website:</span>{" "}
          <a href={instituteData.website_url} target="_blank" rel="noopener noreferrer">
            {instituteData.website_url ?? "N/A"}
          </a>
        </div>
        <div>
          <span className="font-semibold glassy-text-primary">Phone:</span> {instituteData.phone_no ?? "N/A"}
        </div>
        <div>
          <span className="font-semibold glassy-text-primary">Country:</span>{" "}
          {instituteData.country_code?.name ?? "N/A"} {instituteData.country_code?.emoji ?? "N/A"}
        </div>
        <div>
          <span className="font-semibold glassy-text-primary">Address:</span> {instituteData.address?.address_line_1 ?? "N/A"}
        </div>
        <div>
          <span className="font-semibold glassy-text-primary">Founded Year:</span> {instituteData.founded_year ?? "N/A"}
        </div>
      </div>
    );
  };

  const renderCompanyData = (companyData) => {
    const fields = [
      { label: 'Company Name', value: companyData.name },
      { label: 'Display Name', value: companyData.display_name },
      { label: 'Description', value: companyData.description },
      { label: 'Website', value: companyData.website_url, isLink: true },
      { label: 'Phone', value: companyData.phone_no },
      { label: 'Country', value: `${companyData.country_code?.name ?? 'N/A'} ${companyData.country_code?.emoji ?? ''}` },
      { label: 'Address', value: companyData.headquarters?.address_line_1 },
      { label: 'Employee Count', value: companyData.employee_count },
      { label: 'Specialties', value: companyData.specialties?.join(", ") },
      { label: 'Industry', value: companyData.industry?.map(industry => industry.name).join(", ") },
      { label: 'Founded Year', value: new Date(companyData.founded_year * 1000).getFullYear() },
      { label: 'LinkedIn', value: companyData.linkedin_page_url, isLink: true },
      { label: 'Email', value: companyData.email },
      { label: 'Company Size', value: companyData.company_size },
      { label: 'Company Type', value: companyData.company_type },
    ];

    return (
      <div className="grid sm:grid-cols-2 gap-4 text-sm glassy-text-primary">
        {fields.map(({ label, value, isLink }, index) => (
          <div key={index}>
            <span className="font-semibold glassy-text-primary">{label}:</span>{" "}
            {isLink ? (
              <a href={value} target="_blank" rel="noopener noreferrer">
                {value ?? "N/A"}
              </a>
            ) : (
              value ?? "N/A"
            )}
          </div>
        ))}
      </div>
    );
  };


  if (!profileData)
    return (
      <div className="p-4 text-red-600">
        <h2>No profile data available</h2>
        <p>It seems like there is no data available for this user.</p>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 glassy-card shadow-md rounded-lg border border-gray-200">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
        <img
          src={
            profileData.profile_picture_url ||
            "https://media.istockphoto.com/id/2186780921/photo/young-woman-programmer-focused-on-her-work-coding-on-dual-monitors-in-a-modern-office.webp?a=1&b=1&s=612x612&w=0&k=20&c=SAF-y0Rjzil_3FQi2KmAyXOAKYHaHRRbNxjQXnMsObk="
          }
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border-2 border-blue-600 shadow-sm"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://media.istockphoto.com/id/2186780921/photo/young-woman-programmer-focused-on-her-work-coding-on-dual-monitors-in-a-modern-office.webp?a=1&b=1&s=612x612&w=0&k=20&c=SAF-y0Rjzil_3FQi2KmAyXOAKYHaHRRbNxjQXnMsObk=";
          }}
        />

        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-bold text-blue-700">
            {profileData.first_name || profileData.last_name
              ? `${profileData.first_name || ""} ${profileData.last_name || ""}`.trim()
              : getDefaultName(profileData.role_ids?.[0])}
          </h1>
          <p className="text-sm glassy-text-secondary">{profileData.email}</p>
        </div>
      </div>

      {userRole === ROLES.INSTITUTIONS || userRole === ROLES.INSTITUTIONS_ADMIN
        ? renderInstituteData(profileData)
        : userRole === ROLES.COMPANIES || userRole === ROLES.COMPANIES_ADMIN
          ? renderCompanyData(profileData)
          : (
            <div className="grid sm:grid-cols-2 gap-4 text-sm glassy-text-primary">
              <div>
                <span className="font-semibold glassy-text-primary">Username:</span>{" "}
                {profileData.username ?? "N/A"}
              </div>

              <div>
                <span className="font-semibold glassy-text-primary">Phone:</span>{" "}
                {profileData.country_code?.dial_code ?? "N/A"} {profileData.phone_number ?? "--- --- ----"}
              </div>

              <div>
                <span className="font-semibold glassy-text-primary">Country:</span>{" "}
                {profileData.country_code?.name ?? "N/A"} {profileData.country_code?.emoji ?? "N/A"}
              </div>

              <div>
                <span className="font-semibold glassy-text-primary">Email Verified:</span>{" "}
                {profileData.email_verified ? "✅ Yes" : "❌ No"}
              </div>

              <div>
                <span className="font-semibold glassy-text-primary">Last Active:</span>{" "}
                {new Date(profileData.last_active_at).toLocaleString() ?? "N/A"}
              </div>

              <div>
                <span className="font-semibold glassy-text-primary">Created At:</span>{" "}
                {new Date(profileData.createdAt).toLocaleDateString() ?? "N/A"}
              </div>
            </div>
          )}
    </div>
  );
};

export default Profile;


// import { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import "aos/dist/aos.css";
// import { getCookie } from "../../components/utils/cookieHandler";
// import { adminProfile, companiesProfile, instituteProfile } from "../../redux/slices/authSlice";
// import Loader from "../Loader/Loader";

// const ROLES = {
//   SUPER_ADMIN: 1,
//   ADMIN: 2,
//   COMPANIES: 3,
//   COMPANIES_ADMIN: 7,
//   INSTITUTIONS: 4,
//   INSTITUTIONS_ADMIN: 8
// };

// const Profile = ({ adminProfileData, companiesProfileData, instituteProfileData }) => {
//   const dispatch = useDispatch();
//   const [isLoading, setIsLoading] = useState(true);
//   const userRole = Number(getCookie("USER_ROLE"));
//   useEffect(() => {
//     const fetchData = async () => {
//       if (userRole === ROLES.ADMIN || userRole === ROLES.SUPER_ADMIN) {
//         await dispatch(adminProfile());
//       } else if (userRole === ROLES.COMPANIES || userRole === ROLES.COMPANIES_ADMIN) {
//         await dispatch(companiesProfile());
//       } else if (userRole === ROLES.INSTITUTIONS || userRole === ROLES.INSTITUTIONS_ADMIN) {
//         await dispatch(instituteProfile());
//       }
//       setIsLoading(false);
//     };

//     fetchData();
//   }, [dispatch, userRole]);

//   const profileData =
//     [ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(userRole)
//       ? adminProfileData
//       : [ROLES.COMPANIES, ROLES.COMPANIES_ADMIN].includes(userRole)
//         ? companiesProfileData
//         : [ROLES.INSTITUTIONS, ROLES.INSTITUTIONS_ADMIN].includes(userRole)
//           ? instituteProfileData
//           : {};

//   const getDefaultName = (roleId) => {
//     switch (roleId) {
//       case 1:
//       case 2:
//         return "Super Admin";
//       case 3:
//       case 7:
//         return "Company";
//       case 4:
//       case 8:
//         return "Institute";
//       default:
//         return "User";
//     }
//   };

//   if (isLoading) return <div className=""><Loader /></div>;

//   if (!profileData)
//     return <div className="p-4 text-red-600">No profile data available.</div>;

//   return (
//     <div className="max-w-3xl mx-auto mt-10 p-6 glassy-card shadow-md rounded-lg border border-gray-200">
//       <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
//         <img
//           src={
//             profileData.profile_picture_url ||
//             "https://media.istockphoto.com/id/2186780921/photo/young-woman-programmer-focused-on-her-work-coding-on-dual-monitors-in-a-modern-office.webp?a=1&b=1&s=612x612&w=0&k=20&c=SAF-y0Rjzil_3FQi2KmAyXOAKYHaHRRbNxjQXnMsObk="
//           }
//           alt="Profile"
//           className="w-24 h-24 rounded-full object-cover border-2 border-blue-600 shadow-sm"
//           onError={(e) => {
//             e.target.onerror = null;
//             e.target.src =
//               "https://media.istockphoto.com/id/2186780921/photo/young-woman-programmer-focused-on-her-work-coding-on-dual-monitors-in-a-modern-office.webp?a=1&b=1&s=612x612&w=0&k=20&c=SAF-y0Rjzil_3FQi2KmAyXOAKYHaHRRbNxjQXnMsObk=";
//           }}
//         />

//         <div className="text-center sm:text-left">
//           <h1 className="text-2xl font-bold text-blue-700">
//             {profileData.first_name || profileData.last_name
//               ? `${profileData.first_name || ""} ${profileData.last_name || ""}`.trim()
//               : getDefaultName(profileData.role_ids?.[0])}
//           </h1>
//           <p className="text-sm glassy-text-secondary">{profileData.email}</p>
//         </div>
//       </div>

//       <div className="grid sm:grid-cols-2 gap-4 text-sm glassy-text-primary">
//         <div>
//           <span className="font-semibold glassy-text-primary">Username:</span>{" "}
//           {profileData.username ?? "N/A"}
//         </div>

//         <div>
//           <span className="font-semibold glassy-text-primary">Phone:</span>{" "}
//           {profileData.country_code?.dial_code ?? "N/A"} {profileData.phone_number ?? "--- --- ----"}
//         </div>

//         <div>
//           <span className="font-semibold glassy-text-primary">Country:</span>{" "}
//           {profileData.country_code?.name ?? "N/A"} {profileData.country_code?.emoji ?? "N/A"}
//         </div>

//         <div>
//           <span className="font-semibold glassy-text-primary">Email Verified:</span>{" "}
//           {profileData.email_verified ? "✅ Yes" : "❌ No"}
//         </div>

//         <div>
//           <span className="font-semibold glassy-text-primary">Last Active:</span>{" "}
//           {new Date(profileData.last_active_at).toLocaleString() ?? "N/A"}
//         </div>

//         <div>
//           <span className="font-semibold glassy-text-primary">Created At:</span>{" "}
//           {new Date(profileData.createdAt).toLocaleDateString() ?? "N/A"}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;
