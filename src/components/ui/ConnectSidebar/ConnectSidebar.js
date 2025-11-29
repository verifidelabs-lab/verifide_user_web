import React, { useState } from "react";
import PersonCard from "../cards/PersonCard";
import { useDispatch } from "react-redux";
import {
  createUserConnection,
  followUnfollowUsers,
  suggestedUser,
} from "../../../redux/Users/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getCookie } from "../../utils/cookieHandler";
import { navigateToProfile } from "../../../utils/helperFunctions";

const PeopleToConnect = ({ data, activeTab, setActiveTab, fetchPosts }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [connectedIds, setConnectedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const activeMode = getCookie("ACTIVE_MODE"); // 'company' | 'institution' | 'user'
  console.log("PeopleToConnect DATA:", data);

  const [loadingIds, setLoadingIds] = useState([]);
  const handleConnect = async (data) => {
    navigateToProfile(navigate, activeMode, data);
  };

  const handleConnectUser = async (data) => {
    const userId = data._id;

    try {
      setLoading(true);
      setLoadingIds((prev) => [...prev, userId]);

      switch (data?.user_path) {
        case "Companies":
        case "Institutions": {
          const res = await dispatch(
            followUnfollowUsers({
              target_id: userId,
              target_model: data?.user_path,
            })
          ).unwrap();

          if (res) {
            dispatch(
              suggestedUser({
                page: 1,
                size: 10,
                type: data?.user_path.toLowerCase(),
              })
            );

            toast.success(res?.message || "Action completed successfully");
          }
          break;
        }

        default: {
          const res = await dispatch(
            createUserConnection({
              target_id: userId,
              target_model: "Users",
            })
          ).unwrap();

          if (res) {
            setConnectedIds((prev) => [...prev, userId]);
            dispatch(suggestedUser({ page: 1, size: 10 }));
            toast.success(res?.message);
          }
          break;
        }
      }
      if (typeof fetchPosts === "function") {
        await fetchPosts(1, "initial");
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
      setLoadingIds((prev) => prev.filter((id) => id !== userId));
    }
  };

  return (
    <div className="overflow-hidden glassy-card p-2">
      {/* Tabs */}
      <div className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-1 flex">
        {[
          { key: "user", label: "User" },
          { key: "companies", label: "Companies" },
          { key: "institutions", label: "Institute" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300
          ${
            activeTab === tab.key
              ? "bg-[var(--bg-button)] text-[var(--text-primary)] shadow-md"
              : "text-[var(--text-secondary)] hover:bg-[var(--bg-button-hover)] hover:text-[var(--text-primary)]"
          }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Person Cards */}
      <div className="mt-2 space-y-2">
        {data && data.length > 0 ? (
          data.map((person) => (
            <PersonCard
              key={person.id}
              person={person}
              isConnected={connectedIds.includes(person._id)}
              isLoading={loadingIds.includes(person._id)}
              handleConnect={handleConnect}
              handleConnectUser={handleConnectUser}
              loading={loading}
            />
          ))
        ) : (
          <p className="py-4 text-center text-[var(--text-secondary)]">
            No results found
          </p>
        )}
      </div>

      {/* Explore Button */}
      <div className="px-6 py-4 border-t border-[var(--border-color)]">
        <button
          className="w-full glassy-button"
          onClick={() => {
            const basePath =
              activeMode === "company"
                ? "/company"
                : activeMode === "institution"
                ? "/institution"
                : "/user";

            navigate(`${basePath}/suggested-users?tab=${activeTab}`);
          }}
        >
          Explore
        </button>
      </div>
    </div>
  );
};

export default PeopleToConnect;
