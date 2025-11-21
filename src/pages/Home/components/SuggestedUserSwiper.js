import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useDispatch } from "react-redux";
import {
  createUserConnection,
  suggestedUser,
} from "../../../redux/Users/userSlice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const SuggestedUsersSwiper = ({
  suggestedUsers = [],
  loadingStates = {},
  onExploreMore,
}) => {
  const dispatch = useDispatch();
  const [loadingIds, setLoadingIds] = useState([]);
  const navigate = useNavigate();

  if (!suggestedUsers || suggestedUsers.length === 0) {
    return null;
  }

  const handleConnectUser = async (user) => {
    const userId = user._id;

    try {
      setLoadingIds((prev) => [...prev, userId]);

      const res = await dispatch(
        createUserConnection({
          target_id: userId,
          target_model: "Users",
        })
      ).unwrap();

      if (res) {
        dispatch(suggestedUser({ page: 1, size: 10 }));
        toast.success(res?.message);
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== userId));
    }
  };

  const handleUserProfile = (data) => {
    navigate(`/user/profile/${data?.first_name}/${data?._id}`);
  };

  return (
    <div className="rounded-2xl p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold glassy-text-primary">
          People you may know
        </h3>
        <button
          onClick={onExploreMore}
          className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors px-3 py-1.5 rounded-lg hover:glassy-card"
        >
          <span>Explore more</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 
              4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 
              0 110-2h11.586l-2.293-2.293a1 1 
              0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <Swiper
        spaceBetween={20}
        slidesPerView={2}
        breakpoints={{
          640: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 5 },
          1280: { slidesPerView: 6 },
        }}
      >
        {suggestedUsers.map((user, index) => {
          const isLoading =
            loadingStates.follows?.[user._id] || loadingIds.includes(user._id);

          return (
            <SwiperSlide key={user._id || index}>
              <div className="glassy-card rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
                <div className="flex flex-col items-center text-center flex-grow">
                  <div className="relative mb-4">
                    {user.profile_picture_url ? (
                      <>
                        <img
                          src={
                            user.profile_picture_url ||
                            "/0684456b-aa2b-4631-86f7-93ceaf33303c.png"
                          }
                          alt={`${user.first_name || user.name || ""} ${
                            user.last_name || ""
                          }`}
                          className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                          onError={(e) => {
                            const fallback =
                              "/0684456b-aa2b-4631-86f7-93ceaf33303c.png";
                            if (!e.currentTarget.src.endsWith(fallback)) {
                              e.currentTarget.src = fallback;
                            }
                          }}
                        />
                      </>
                    ) : (
                      <>
                        <img
                          src={"/0684456b-aa2b-4631-86f7-93ceaf33303c.png"}
                          alt={`${user.first_name || user.name || ""} ${
                            user.last_name || ""
                          }`}
                          className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                          onError={(e) => {
                            const fallback =
                              "/0684456b-aa2b-4631-86f7-93ceaf33303c.png";
                            if (!e.currentTarget.src.endsWith(fallback)) {
                              e.currentTarget.src = fallback;
                            }
                          }}
                        />
                      </>
                    )}

                    {user.isConnected && (
                      <div className="absolute -bottom-1 -right-1 glassy-card0 rounded-full p-0.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 glassy-text-primary"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 
                            1.414l-8 8a1 1 0 01-1.414 
                            0l-4-4a1 1 0 011.414-1.414L8 
                            12.586l7.293-7.293a1 1 0 
                            011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  <h4
                    className="font-semibold glassy-text-primary text-sm mb-1 capitalize"
                    onClick={() => handleUserProfile(user)}
                  >
                    {user.username || ""}
                  </h4>
                  <p className="text-xs glassy-text-secondary mb-4 line-clamp-2 flex-grow">
                    {user.headline || "No headline provided"}
                  </p>

                  <button
                    onClick={() => handleConnectUser(user)}
                    disabled={isLoading}
                    className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors w-full flex items-center justify-center ${
                      user.isConnected
                        ? "glassy-card glassy-text-primary hover:glassy-card border border-gray-300"
                        : "bg-blue-600 glassy-text-primary hover:bg-blue-700 shadow-sm"
                    } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 
                            0 0 5.373 0 12h4zm2 
                            5.291A7.962 7.962 0 014 
                            12H0c0 3.042 1.135 5.824 
                            3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Loading
                      </>
                    ) : user.isConnected ? (
                      "Following"
                    ) : (
                      "Follow"
                    )}
                  </button>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default SuggestedUsersSwiper;
