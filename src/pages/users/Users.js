import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createUserConnection,
  followUnfollowUsers,
  suggestedUser,
} from "../../redux/Users/userSlice";
import Pagination from "../../components/Pagination/Pagination";
import { useNavigate, useSearchParams } from "react-router-dom";
import UserProfileCard from "../../components/ui/cards/UserProfileCard";
import { toast } from "sonner";
import { BiSearch } from "react-icons/bi";
import { IoClose } from "react-icons/io5";

const Users = () => {
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.user);
  const {
    suggestedUserData: { data },
    loading,
    error,
  } = selector || {};
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyWord, setKeyWord] = useState();

  const getTabData = () => {
    if (!data?.data) return { list: [], total: 0 };
    if (data.data.list) {
      return data.data;
    } else if (Array.isArray(data.data)) {
      return { list: data.data, total: data.data.length };
    }
    return { list: [], total: 0 };
  };

  const tabData = getTabData();
  const items = tabData?.list || [];

  // useEffect(() => {
  //     if (activeTab)
  //         dispatch(suggestedUser({ page: currentPage, size: usersPerPage, type: activeTab, keyWord: keyWord }));
  // }, [dispatch, activeTab, currentPage, keyWord]);

  useEffect(() => {
    if (activeTab) {
      setIsLoading(true);
      dispatch(
        suggestedUser({
          page: currentPage,
          size: usersPerPage,
          type: activeTab,
          keyWord: keyWord,
        })
      )
        .unwrap()
        .finally(() => setIsLoading(false));
    }
  }, [dispatch, activeTab, currentPage, keyWord]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleConnect = async (data) => {
    switch (activeTab) {
      case "user":
        navigate(
          `/user/profile/${data?.first_name || data?.username}/${data?._id}`
        );
        break;

      case "companies":
        if (data?._id) {
          navigate(`/user/view-details/companies/${data._id}`);
        } else {
          console.warn("Missing ID in data:", data);
          toast.error("Cannot view this company");
        }
        break;

      case "institutions":
        if (data?._id) {
          navigate(`/user/view-details/institutions/${data._id}`);
        } else {
          console.warn("Missing ID in data:", data);
          toast.error("Cannot view this institution");
        }
        break;

      default:
      // console.log('View clicked for:', data);
    }
  };

  const getTabConfig = () => {
    return [
      { key: "user", label: "Users", icon: "👤" },
      { key: "companies", label: "Companies", icon: "🏢" },
      { key: "institutions", label: "Institutions", icon: "🎓" },
    ];
  };

  const tabConfig = getTabConfig();
  const handleFollowUnfollow = async (data) => {
    switch (activeTab) {
      case "user":
        try {
          const res = await dispatch(
            createUserConnection({
              target_id: data?._id,
              target_model: "Users",
            })
          ).unwrap();
          toast.success(res?.message);
          dispatch(
            suggestedUser({ page: 1, size: usersPerPage, type: activeTab })
          );
        } catch (error) {
          toast.error(error);
        } finally {
        }
        break;
      case "companies":
        await dispatch(
          followUnfollowUsers({
            target_id: data?._id,
            target_model: data?.user_path,
          })
        ).unwrap();
        dispatch(
          suggestedUser({ page: 1, size: usersPerPage, type: activeTab })
        );
        break;
      case "institutions":
        await dispatch(
          followUnfollowUsers({
            target_id: data?._id,
            target_model: data?.user_path,
          })
        ).unwrap();
        dispatch(
          suggestedUser({ page: 1, size: usersPerPage, type: activeTab })
        );
        break;
      default: {
        try {
          const res = await dispatch(
            createUserConnection({ connection_user_id: data?._id })
          ).unwrap();
          toast.success(res?.message);
          dispatch(
            suggestedUser({ page: 1, size: usersPerPage, type: activeTab })
          );
        } catch (error) {
          toast.error(error);
        } finally {
        }
        break;
      }
      // console.log('View clicked for:', data);
    }
  };

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      setActiveTab(tabParam);
    } else {
      setActiveTab("user");
      setSearchParams({ tab: "user" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 ">
      <div className="flex md:flex-row flex-col justify-between place-items-center">
        <nav className="flex justify-start items-center gap-2 mb-2 text-sm">
          <form className="relative w-full sm:w-80">
            <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2  w-5 h-5 glassy-text-secondary" />
            <input
              type="text"
              placeholder="Search connections or followings..."
              value={keyWord}
              onChange={(e) => setKeyWord(e.target.value)}
              className=" glassy-input-notification pl-10 pr-10 py-2 border  rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-full shadow-sm"
            />
            {keyWord && (
              <button
                type="button"
                onClick={() => setKeyWord("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 glassy-button hover:glassy-text-secondary"
              >
                <IoClose size={18} />
              </button>
            )}
          </form>
        </nav>
        <div className="  border glassy-card rounded-xl p-1 flex">
          {tabConfig.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setCurrentPage(1);
                setSearchParams({ tab: tab.key });
                setKeyWord("");
              }}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2
        ${
          activeTab === tab.key
            ? " glassy-text-primary shadow-md"
            : "glassy-text-secondary  hover:glassy-text-primary"
        }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8 flex md:flex-row flex-col justify-between items-center"></div>

      {isLoading ? (
        <div className="flex justify-center py-8 glassy-card">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 "></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-10 justify-items-center">
          {items.map((item) => (
            <UserProfileCard
              key={item._id}
              profile_picture_url={item?.profile_picture_url}
              email={item?.headline || item?.display_name}
              user={item}
              handleView={handleConnect}
              summary={item?.summary || item?.description}
              follow={item?.follower_count}
              connection={item?.connection_count}
              profile_views={item?.profile_views}
              activeTab={activeTab}
              handleFollowUnfollow={handleFollowUnfollow}
            />
          ))}
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">
            {activeTab === "user" && "👥"}
            {activeTab === "companies" && "🏢"}
            {activeTab === "institutions" && "🎓"}
          </div>
          <h3 className="text-xl font-semibold glassy-text-primary mb-2">
            No {tabConfig.find((t) => t.key === activeTab)?.label.toLowerCase()}{" "}
            found
          </h3>
          <p className="glassy-text-secondary max-w-md mx-auto">
            {activeTab === "user" &&
              "No user suggestions available right now. Check back later for connection opportunities."}
            {activeTab === "companies" &&
              "No companies to explore at the moment. New companies are added regularly."}
            {activeTab === "institutions" &&
              "No institutions available currently. Educational partners are being added soon."}
          </p>
        </div>
      )}

      {!loading && !error && tabData?.total > usersPerPage && (
        <div className="mt-12 flex justify-center">
          <Pagination
            totalPages={Math.ceil(tabData.total / usersPerPage)}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default Users;
