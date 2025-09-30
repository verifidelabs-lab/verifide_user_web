import React, { useEffect, useState } from "react";
import {
  Edit,
  Globe,
  Phone,
  Mail,
  Users,
  Calendar,
  MapPin,
  Building,
  Award,
  Camera,
  Save,
  X,
  CheckCircle,
} from "lucide-react";
import { getPostList } from "../../../redux/CompanySlices/companiesSlice";
import { FaRegEdit } from "react-icons/fa";
import PeopleToConnect from "../../../components/ui/ConnectSidebar/ConnectSidebar";

import { useDispatch, useSelector } from "react-redux";
import { suggestedUser } from "../../../redux/Users/userSlice";
import { companiesProfile } from "../../../redux/CompanySlices/CompanyAuth";
import { Link } from "react-router-dom";
import { MoreVertical } from "lucide-react";
import { Bookmark, Plus } from "lucide-react";
import { FaRegCommentDots, FaRegShareSquare } from "react-icons/fa";
import { AiOutlineLike, AiOutlineEye } from "react-icons/ai";
import { jobsList } from "../../../redux/Global Slice/cscSlice";

const CompanyProfile = () => {
  const [activeTab, setActiveTab] = useState("Home");
  const [editMode, setEditMode] = useState({});
  const [agencyData, setAgencyData] = useState({});

  const [activeTab1, setActiveTab1] = useState("user");
  const dispatch = useDispatch();
  const userSelector = useSelector((state) => state.user);
  const { suggestedUserData: { data: suggestedUsers } = {} } =
    userSelector || {};

  useEffect(() => {
    dispatch(suggestedUser({ page: 1, size: 10, type: activeTab1 }));
  }, [dispatch, activeTab1]);

  // const [posts, setPosts] = useState([
  //   {
  //     id: 1,
  //     title: "The Future of UX Design",
  //     content:
  //       "Exploring emerging trends in user experience design and how they shape digital experiences...",
  //     date: "2025-09-20",
  //     author: "Musemind Team",
  //   },
  //   {
  //     id: 2,
  //     title: "Building Digital Products That Scale",
  //     content:
  //       "Our comprehensive approach to creating scalable digital solutions for modern businesses...",
  //     date: "2025-09-18",
  //     author: "Design Team",
  //   },
  // ]);

  // const { getPostListData: { data: posts = [] } = {}, loading } = useSelector(
  //   (state) => state.companies
  // );

  const { getPostListData: { data: posts = [] } = {}, loading } = useSelector(
    (state) => state.companies
  );

  useEffect(() => {
    dispatch(getPostList({ page: 1, size: 2 ,type:"all"}))
      .unwrap()
      .then((res) => {
        console.log("✅ API posts response:", res); // full response
      })
      .catch((err) => console.error("❌ Error fetching posts:", err));
  }, [dispatch]);
  console.log("this is the post list data", posts);

  const { jobsListData: { data: jobs = [] } = {} } = useSelector(
    (state) => state.global
  );
  console.log("this is the jsss", jobs);
  useEffect(() => {
    const fetchJobs = async () => {
      // ✅ Only send page & size, no extra filters
      const apiPayload = {
        page: 1,
        size: 4,
        query: JSON.stringify({ type: "open" }),
      };

      try {
        const res = await dispatch(jobsList(apiPayload)).unwrap();
        console.log("✅ Jobs API response:", res);

        // If API returns jobs in `data.list`, adjust this
      } catch (err) {
        console.error("❌ Error fetching jobs:", err);
      } finally {
      }
    };

    fetchJobs();
  }, [dispatch]);

  const [people, setPeople] = useState([
    {
      id: 1,
      name: "John Smith",
      position: "Creative Director",
      bio: "Leading creative vision with 10+ years of experience in digital design and user experience.",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      position: "UX Research Lead",
      bio: "Passionate about user research and data-driven design decisions that create meaningful experiences.",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b332c46c?w=400&h=400&fit=crop&crop=face",
    },
  ]);

  const updateAgencyData = (field, value) => {
    setAgencyData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const EditableField = ({
    value,
    onSave,
    field,
    multiline = false,
    placeholder = "Enter text...",
    type = "text",
    className = "",
  }) => {
    const [tempValue, setTempValue] = useState(value);
    const [editing, setEditing] = useState(false);

    const handleSave = () => {
      onSave(field, tempValue);
      setEditing(false);
    };

    const handleCancel = () => {
      setTempValue(value);
      setEditing(false);
    };

    if (editing) {
      return (
        <div className="space-y-3">
          {multiline ? (
            <textarea
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="w-full p-3 bg-white border border-gray-300 text-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={multiline === true ? 4 : multiline}
              placeholder={placeholder}
            />
          ) : (
            <input
              type={type}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="w-full p-3 bg-white border border-gray-300 text-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={placeholder}
            />
          )}
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2 transition-colors"
            >
              <Save size={16} />
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 flex items-center gap-2 transition-colors"
            >
              <X size={16} />
              Cancel
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className={`group relative ${className}`}>
        <div className={multiline ? "whitespace-pre-wrap" : ""}>{value}</div>
        {/* <button
          onClick={() => setEditing(true)}
          className="absolute -right-8 top-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-400 hover:text-blue-400"
        >
          <Edit size={16} />
        </button> */}
      </div>
    );
  };
  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        const res = await dispatch(companiesProfile()).unwrap();
        const data = res?.data;

        if (data) {
          console.log("This is companyData: " + JSON.stringify(data, null, 2));

          setAgencyData({
            name: data?.display_name || data?.name || "N/A",
            tagline: "", // no tagline in API, keep empty or default
            overview: data?.description || "N/A",
            description: data?.description || "N/A",
            workDescription: "", // no workDescription in API
            website: data?.website_url || "N/A",
            phone: data?.phone_no || "N/A",
            industry:
              data?.industry?.length > 0
                ? data.industry.map((i) => i?.name || "N/A").join(" , ")
                : "N/A",
            founded: data?.founded_year
              ? new Date(data.founded_year * 1000).getFullYear().toString()
              : "N/A",
            companySize: data?.company_size || "N/A",
            companyType: data?.company_type || "N/A",
            headquarters: {
              address_line_1: data?.headquarters?.address_line_1 || "N/A",
              address_line_2: data?.headquarters?.address_line_2 || "N/A",
              country_name: data?.headquarters?.country?.name || "N/A",
              state_name: data?.headquarters?.state?.name || "N/A",
              city_name: data?.headquarters?.city?.name || "N/A",
              pin_code: data?.headquarters?.pin_code || "N/A",
            },
            verifiedSince: data?.verified_at
              ? new Date(data.verified_at).toLocaleDateString()
              : "N/A",
            followers:
              data?.follower_count !== undefined
                ? `${data.follower_count} Followers`
                : "N/A",
            employees:
              data?.employee_count !== undefined
                ? `${data.employee_count} Employees`
                : "N/A",
            specialties:
              data?.specialties?.length > 0 ? data.specialties : ["N/A"],
            logo: data?.logo_url || "",
            banner_image_url: data?.banner_image_url || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch company profile:", error);
      }
    };

    fetchCompanyProfile();
  }, [dispatch]);
  // Header
  const Header = () => (
    <div className="max-w-6xl mx-auto">
      {/* Top Banner with gradient and partner logos */}
      <div className="relative bg-gradient-to-r from-yellow-100 via-orange-50 to-pink-100 rounded-t-2xl px-6 py-8 overflow-hidden">
        <div className="flex items-center justify-center mb-4">
          <div className="inline-flex items-center gap-2">
            <div className="bg-yellow-300 px-4 py-1 rounded-full">
              <span className="text-gray-900 font-semibold text-sm">
                {/* Next-Gen */}
                {agencyData?.name}{" "}
              </span>
            </div>
            <span className="text-gray-800 font-medium text-sm">
              Experience Makers.
            </span>
          </div>
        </div>

        {/* Partner Logos */}
        <div className="flex items-center justify-center gap-8 mb-2">
          <span className="text-gray-500 text-xs font-semibold">VISA</span>
          <span className="text-gray-500 text-xs">fintech</span>
          <span className="text-gray-500 text-xs">tamara</span>
          <span className="text-gray-500 text-xs">panther</span>
          <span className="text-gray-500 text-xs">Qumra</span>
        </div>

        {/* Decorative text */}
        <div className="absolute bottom-2 right-4 text-xs text-gray-400">
          {/* #YourBrandLogos */}
          {agencyData?.name}
        </div>

        {/* Decorative wavy lines */}
        <svg
          className="absolute bottom-4 right-12 w-40 h-12 pointer-events-none opacity-70"
          viewBox="0 0 160 48"
        >
          <path
            d="M0,24 Q20,12 40,24 T80,24"
            stroke="#FF6B6B"
            strokeWidth="2.5"
            fill="none"
          />
          <path
            d="M0,32 Q20,20 40,32 T80,32"
            stroke="#FFA500"
            strokeWidth="2.5"
            fill="none"
          />
          <path
            d="M20,16 Q40,4 60,16 T100,16"
            stroke="#4ADE80"
            strokeWidth="2.5"
            fill="none"
          />
        </svg>
      </div>

      <div className="bg-white rounded-b-2xl shadow-2xl">
        <div className="p-6">
          {/* Row 1: Logo + Buttons */}
          <div className="flex items-start justify-between gap-2">
            {/* Logo - overlapping the banner */}
            {/* <div className="relative -mt-16 flex-shrink-0">
              <div className="w-24 h-24 bg-black rounded-xl flex items-center justify-center shadow-2xl border-4 border-zinc-800">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <path
                    d="M12 40V8L24 24L36 8V40L24 24L12 40Z"
                    fill="#FFD700"
                  />
                </svg>
              </div>
            </div> */}
            <div className="relative -mt-12 flex-shrink-0">
              <div className="w-24 h-24 rounded-full flex items-center justify-center shadow-2xl border-4 border-zinc-800 bg-black overflow-hidden">
                {agencyData?.logo ? (
                  <img
                    src={agencyData?.logo}
                    alt="Company Logo"
                    className="w-full h-full object-contain rounded-full"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/companylogo.png"; // fallback image
                    }}
                  />
                ) : null}
              </div>
            </div>

            {/* Buttons */}
            {/* <div className="flex items-start gap-2 pt-2"> */}
            {/* <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                <FaRegEdit />
                <Link to={"/company/update-profile"}>Edit</Link>
              </button> */}
            <button className="flex items-center gap-2 px-4 py-2  text-white rounded ">
              <Link
                to="/company/update-profile"
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 text-white font-medium hover:from-blue-700 hover:to-blue-500 transition-all shadow-md"
              >
                Edit Page
              </Link>
            </button>
            {/* </div> */}
          </div>

          {/* Row 2: Company Details */}
          <div className="mt-1">
            <h1 className="font-bold text-gray-600 mb-2">{agencyData?.name}</h1>
            <p className="text-gray-600 text-sm mb-3 leading-relaxed">
              {agencyData?.description}
            </p>
            <div className="flex items-center gap-3 text-xs text-gray-700">
              <span>{agencyData?.industry}</span>
              <span>•</span>
              <span>{agencyData?.founded}</span>
              <span>•</span>
              <span>{agencyData?.followers}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  //   (
  //   <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
  //     <div className="flex items-center justify-between">
  //       <div className="flex items-center gap-4">
  //         <div className="relative group">
  //           <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
  //             <div className="text-black text-2xl font-bold transform -skew-x-12">M</div>
  //           </div>
  //           <button className="absolute inset-0 bg-black bg-opacity-20 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
  //             <Camera className="text-white" size={20} />
  //           </button>
  //         </div>

  //         <div>
  //           <h1 className="text-xl font-semibold mb-1">
  //             <EditableField
  //               value={agencyData?.name}
  //               onSave={updateAgencyData}
  //               field="name"
  //               placeholder="Enter agency name"
  //               className="text-gray-900"
  //             />
  //           </h1>
  //           <p className="text-gray-500 text-sm max-w-xl leading-relaxed">
  //             <EditableField
  //               value={agencyData?.tagline}
  //               onSave={updateAgencyData}
  //               field="tagline"
  //               multiline={2}
  //               placeholder="Enter tagline"
  //               className="text-gray-500"
  //             />
  //           </p>
  //           <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
  //             <span>{agencyData?.industry}</span>
  //             <span>•</span>
  //             <span>{agencyData?.founded}</span>
  //             <span>•</span>
  //             <span>{agencyData?.followers}</span>
  //           </div>
  //         </div>
  //       </div>

  //       <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors" >
  //         <Link to={"/company/update-profile"} >
  //           Edit Page
  //         </Link>
  //       </button>
  //     </div>
  //   </div>
  // );

  // Navigation
  const Navigation = () => (
    <div className="mt-6">
      <nav className="flex border-b border-gray-200">
        {["Home", "About", "Posts", "Jobs", "People"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-blue-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>
    </div>
  );

  // ---- TABS ----
  // const HomeTab = () => (
  //   <div className="mt-6 space-y-8">
  //     <div className="space-y-4">
  //       <h2 className="text-xl font-medium text-gray-900 flex items-center gap-2">
  //         Overview <Edit className="text-gray-400" size={16} />
  //       </h2>
  //       <div className="text-gray-600 space-y-2">
  //         <EditableField
  //           value={agencyData?.overview}
  //           onSave={updateAgencyData}
  //           field="overview"
  //           multiline={2}
  //         />
  //         {/* <EditableField
  //           value={agencyData?.description}
  //           onSave={updateAgencyData}
  //           field="description"
  //           multiline={4}
  //         /> */}
  //         <EditableField
  //           value={agencyData?.workDescription}
  //           onSave={updateAgencyData}
  //           field="workDescription"
  //           multiline={4}
  //         />
  //       </div>
  //     </div>

  //     <div className="grid lg:grid-cols-3 gap-8">
  //       <div className="lg:col-span-2 grid md:grid-cols-2 gap-6 text-sm">
  //         <div className="space-y-4">
  //           <div className="flex items-start gap-3">
  //             <Globe className="text-gray-400 mt-1" size={16} />
  //             <div>
  //               <div className="text-gray-400 text-xs mb-1">Website</div>
  //               <EditableField
  //                 value={agencyData?.website}
  //                 onSave={updateAgencyData}
  //                 field="website"
  //                 type="url"
  //                 className="text-blue-600"
  //               />
  //             </div>
  //           </div>

  //           <div className="flex items-start gap-3">
  //             <Phone className="text-gray-400 mt-1" size={16} />
  //             <div>
  //               <div className="text-gray-400 text-xs mb-1">Phone</div>
  //               <EditableField
  //                 value={agencyData?.phone}
  //                 onSave={updateAgencyData}
  //                 field="phone"
  //                 type="tel"
  //               />
  //             </div>
  //           </div>

  //           <div className="flex items-start gap-3">
  //             <CheckCircle className="text-green-400 mt-1" size={16} />
  //             <div>
  //               <div className="text-gray-400 text-xs mb-1">Verified since</div>
  //               <EditableField
  //                 value={agencyData?.verifiedSince}
  //                 onSave={updateAgencyData}
  //                 field="verifiedSince"
  //               />
  //             </div>
  //           </div>
  //         </div>

  //         <div className="space-y-4">
  //           <div className="flex items-start gap-3">
  //             <Building className="text-gray-400 mt-1" size={16} />
  //             <div>
  //               <div className="text-gray-400 text-xs mb-1">Industry</div>
  //               <EditableField
  //                 value={agencyData?.industry}
  //                 onSave={updateAgencyData}
  //                 field="industry"
  //               />
  //             </div>
  //           </div>

  //           <div className="flex items-start gap-3">
  //             <Users className="text-gray-400 mt-1" size={16} />
  //             <div>
  //               <div className="text-gray-400 text-xs mb-1">Company size</div>
  //               <EditableField
  //                 value={agencyData?.companySize}
  //                 onSave={updateAgencyData}
  //                 field="companySize"
  //               />
  //             </div>
  //           </div>

  //           <div className="flex items-start gap-3">
  //             <Calendar className="text-gray-400 mt-1" size={16} />
  //             <div>
  //               <div className="text-gray-400 text-xs mb-1">Founded</div>
  //               <EditableField
  //                 value={agencyData?.founded}
  //                 onSave={updateAgencyData}
  //                 field="founded"
  //               />
  //             </div>
  //           </div>
  //         </div>
  //       </div>

  //       <div>
  //         <h3 className="text-sm font-medium text-gray-900 mb-2">
  //           Specialties
  //         </h3>
  //         <div className="flex flex-wrap gap-2">
  //           {agencyData?.specialties?.map((s, i) => (
  //             <span
  //               key={i}
  //               className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs border border-gray-200"
  //             >
  //               {s}
  //             </span>
  //           ))}
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
  const HomeTab = () => (
    <div className="mt-6 space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-medium text-gray-900 flex items-center gap-2">
          Overview
          <Link
            to="/company/update-profile"
            className="flex items-center text-gray-400 hover:text-gray-600"
          >
            <Edit size={16} />
          </Link>
        </h2>

        <div className="text-gray-600 space-y-2">
          <EditableField
            value={agencyData?.overview}
            onSave={updateAgencyData}
            field="overview"
            multiline={2}
          />
          <EditableField
            value={agencyData?.workDescription}
            onSave={updateAgencyData}
            field="workDescription"
            multiline={4}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 text-sm">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Globe className="text-gray-400 mt-1" size={16} />
              <div>
                <div className="text-gray-400 text-xs mb-1">Website</div>
                <EditableField
                  value={agencyData?.website}
                  onSave={updateAgencyData}
                  field="website"
                  type="url"
                  className="text-blue-600"
                />
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="text-gray-400 mt-1" size={16} />
              <div>
                <div className="text-gray-400 text-xs mb-1">Phone</div>
                <EditableField
                  value={agencyData?.phone}
                  onSave={updateAgencyData}
                  field="phone"
                  type="tel"
                />
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="text-green-400 mt-1" size={16} />
              <div>
                <div className="text-gray-400 text-xs mb-1">Verified since</div>
                <EditableField
                  value={agencyData?.verifiedSince}
                  onSave={updateAgencyData}
                  field="verifiedSince"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Building className="text-gray-400 mt-1" size={16} />
              <div>
                <div className="text-gray-400 text-xs mb-1">Industry</div>
                <EditableField
                  value={agencyData?.industry}
                  onSave={updateAgencyData}
                  field="industry"
                  className="capitalize"
                />
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="text-gray-400 mt-1" size={16} />
              <div>
                <div className="text-gray-400 text-xs mb-1">Company size</div>
                <EditableField
                  value={agencyData?.companySize}
                  onSave={updateAgencyData}
                  field="companySize"
                />
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="text-gray-400 mt-1" size={16} />
              <div>
                <div className="text-gray-400 text-xs mb-1">Founded</div>
                <EditableField
                  value={agencyData?.founded}
                  onSave={updateAgencyData}
                  field="founded"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Specialties in a new row spanning full width, minimal margin */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-2">Specialties</h3>
        <div className="flex flex-wrap gap-2">
          {agencyData?.specialties?.map((s, i) => (
            <span
              key={i}
              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs border border-gray-200"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const AboutTab = () => (
    <div className="mt-6 space-y-6 text-gray-700">
      <h2 className="text-2xl font-bold text-gray-900">
        About {agencyData?.name}
      </h2>
      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-900"></h3>
        <EditableField
          value={agencyData?.description}
          onSave={updateAgencyData}
          field="mission"
          multiline={3}
        />
      </div>
      <div className="text-sm grid grid-cols-1 md:grid-cols-2 gap-y-2">
        <div className="flex gap-1">
          <div className="font-semibold">Industry:</div>
          <div className="capitalize">{agencyData?.industry}</div>
        </div>

        <div className="flex gap-1">
          <div className="font-semibold">Headquarters:</div>
          <div>
            {agencyData?.headquarters?.address_line_1},{" "}
            {agencyData?.headquarters?.state_name},{" "}
            {agencyData?.headquarters?.city_name}
            {agencyData?.headquarters?.country_name}
          </div>
        </div>
        <div className="text-gray-600 col-span-2">
          {agencyData?.company_type && `${agencyData?.company_type} • `}
          {agencyData?.founded_year &&
            `Founded ${new Date(
              agencyData?.founded_year * 1000
            ).getFullYear()}`}
        </div>
        {Array.isArray(agencyData?.specialties) &&
          agencyData?.specialties.length > 0 && (
            <div className="flex gap-1 col-span-2">
              <div className="font-semibold">Specialties:</div>
              <div>{agencyData?.specialties.join(", ")}</div>
            </div>
          )}
      </div>
      {/* <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-900">Our Vision</h3>
        <EditableField
          value="To be the leading global UX design agency that creates meaningful digital products for the future."
          onSave={updateAgencyData}
          field="vision"
          multiline={3}
        />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-900">
          Global Presence
        </h3>
        <p>
          With offices in Dubai, Berlin, Riyadh, Dhaka, London, and New York, we
          bring diverse perspectives to every project.
        </p>
      </div> */}
    </div>
  );

  // PostsTab, JobsTab, PeopleTab code is similar to your original but with white theme and gray tones
  // For brevity, I can provide all of them if you want, fully styled in the white theme.
  // -------------------- POSTS TAB --------------------
  // const PostsTab = ({ posts }) => {
  //   return (
  //     <div className="bg-white text-black min-h-screen">
  //       <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
  //         <div className="flex justify-between items-center">
  //           <h2 className="text-2xl font-bold">Posts</h2>
  //           <button
  //             // onClick={() => setShowAddForm(!showAddForm)}
  //             className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
  //           >
  //             <Link to="/company/create-post">Create Post</Link>
  //           </button>
  //         </div>

  //         {posts.map((post) => (
  //           <div
  //             key={post?.id}
  //             className="bg-white-800 rounded-lg p-6 border border-gray-700"
  //           >
  //             <h3 className="text-xl font-semibold mb-2">{post?.title}</h3>
  //             <p className="text-gray-400 text-sm mb-3">
  //               By {post?.author} • {new Date(post?.date).toLocaleDateString()}
  //             </p>
  //             <p className="text-gray-300">{post?.content}</p>
  //           </div>
  //         ))}
  //       </div>
  //     </div>
  //   );
  // };

  // const PostsTab = ({ posts }) => {
  //   return (
  //     <div className="bg-white min-h-screen py-8 px-4">
  //       <div className="max-w-6xl mx-auto">
  //         <div className="flex justify-between items-center mb-7">
  //           <h2 className="text-2xl font-bold text-gray-900">Page posts</h2>
  //           <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
  //             <Link to="/company/create-post">Create Post</Link>
  //           </button>
  //         </div>
  //         <div className="grid md:grid-cols-2 gap-8">
  //           {posts?.map((post) => (
  //             <div
  //               key={post?.id}
  //               className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 flex flex-col gap-4"
  //             >
  //               {/* Header row: logo, title, meta */}
  //               <div className="flex items-center gap-3 mb-2">
  //                 <img
  //                   src={
  //                     post?.logoUrl ||
  //                     "https://upload.wikimedia.org/wikipedia/commons/8/89/HD_transparent_picture.png"
  //                   }
  //                   alt={post?.author || "Logo"}
  //                   className="w-12 h-12 rounded-full object-cover border border-gray-200"
  //                 />
  //                 <div>
  //                   <h3 className="text-lg font-bold text-gray-900 leading-tight">
  //                     {post?.companyName || "Company Name"}
  //                   </h3>
  //                   <div className="text-gray-500 text-xs">
  //                     {post?.followers ? `${post?.followers} followers` : ""}
  //                     {post?.date ? ` • ${post?.date}` : ""}
  //                   </div>
  //                 </div>
  //                 <div className="ml-auto text-gray-400 hover:text-gray-700 cursor-pointer">
  //                   <span className="text-sm">•••</span>
  //                 </div>
  //               </div>

  //               {/* Post text/content */}
  //               <div>
  //                 <p className="text-gray-700 text-base">
  //                   {post?.content}
  //                   {/* Optionally add 'See More' link for long content */}
  //                   {/* <Link className="text-blue-500 ml-2" to={`/post/${post?.id}`}>See More</Link> */}
  //                 </p>
  //               </div>

  //               {/* Media/Image: Example */}
  //               {post?.image_urls && (
  //                 <div className="w-full rounded-lg overflow-hidden mt-2">
  //                   <img
  //                     src={post?.image_urls[0]}
  //                     alt="Post Banner"
  //                     className="w-full h-auto object-cover"
  //                   />
  //                 </div>
  //               )}

  //               {/* Stats row */}
  //               <div className="flex items-center gap-4 mt-3 text-gray-600 text-sm">
  //                 {/* <div className="flex items-center gap-1">
  //                   <AiOutlineLike />
  //                   <span>{post?.likes || "3.5k"}</span>
  //                 </div>
  //                 <div className="flex items-center gap-1">
  //                   <AiOutlineEye />
  //                   <span>{post?.views || "15k"}</span>
  //                 </div> */}
  //                 <div className="flex items-center gap-1">
  //                   <FaRegCommentDots />
  //                   <span>{post?.share_count || "10"}</span>
  //                 </div>
  //                 <div className="flex items-center gap-1">
  //                   <FaRegShareSquare />
  //                   <span>Share</span>
  //                 </div>
  //               </div>
  //             </div>
  //           ))}
  //         </div>
  //         <div className="text-center mt-8">
  //           <button className="px-5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium">
  //             <Link
  //               to="/company/posts-manage"
  //               // className="w-10 h-10 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center transition-colors shadow-sm"
  //             >
  //               Show All Post
  //             </Link>
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };
  const PostsTab = ({ posts }) => {
    return (
      <div className="bg-white min-h-screen py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-7">
            <h2 className="text-2xl font-bold text-gray-900">Page posts</h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              <Link to="/company/create-post">Create Post</Link>
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {posts?.map((post) => (
              <div
                key={post?._id}
                className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 flex flex-col gap-4"
              >
                {/* Header row: company/user info */}
                <div className="flex items-center gap-3 mb-2">
                  {/* <img
                    src={
                      post?.logoUrl ||
                      "https://upload.wikimedia.org/wikipedia/commons/8/89/HD_transparent_picture.png"
                    }
                    alt={post?.companyName || post?.user_id || "Logo"}
                    
                  /> */}
                  {agencyData?.logo ? (
                    <img
                      src={agencyData?.logo}
                      alt="Company Logo"
                      className="w-12 h-12 rounded-full object-cover border border-gray-200"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/companylogo.png"; // fallback image
                      }}
                    />
                  ) : null}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 leading-tight">
                      {agencyData?.name}
                    </h3>
                    <div className="text-gray-500 text-xs">
                      {agencyData?.followers
                        ? `${agencyData?.followers} followers`
                        : ""}
                      {post?.date
                        ? ` • ${new Date(post?.date).toLocaleDateString()}`
                        : ""}
                    </div>
                  </div>
                  <div className="ml-auto text-gray-400 hover:text-gray-700 cursor-pointer">
                    <span className="text-sm">•••</span>
                  </div>
                </div>

                {/* Post content */}
                <div>
                  <h3 className="text-gray-700 text-base">{post?.title}</h3>
                  <p className="text-gray-700 text-base">{post?.content}</p>
                </div>

                {/* Media: image or video */}
                {post?.post_type === "image-video" &&
                  post?.image_urls?.length > 0 && (
                    <div className="w-full rounded-lg overflow-hidden mt-2">
                      <img
                        src={post?.image_urls[0]}
                        alt="Post Media"
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  )}
                {post?.post_type === "image-video" && post?.video_url && (
                  <div className="w-full mt-2">
                    <video controls className="w-full rounded-lg">
                      <source src={post?.video_url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}

                {/* Stats row */}
                <div className="flex items-center gap-4 mt-3 text-gray-600 text-sm">
                  <div className="flex items-center gap-1">
                    <AiOutlineLike />
                    <span>{post?.like_count || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <AiOutlineEye />
                    <span>{post?.view_count || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaRegCommentDots />
                    <span>{post?.report_count || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaRegShareSquare />
                    <span>{post?.share_count || 0}</span>
                  </div>
                </div>

                {/* Tags */}
                {post?.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {post?.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-gray-100 rounded-lg text-xs text-gray-600"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button className="px-5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium">
              <Link to="/company/posts-manage">Show All Post</Link>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const JobsTab = ({ jobs }) => {
    console.log("this is the jobs", jobs);
    return (
      <div className="bg-gray-50 min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Opening Jobs</h1>
            <button className="w-10 h-10 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center transition-colors shadow-sm">
              <Link
                to="/company/post-job"
                className="w-10 h-10 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center transition-colors shadow-sm"
              >
                <Plus size={24} className="text-gray-700" />
              </Link>
            </button>
          </div>

          {/* Job Cards */}
          <div className="space-y-4">
            {jobs?.length > 0 &&
              jobs?.map((job) => (
                <div
                  key={job?._id}
                  className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-gray-300 transition-colors shadow-sm"
                >
                  {/* Header with logo, title, and status */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex gap-4">
                      {/* Company Logo */}
                      <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                        {agencyData?.logo ? (
                          <img
                            src={agencyData?.logo}
                            alt="Company Logo"
                            className="w-12 h-12 rounded-full object-cover border border-gray-200"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = "/companylogo.png"; // fallback image
                            }}
                          />
                        ) : null}
                      </div>

                      {/* Job Title and Company */}
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-1">
                          {job?.job_title?.name}
                        </h2>
                        <p className="text-gray-600 text-sm">
                          {agencyData?.name}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge and Bookmark */}
                    <div className="flex items-center gap-3">
                      {/* <span
                        className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                          job?.status === "Shortlisted"
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : "bg-red-500/20 text-red-400 border border-red-500/30"
                        }`}
                      >
                        {job?.status}
                      </span> */}
                      <button className="text-gray-400 hover:text-gray-700 transition-colors">
                        <Bookmark size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Job Meta Info */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span>{job?.createdAt}</span>
                    <span>-</span>
                    <span>{job?.job_type}</span>
                    <span>-</span>
                    <span>{job?.total_applicants} Applied</span>
                    <span>-</span>
                    <span>{job?.salary_range}</span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">
                    {job?.job_description}
                  </p>

                  {/* Location and Matching */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <MapPin size={16} className="flex-shrink-0" />
                    <span>
                      {job?.job_location} ,{job?.work_location?.city?.name}{" "}
                      {job?.work_location?.state?.name}{" "}
                      {job?.work_location?.country?.name}
                    </span>
                    <span className="text-blue-600 font-medium ml-2">
                      {job?.matching} Matching
                    </span>
                  </div>

                  {/* Skills Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job?.required_skills?.map((skill, index) => (
                      <span
                        key={skill?._id || index}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg border border-gray-200"
                      >
                        {skill?.name}
                      </span>
                    ))}
                  </div>

                  {/* Apply Now Button */}
                  {/* <button className="px-6 py-2.5 bg-transparent border border-blue-500 text-blue-400 rounded-lg hover:bg-blue-500/10 transition-colors font-medium">
                    Apply Now
                  </button> */}
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  };

  const PeopleTab = ({ people, setPeople }) => {
    const [newPerson, setNewPerson] = useState({
      name: "",
      position: "",
      bio: "",
    });
    const [showAddForm, setShowAddForm] = useState(false);

    const addPerson = () => {
      if (newPerson.name && newPerson.position && newPerson.bio) {
        setPeople((prev) => [
          ...prev,
          {
            id: Date.now(),
            ...newPerson,
            avatar:
              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face",
          },
        ]);
        setNewPerson({ name: "", position: "", bio: "" });
        setShowAddForm(false);
      }
    };

    return (
      <div className="bg-white text-black min-h-screen">
        <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Our Team</h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add Team Member
            </button>
          </div>

          {showAddForm && (
            <div className="px-4 py-2 bg-white-600 text-black rounded hover:bg-white-700">
              <h3 className="text-lg font-semibold mb-4">Add Team Member</h3>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Full name"
                    value={newPerson.name}
                    onChange={(e) =>
                      setNewPerson((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="p-3 bg-white-700 border border-gray-600 text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Position"
                    value={newPerson.position}
                    onChange={(e) =>
                      setNewPerson((prev) => ({
                        ...prev,
                        position: e.target.value,
                      }))
                    }
                    className="p-3 bg-white-700 border border-gray-600 text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <textarea
                  placeholder="Bio"
                  value={newPerson.bio}
                  onChange={(e) =>
                    setNewPerson((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  rows={3}
                  className="w-full p-3 bg-white-700 border border-gray-600 text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-2">
                  <button
                    onClick={addPerson}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Add Member
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {people.map((person) => (
              <div
                key={person.id}
                className="bg-white-800 rounded-lg p-6 border border-gray-700 text-center"
              >
                <img
                  src={person.avatar}
                  alt={person.name}
                  className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-lg font-semibold mb-1">{person.name}</h3>
                <p className="text-blue-400 mb-3">{person.position}</p>
                <p className="text-gray-600 text-sm">{person.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "Home":
        return <HomeTab />;
      case "About":
        return <AboutTab />;
      // case 'Posts': return <PostsTab setPosts={setPosts} />;
      case "Posts":
        return <PostsTab posts={posts?.data?.list} />;
      case "Jobs":
        return <JobsTab jobs={jobs?.data?.list} />;
      case "People":
        return <PeopleTab people={people} setPeople={setPeople} />;
      default:
        return <HomeTab />;
    }
  };

  return (
    <div className="bg-gray-50   p-6">
      <div className="flex flex-col md:flex-row gap-6   ">
        <div className="w-full md:w-3/4 space-y-6">
          <Header />
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
            <Navigation />
            {renderActiveTab()}
          </div>
        </div>
        <div className="w-full md:w-1/4 hidden md:block">
          <div className="sticky top-6 max-h-[calc(100vh-2rem)] overflow-y-auto">
            <PeopleToConnect
              data={suggestedUsers?.data?.list || []}
              activeTab={activeTab1}
              setActiveTab={setActiveTab1}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
