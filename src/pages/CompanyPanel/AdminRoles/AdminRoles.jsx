import React, { useCallback, useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
import { searchUsers } from "../../../redux/Global Slice/cscSlice";
import { suggestedUser } from "../../../redux/Users/userSlice";
import {
  assignUserToCompany,
  getAssignedUsers,
  removeAssignedUser,
} from "../../../redux/CompanySlices/companiesSlice";
import { toast } from "sonner";
import { getCookie } from "../../../components/utils/cookieHandler";
import PeopleToConnect from "../../../components/ui/ConnectSidebar/ConnectSidebar";
import NoDataFound from "../../../components/ui/No Data/NoDataFound";

const AdminRoles = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const activeMode = getCookie("ACTIVE_MODE"); // "company" | "institution" | undefined
  const isAssignedUser = Boolean(getCookie("ASSIGNED_USER") === "true");

  const [activeTab, setActiveTab] = useState("user"); // user / company / institution
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Redux selectors
  const userSelector = useSelector((state) => state.user);
  const { suggestedUserData: { data: suggestedUsers } = {} } = userSelector || {};

  const globalSelector = useSelector((state) => state.global);
  const { searchUsersData, loading: loadingSearch } = globalSelector || {};
  const searchedUsers = searchUsersData?.data?.data?.list || [];

  const companiesSelector = useSelector((state) => state.companies);
  const assignedUsers = companiesSelector?.getAssignedUsersData?.data?.data || [];

  // --- Search users ---
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
    setSelectedUser(user);
  };

  // --- Assign user/institution/company ---
  const handleAssignUser = async () => {
    if (!selectedUser) {
      toast.error("Please select a user first!");
      return;
    }
    try {
      const res = await dispatch(assignUserToCompany({ user_id: selectedUser?._id })).unwrap();
      toast.success(res?.message || "User assigned successfully!");
      dispatch(getAssignedUsers());
      setSearchKeyword("");
      setSelectedUser(null);
    } catch (err) {
      console.log("this is the error", err)
      toast.error(err || "Failed to assign user");
    }
  };

  // --- Remove assigned user ---
  const handleRemoveUser = async (userId) => {
    try {
      const res = await dispatch(removeAssignedUser({ user_id: userId })).unwrap();
      toast.success(res?.message || "User removed successfully!");
      dispatch(getAssignedUsers());
    } catch (err) {
      toast.error(err?.message || "Failed to remove user");
    }
  };

  // --- Navigate to profile/details ---
  const handleConnect = async (data) => {
    if (!data?.user_path) {
      navigate(
        activeMode === "company"
          ? `/company/profile/${data?.first_name}/${data?._id}`
          : activeMode === "institution"
            ? `/institution/profile/${data?.first_name}/${data?._id}`
            : `/user/profile/${data?.first_name}/${data?._id}`
      );
    } else {
      const name =
        data?.user_path === "Companies"
          ? "companies"
          : data?.user_path === "Institutions"
            ? "institutions"
            : "users";

      navigate(
        activeMode === "company"
          ? `/company/view-details/${name}/${data?._id}`
          : activeMode === "institution"
            ? `/institution/view-details/${name}/${data?._id}`
            : `/user/view-details/${name}/${data?._id}`
      );
    }
  };

  // Fetch suggested users and assigned users on mount
  useEffect(() => {
    dispatch(suggestedUser({ page: 1, size: 10, type: activeTab }));
    dispatch(getAssignedUsers());
  }, [dispatch, activeTab]);

  return (
    <div className="p-6 min-h-screen">
      <div className="flex flex-col md:flex-row w-full mx-auto gap-6">
        {/* Left Section */}
        <div className="xl:w-[75%] lg:w-[70%] md:w-[60%] w-full space-y-6">
          {/* Admin Roles Section */}
          <div className="glassy-card p-6 rounded-2xl shadow-md border border-gray-200">
            <h2 className="text-xl font-bold glassy-text-primary mb-2">Admin Roles</h2>

            {!isAssignedUser && (
              <div className="relative mb-5">
                <BiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 glassy-text-secondary" />
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={handleChange}
                  placeholder="Search users..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl glassy-input-notification focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-sm transition"
                />
                <button
                  onClick={handleAssignUser}
                  disabled={!selectedUser}
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 rounded-lg text-sm font-medium glassy-text-primary transition-colors
                    ${selectedUser ? "glassy-button" : "glassy-button cursor-not-allowed"}`}
                >
                  Add Admin
                </button>

                {/* Dropdown */}
                {showDropdown && (
                  <div className="absolute z-50 glassy-card border border-gray-200 rounded-xl shadow-lg w-full mt-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {loadingSearch && (
                      <div className="p-3 text-center glassy-text-secondary">Loading...</div>
                    )}
                    {!loadingSearch && searchedUsers.length === 0 && (
                      <div className="p-3 text-center glassy-text-secondary">No users found</div>
                    )}
                    {!loadingSearch &&
                      searchedUsers.map((user) => (
                        <div
                          key={user._id}
                          className="px-4 py-3 hover:glassy-card cursor-pointer flex items-center gap-3 transition"
                          onClick={() => handleSelectUser(user)}
                        >
                          <img
                            src={user?.profile_picture_url || "/0684456b-aa2b-4631-86f7-93ceaf33303c.png"}
                            alt={user.username}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div className="flex flex-col">
                            <span className="glassy-text-primary font-medium text-sm">
                              {user.first_name} {user.last_name}
                            </span>
                            <span className="glassy-text-secondary text-xs">{user.email}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* Assigned Users List */}
            <div className="space-y-4 mb-6">
              {assignedUsers && assignedUsers.length > 0 ? (
                assignedUsers.map((user) => (
                  <div
                    key={user._id}
                    className="glassy-card rounded-xl p-4 shadow-md border border-gray-200 flex justify-between items-center hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleConnect(user)}>
                      <img
                        src={user.profile_picture_url || "/0684456b-aa2b-4631-86f7-93ceaf33303c.png"}
                        alt={user.first_name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-semibold glassy-text-primary text-sm">
                          {user.first_name} {user.last_name}
                        </h3>
                        <p className="glassy-text-secondary text-xs">{user.email}</p>
                      </div>
                    </div>
                    {!isAssignedUser && (
                      <button
                        onClick={() => handleRemoveUser(user._id)}
                        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm glassy-text-primary font-medium transition"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <NoDataFound />
              )}
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
