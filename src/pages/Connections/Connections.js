import React, { useEffect, useState, useMemo, useCallback } from "react";
import { BiSearch, BiUser, BiBuilding, BiBookOpen } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import {
  createUserConnection,
  followUnfollowUsers,
  getFollowingList,
  messageChatUser,
  suggestedUser,
} from "../../redux/Users/userSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../../components/ui/Button/Button";
import { toast } from "sonner";
import { IoClose } from "react-icons/io5";
import ConnectionsCard from "./Components/ConnectionCard";
import FollowingCard from "./Components/FollwoingCard";
import UserCardSkeleton from "./Components/UserCardSkeleton";

const DEFAULT_AVATAR = "/0684456b-aa2b-4631-86f7-93ceaf33303c.png";

const Connections = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [userData, setUserData] = useState([]);
  const [activeTab, setActiveTab] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  const followingList = useSelector(
    (state) => state.user?.getFollowingListData?.data?.data?.list || []
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const fetchData = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);
        setError(null);

        const [_, __, connectionsRes] = await Promise.all([
          dispatch(getFollowingList()).unwrap(),
          dispatch(suggestedUser({ page: 1, size: 10 })).unwrap(),
          dispatch(messageChatUser({ isBlocked: false })).unwrap(),
        ]);

        setUserData(connectionsRes?.data || []);
      } catch (err) {
        console.error("Failed to fetch:", err);
        setError("⚠️ Failed to load connections data.");
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formattedFollowing = useMemo(
    () =>
      followingList.map((item) => {
        const targetId = item?.target_id || {};
        const isCompany = item.target_model === "Companies";
        const isInstitute = item.target_model === "Institutions";
        const isUser = item.target_model === "Users";

        let displayName = targetId.name || "Unknown";
        if (isUser) {
          displayName = `${targetId.first_name || ""} ${
            targetId.last_name || ""
          }`.trim();
        }

        return {
          id: targetId._id,
          name: displayName,
          avatar:
            isCompany || isInstitute
              ? targetId.logo_url
              : targetId.profile_picture_url,
          targetModel: item.target_model || "Users",
          entityType: isCompany
            ? "company"
            : isInstitute
            ? "institute"
            : "user",
          headline: targetId.headline || "",
          followerCount: targetId.follower_count || 0,
        };
      }),
    [followingList]
  );

  // Format connections
  const formattedConnections = useMemo(
    () =>
      userData.map((item) => ({
        id: item.connectionUserId,
        name:
          item.first_name && item.last_name
            ? `${item.first_name} ${item.last_name}`
            : item?.username || "Unknown User",
        title: item.headline || "",
        summary: item.summary || "No summary available.",
        avatar: item.profile_picture_url,
        unreadCount: item.unreadCount || 0,
        isBlocked: item.isBlocked || false,
        isClickable: true,
        entityType: "user",
        isVerified: item.is_verified || false,
        frameStatus: item.frame_status || "",
        followerCount: item.follower_count || 0,
        connectionCount: item.connection_count || item.employee_count || 0,
        employee_count: item.connection_count
          ? "connection_count"
          : "employee_count",
        profileViews: item.profile_views || 0,
        userType: item?.userType || null,
      })),
    [userData]
  );

  const filteredConnections = useMemo(
    () =>
      formattedConnections.filter(
        (u) =>
          u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.summary.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [formattedConnections, searchTerm]
  );

  const filteredFollowing = useMemo(
    () =>
      formattedFollowing.filter(
        (u) =>
          u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.headline.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [formattedFollowing, searchTerm]
  );

  // Handlers
  const handleUserClick = (user) => {
    if (user.isClickable || user?.targetModel === "Users") {
      navigate(`/user/profile/${encodeURIComponent(user?.name)}/${user?.id}`);
    } else {
      let name =
        user?.targetModel === "Companies" ? "companies" : "institutions";

      navigate(`/user/view-details/${name}/${user?.id}`);
    }
  };
  const mapUserTypeToModel = (type) => {
    switch (type) {
      case "User":
        return "Users";
      case "Company":
        return "Companies";
      case "Institution":
        return "Institutions";
      default:
        return null; // or "Users"
    }
  };

  const handleDisconnectUser = async (user) => {
    const key = `disconnect-${user.id}`;
    // console.log("disconnectdisconnect",user);

    setActionLoading((p) => ({ ...p, [key]: true }));
    try {
      const res = await dispatch(
        createUserConnection({
          target_id: user?.id,
          target_model: mapUserTypeToModel(user?.userType),
        })
      ).unwrap();
      if (res) toast.success(res?.message || "User disconnected!");
      await fetchData(true);
    } catch (e) {
      toast.error("Failed to disconnect");
    } finally {
      setActionLoading((p) => {
        const s = { ...p };
        delete s[key];
        return s;
      });
    }
  };

  const handleUnfollow = async (user) => {
    const key = `unfollow-${user.id}`;
    setActionLoading((p) => ({ ...p, [key]: true }));
    try {
      await dispatch(
        followUnfollowUsers({
          target_id: user?.id,
          target_model: user?.targetModel,
        })
      ).unwrap();
      toast.success("Unfollowed successfully!");
      await fetchData(true);
    } catch (e) {
      toast.error("Failed to unfollow");
    } finally {
      setActionLoading((p) => {
        const s = { ...p };
        delete s[key];
        return s;
      });
    }
  };

  // Helpers
  const getEntityIcon = (type) => {
    switch (type) {
      case "company":
        return <BiBuilding className="w-5 h-5 text-purple-500" />;
      case "institute":
        return <BiBookOpen className="w-5 h-5 text-orange-500" />;
      default:
        return <BiUser className="w-5 h-5 text-blue-500" />;
    }
  };

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      setActiveTab(tabParam);
    } else {
      setActiveTab("connection");
      setSearchParams({ tab: "connection" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="transition relative animate-pulse grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(5)].map((_, index) => (
          <UserCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-72 gap-4">
        <div className="text-5xl">⚠️</div>
        <p className="text-red-500 font-medium">{error}</p>
        <Button onClick={() => fetchData()} variant="primary">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-6 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <form className="relative w-full sm:w-80">
            <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 glassy-text-secondary w-5 h-5" />
            <input
              type="text"
              placeholder="Search connections or followings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10 py-2 rounded-full glassy-input-notification text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-full shadow-sm"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 glassy-text-secondary hover:opacity-80 transition-all"
              >
                <IoClose size={18} />
              </button>
            )}
          </form>
        </div>

        {/* Tabs */}
        <div className="flex glassy-card rounded-xl p-1 shadow-sm border border-[var(--border-color)] md:w-fit w-full">
          {[
            {
              key: "connection",
              label: "Connections",
              count: filteredConnections.length,
            },
            {
              key: "following",
              label: "Following",
              count: filteredFollowing.length,
            },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setSearchParams({ tab: tab.key });
              }}
              className={`relative px-6 py-2.5 rounded-lg w-full flex items-center gap-2 text-sm font-medium transition-all duration-300
            ${
              activeTab === tab.key
                ? "bg-gradient-to-r from-blue-500 to-blue-600 glassy-text-primary shadow-md"
                : "glassy-text-secondary hover:bg-[var(--bg-button-hover)]"
            }`}
            >
              {tab.label}
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full transition-all duration-300
              ${
                activeTab === tab.key
                  ? "glassy-card text-blue-500 shadow-sm"
                  : "bg-[var(--bg-button)] glassy-text-secondary"
              }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Connections / Following Grid */}
      <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
        {activeTab === "connection" ? (
          filteredConnections.length > 0 ? (
            filteredConnections.map((u) => (
              <ConnectionsCard
                key={u.id}
                user={u}
                handleDisconnectUser={handleDisconnectUser}
                actionLoading={actionLoading}
                handleUserClick={handleUserClick}
                DEFAULT_AVATAR={DEFAULT_AVATAR}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-16 glassy-text-secondary">
              No connections found
            </div>
          )
        ) : filteredFollowing.length > 0 ? (
          filteredFollowing.map((u) => (
            <FollowingCard
              key={u.id}
              user={u}
              handleUnfollow={handleUnfollow}
              actionLoading={actionLoading}
              handleUserClick={handleUserClick}
              getEntityIcon={getEntityIcon}
              DEFAULT_AVATAR={DEFAULT_AVATAR}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-24 glassy-text-secondary">
            <p className="text-3xl mb-4">👀</p>
            <p className="text-lg">No following found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Connections;
