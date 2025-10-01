import React, { useCallback, useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Mail, MapPin, Shield } from "lucide-react";
import PeopleToConnect from "../../../components/ui/ConnectSidebar/ConnectSidebar";
import { useDispatch, useSelector } from "react-redux";
import { suggestedUser } from "../../../redux/Users/userSlice";
import { verificationCenterList } from "../../../redux/CompanySlices/courseSlice";
import { Link } from "react-router-dom";
import { BiSearch } from "react-icons/bi";

const AdminRoles = ({
  companiesProfileData,
  searchAppearances = 57,
  searchAppearancesChange = 32.6,
  newFollowers = 200,
  newFollowersChange = -32.6,
  postImpressions = 344,
  postImpressionsChange = 113.7,
  pageVisitors = 7,
  actions = [],
}) => {
  const defaultActions = [
    {
      id: 1,
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      title: "New verify request from Asif Ali",
      description: "Your verification request is pending approval.",
      buttonText: "Verify Now",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
    },
    {
      id: 2,
      icon: Mail,
      iconColor: "bg-blue-50 text-blue-600",
      title: "Confirm your email",
      description: "Verify your email to unlock all features.",
      buttonText: "Verify Email",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
    },
    {
      id: 3,
      icon: MapPin,
      iconColor: "bg-red-50 text-red-600",
      title: "Update your location",
      description: "Add your company location to improve visibility.",
      buttonText: "Update Now",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
    },
    {
      id: 4,
      icon: Shield,
      iconColor: "bg-yellow-50 text-yellow-600",
      title: "Secure your account",
      description: "Enable 2FA for better account security.",
      buttonText: "Enable 2FA",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
    },
  ];

  const ActionCard = ({ action }) => {
    return (
      <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            <div className="flex-shrink-0">
              <img
                src={
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                }
                alt="User avatar"
                className="w-12 h-12 rounded-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">
                {action?.user_id?.first_name} {action?.user_id?.last_name}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {"Your verification request is pending approval."}
              </p>
            </div>
          </div>
          <button
            className={`bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors ml-4 flex-shrink-0 ${action.buttonColor}`}
          >
            <Link>Remove</Link>
          </button>
        </div>
      </div>
    );
  };
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("user");
  const [searchKeyword, setSearchKeyword] = useState("");

  const actionsToShow = defaultActions;
  const userSelector = useSelector((state) => state.user);
  const { suggestedUserData: { data: suggestedUsers } = {} } =
    userSelector || {};
  useEffect(() => {
    dispatch(suggestedUser({ page: 1, size: 10, type: activeTab }));
  }, [dispatch, activeTab]);
  return (
    <div className="bg-[#F6FAFD] p-6 min-h-screen">
      <div className="flex flex-col md:flex-row w-full mx-auto gap-6">
        {/* Left Section */}
        <div className="xl:w-[75%] lg:w-[70%] md:w-[60%] w-full space-y-6">
          {/* Header */}

          {/* Actions Section */}
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Admin Roles
            </h2>
            <p className="text-gray-600 mb-6">
              you can add only which members who work in company.
            </p>
            <div className="relative flex mb-5 mt-3">
              <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                className={`bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors ml-4 flex-shrink-0 `}
              >
                <Link>Add Admin</Link>
              </button>
            </div>
            <div className="space-y-4">
              {actionsToShow &&
                actionsToShow?.map((action) => (
                  <ActionCard key={action.id} action={action} />
                ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="xl:w-[25%] lg:w-[30%] md:w-[40%] hidden md:block">
          <div className="sticky top-6 h-fit max-h-[calc(100vh-2rem)] overflow-y-auto hide-scrollbar">
            <PeopleToConnect
              data={suggestedUsers?.data?.list || []}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRoles;
