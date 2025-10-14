import React, { useCallback, useEffect, useState } from "react";
import { Mail, MapPin, Shield } from "lucide-react";
import PeopleToConnect from "../../../components/ui/ConnectSidebar/ConnectSidebar";
import { useDispatch, useSelector } from "react-redux";
import { BiSearch } from "react-icons/bi";
import { Link } from "react-router-dom";
import debounce from "lodash.debounce";
import { searchUsers } from "../../../redux/Global Slice/cscSlice";
import { suggestedUser } from "../../../redux/Users/userSlice";

const AdminRoles = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("user");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const userSelector = useSelector((state) => state.user);
  const { suggestedUserData: { data: suggestedUsers } = {} } = userSelector || {};

  const globalSelector = useSelector((state) => state.global);
  const { searchUsersData, loading: loadingSearch } = globalSelector || {};
  const searchedUsers = searchUsersData?.data?.data?.list || [];

  const handleSearch = useCallback(
    debounce((value) => {
      if (value.trim().length >= 2) {
        dispatch(searchUsers({ search: value }));
        setShowDropdown(true);
      } else {
        setShowDropdown(false);
      }
    }, 300),
    [dispatch]
  );

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchKeyword(value);
    handleSearch(value);
  };

  const handleSelectUser = (user) => {
    setSearchKeyword(`${user.first_name} ${user.last_name}`);
    setShowDropdown(false);
    console.log("Selected user:", user);
  };

  useEffect(() => {
    dispatch(suggestedUser({ page: 1, size: 10, type: activeTab }));
  }, [dispatch, activeTab]);

  const ActionCard = ({ action }) => (
    <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <div className="flex-shrink-0">
            <img
              src={action?.avatar || "https://via.placeholder.com/40"}
              alt="User avatar"
              className="w-12 h-12 rounded-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1 text-sm">
              {action?.title}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {action?.description}
            </p>
          </div>
        </div>
        <button
          className={`bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors ml-4 flex-shrink-0 ${action.buttonColor}`}
        >
          <Link>{action.buttonText}</Link>
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-[#F6FAFD] p-6 min-h-screen">
      <div className="flex flex-col md:flex-row w-full mx-auto gap-6">
        {/* Left Section */}
        <div className="xl:w-[75%] lg:w-[70%] md:w-[60%] w-full space-y-6">
          {/* Actions Section */}
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Admin Roles</h2>
            <p className="text-gray-600 mb-6">
              You can add only members who work in the company.
            </p>

            {/* Search Input */}
            <div className="relative mb-5">
              <BiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchKeyword}
                onChange={handleChange}
                placeholder="Search users..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-sm transition"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors">
                <Link>Add Admin</Link>
              </button>

              {/* Dropdown */}
              {showDropdown && (
                <div className="absolute z-50 bg-white border border-gray-200 rounded-xl shadow-lg w-full mt-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {loadingSearch && (
                    <div className="p-3 text-center text-gray-500">Loading...</div>
                  )}
                  {!loadingSearch && searchedUsers.length === 0 && (
                    <div className="p-3 text-center text-gray-500">No users found</div>
                  )}
                  {!loadingSearch &&
                    searchedUsers.map((user) => (
                      <div
                        key={user._id}
                        className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-center gap-3 transition"
                        onClick={() => handleSelectUser(user)}
                      >
                        <img
                          src={user?.profile_picture_url || "/0684456b-aa2b-4631-86f7-93ceaf33303c.png"}
                          alt={user.username}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="flex flex-col">
                          <span className="text-gray-900 font-medium text-sm">
                            {user.first_name} {user.last_name}
                          </span>
                          <span className="text-gray-500 text-xs">{user.email}</span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Action Cards */}
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <ActionCard key={i} action={{
                  avatar: "/0684456b-aa2b-4631-86f7-93ceaf33303c.png",
                  title: `Action ${i + 1}`,
                  description: "Description for action card",
                  buttonText: "Action",
                  buttonColor: "bg-blue-600 hover:bg-blue-700"
                }} />
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
