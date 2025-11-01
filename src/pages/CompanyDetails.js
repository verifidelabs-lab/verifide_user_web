import React, { useEffect, useState } from "react";
import {
  Globe,
  Phone,
  Users,
  Calendar,
  Building,
  Mail,
  Linkedin,
  CheckCircle,
} from "lucide-react";
import { viewCompanyInstituteProfile } from "../redux/Users/userSlice";
import { useDispatch } from "react-redux";
import { getCookie } from "../components/utils/cookieHandler";
import { useParams } from "react-router-dom";

const CompanyDetails = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("Home");
  const [agencyData, setAgencyData] = useState({});
  const [loading, setLoading] = useState(true);

  const { id } = useParams();

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        setLoading(true);
        const response = await dispatch(
          viewCompanyInstituteProfile({ _id: id, type: "companies" })
        ).unwrap();

        const data = response?.data?.info;
        if (data) {
          setAgencyData({
            name: data?.display_name || data?.name || "N/A",
            description: data?.description || "No description available",
            website: data?.website_url || "",
            logo: data?.logo_url || "",
            banner: data?.banner_image_url || "",
            phone: data?.phone_no || "N/A",
            email: data?.email || "N/A",
            linkedin: data?.linkedin_page_url || "",
            companyType: data?.company_type || "N/A",
            companySize: data?.company_size || "N/A",
            founded: data?.founded_year
              ? new Date(data?.founded_year * 1000).getFullYear().toString()
              : "N/A",
            followers:
              data?.follower_count !== undefined
                ? `${data?.follower_count} Followers`
                : "N/A",
            employees:
              data?.employee_count !== undefined
                ? `${data?.employee_count} Employees`
                : "N/A",
            industry:
              data?.industries?.length > 0
                ? data?.industries.map((i) => i?.name).join(", ")
                : "N/A",
            specialties:
              data?.specialties?.length > 0 ? data?.specialties : ["N/A"],
            isVerified: data?.is_verified || false,
            country:
              data?.country_code?.name ||
              data?.country_code?.short_name ||
              "N/A",
          });
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCompanyDetails();
  }, [id, dispatch]);

  // 🔹 Header Component
  const Header = () => (
    <div className="max-w-5xl mx-auto glassy-card rounded-2xl shadow-md overflow-hidden">
      {/* Banner */}
      <div className="relative h-52 glassy-card">
        <img
          src={
            agencyData?.banner ||
            "https://via.placeholder.com/1200x300?text=Company+Banner"
          }
          alt="Company Banner"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src =
              "https://via.placeholder.com/1200x300?text=Company+Banner";
          }}
        />

        {/* Logo */}
        <div className="absolute -bottom-14 left-6">
          <div className="w-28 h-28 rounded-full border-4 border-white shadow-lg glassy-card overflow-hidden">
            <img
              src={
                agencyData?.logo ||
                "https://via.placeholder.com/150?text=No+Logo"
              }
              alt="Company Logo"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.src =
                  "https://via.placeholder.com/150?text=No+Logo";
              }}
            />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="pt-16 pb-6 px-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold glassy-text-primary">
              {agencyData?.name}
            </h1>
            <p className="glassy-text-secondary text-sm mt-1">
              {agencyData?.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-3 text-sm glassy-text-secondary">
              {agencyData?.industry && <span>{agencyData?.industry}</span>}
              {agencyData?.founded !== "N/A" && (
                <>
                  <span>•</span>
                  <span>Founded {agencyData?.founded}</span>
                </>
              )}
              {agencyData?.followers && (
                <>
                  <span>•</span>
                  <span>{agencyData?.followers}</span>
                </>
              )}
            </div>
          </div>

          {agencyData?.isVerified && (
            <div className="flex items-center text-green-600 glassy-card px-2 py-1 rounded-md text-sm font-medium shadow-sm">
              <CheckCircle size={16} className="mr-1" />
              Verified Company
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // // 🔹 Navigation Tabs
  // const Navigation = () => (
  //   <div className="mt-6 border-b border-gray-200">
  //     <nav className="flex">
  //       {["Home", "About"].map((tab) => (
  //         <button
  //           key={tab}
  //           onClick={() => setActiveTab(tab)}
  //           className={`py-3 px-6 text-sm font-medium transition-all ${
  //             activeTab === tab
  //               ? "text-blue-600 border-b-2 border-blue-600"
  //               : "glassy-text-secondary hover:text-blue-600"
  //           }`}
  //         >
  //           {tab}
  //         </button>
  //       ))}
  //     </nav>
  //   </div>
  // );

  // 🔹 Home Tab Content
  const HomeTab = () => (
    <div className="mt-6 space-y-8">
      {/* Overview */}
      <div>
        <h2 className="text-lg font-semibold glassy-text-primary mb-2">Overview</h2>
        <p className="glassy-text-primary text-sm leading-relaxed">
          {agencyData?.description}
        </p>
      </div>

      {/* Info Grid */}
      <div className="grid md:grid-cols-2 gap-8 text-sm">
        <div className="space-y-4">
          {agencyData?.website && (
            <div className="flex items-center gap-2 text-blue-600 break-all">
              <Globe size={16} className="glassy-text-secondary" />
              <a
                href={agencyData?.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                {agencyData?.website}
              </a>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Phone size={16} className="glassy-text-secondary" />
            <span>{agencyData?.phone}</span>
          </div>

          <div className="flex items-center gap-2">
            <Mail size={16} className="glassy-text-secondary" />
            <span>{agencyData?.email}</span>
          </div>

          {agencyData?.linkedin && (
            <div className="flex items-center gap-2">
              <Linkedin size={16} className="glassy-text-secondary" />
              <a
                href={agencyData?.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600"
              >
                LinkedIn Profile
              </a>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Building size={16} className="glassy-text-secondary" />
            <span>{agencyData?.industry}</span>
          </div>

          <div className="flex items-center gap-2">
            <Users size={16} className="glassy-text-secondary" />
            <span>{agencyData?.companySize}</span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar size={16} className="glassy-text-secondary" />
            <span>Founded {agencyData?.founded}</span>
          </div>
        </div>
      </div>

      {/* Specialties */}
      <div>
        <h3 className="text-sm font-medium glassy-text-primary mb-2">Specialties</h3>
        <div className="flex flex-wrap gap-2">
          {agencyData?.specialties?.map((s, i) => (
            <span
              key={i}
              className="px-3 py-1 glassy-card glassy-text-primary rounded-full text-xs border border-gray-200"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="glassy-card min-h-screen py-8">
      {loading ? (
        <div className="text-center py-20 glassy-text-secondary">Loading...</div>
      ) : (
        <div className="max-w-5xl mx-auto space-y-6">
          <Header />
          <div className="glassy-card p-6 rounded-2xl shadow-md border border-gray-100">
            <HomeTab /> 
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyDetails;
