/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  followUnfollowUsers,
  viewCompanyInstituteProfile,
} from "../../redux/Users/userSlice";
import {
  BiPhoneIncoming,
  BiBuilding,
  BiGlobe,
  BiUser,
  BiCalendar,
} from "react-icons/bi";
import { IoAlertCircleOutline } from "react-icons/io5";
import { MdEmail, MdGroups, MdOutlineContentCopy } from "react-icons/md";
import { FaLinkedin } from "react-icons/fa";
import Button from "../../components/ui/Button/Button";
import { BsPersonFillAdd } from "react-icons/bs";
import { BaseUrl } from "../../components/hooks/axiosProvider";

function capitalizeWords(str = "") {
  return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

const CompanyInstituteView = () => {
  const { name, id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageErrors, setImageErrors] = useState({
    banner: false,
    logo: false,
  });
  const [followActionLoading, setFollowActionLoading] = useState(false);
  const handleResumeDownload = async (data) => {
    const url = `${BaseUrl}company-details/${data?._id}`;

    try {
      await navigator.clipboard.writeText(url);
      toast.success("URL copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };
  const fetchOrgData = async () => {
    try {
      setLoading(true);
      const res = await dispatch(
        viewCompanyInstituteProfile({ _id: id, type: name })
      ).unwrap();
      setData(res?.data);
    } catch (error) {
      toast.error(error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrgData();
  }, []);

  const handleImageError = (type) => {
    setImageErrors((prev) => ({ ...prev, [type]: true }));
  };

  const handleFollowUnfollow = async (
    target_id,
    target_model,
    currentStatus,
    name
  ) => {
    try {
      setFollowActionLoading(true);

      const response = await dispatch(
        followUnfollowUsers({
          target_id,
          target_model: capitalizeWords(target_model),
        })
      ).unwrap();

      if (!response.error) {
        const actionText = currentStatus ? "Unfollowed" : "Followed";
        toast.success(
          `${capitalizeWords(name || target_model)} successfully ${actionText}.`
        );

        setData((prev) => ({ ...prev, isFollowed: !currentStatus }));
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      toast.error(
        "We're sorry for the inconvenience! There was an issue processing your request."
      );
    } finally {
      setFollowActionLoading(false);
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto animate-pulse glassy-card">
        {/* Banner Skeleton */}
        <div className="h-56 w-full rounded-2xl glassy-text-secondary mb-6"></div>

        {/* Header Skeleton */}
        <div className="flex items-center mt-6 gap-4">
          <div className="w-20 h-20 rounded-xl glassy-text-secondary"></div>
          <div className="flex-1">
            <div className="h-8 glassy-text-secondary rounded w-1/3 mb-2"></div>
            <div className="h-4 glassy-text-secondary rounded w-1/4"></div>
          </div>
        </div>

        {/* Description Skeleton */}
        <div className="mt-6 space-y-2">
          <div className="h-4 glassy-text-secondary rounded w-full"></div>
          <div className="h-4 glassy-text-secondary rounded w-5/6"></div>
          <div className="h-4 glassy-text-secondary rounded w-4/6"></div>
        </div>

        {/* Stats Skeleton */}
        <div className="grid sm:grid-cols-3 gap-6 mt-8">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="glassy-card p-4 rounded-xl shadow border"
            >
              <div className="h-5 glassy-text-secondary rounded w-1/2 mb-2"></div>
              <div className="h-8 glassy-text-secondary rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center glassy-card">
        <IoAlertCircleOutline className="w-16 h-16 glassy-text-secondary mb-4" />
        <h2 className="text-2xl font-semibold glassy-text-primary mb-2">
          Organization Not Found
        </h2>
        <p className="glassy-text-secondary max-w-md">
          We couldn't find the organization you're looking for. It may have been
          removed or you may have followed an invalid link.
        </p>
      </div>
    );
  }

  const info = data?.info || {};
  const companydata = data || {};
  const isInstitute = data?.type === "institutions";

  return (
    <div className="p-8">
      <div>
        <nav className="flex justify-start items-center gap-2 mb-2 text-sm">
          <span
            className="glassy-text-secondary cursor-pointer"
            onClick={() => navigate(`/user/feed`)}
          >
            Home
          </span>
          <span className="glassy-text-secondary">›</span>
          <span
            className="glassy-text-secondary cursor-pointer"
            onClick={() => navigate(`/user/suggested-users?tab=${data?.type}`)}
          >
            Suggested Profiles
          </span>
          <span className="glassy-text-secondary">›</span>
          <span className="font-medium glassy-text-primary cursor-pointer">
            {capitalizeWords(info?.name || data?.type)}
          </span>
        </nav>
      </div>
      {/* Banner */}
      {/* <div className="h-40 md:h-56 w-full rounded-2xl overflow-hidden  bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-center relative">
        {info?.banner_image_url && !imageErrors.banner ? (
          <img
            src={info.banner_image_url}
            alt="banner"
            className="w-full h-full object-cover"
            onError={() => handleImageError('banner')}
          />
        ) : (
          <div className="flex flex-col items-center glassy-text-secondary">
            <MdOutlineImageNotSupported className="w-12 h-12 md:w-16 md:h-16 mb-2" />
            <p className="text-sm">No banner image</p>
          </div>
        )}
      </div> */}

      {/* Main Content Card */}
      <div className="glassy-card rounded-2xl mt-4 relative overflow-hidden h-screen">
        {/* Header */}
        <div className="p-6 pb-0 flex flex-col md:flex-row items-start gap-6">
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-xl glassy-card flex items-center justify-center shadow-lg border-4 border-white  overflow-hidden">
            {info?.logo_url && !imageErrors.logo ? (
              <img
                src={info.logo_url}
                alt={info.name || "logo"}
                className="w-full h-full object-cover"
                onError={() => handleImageError("logo")}
              />
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full glassy-card glassy-text-secondary">
                <BiBuilding className="w-8 h-8 md:w-10 md:h-10" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-bold glassy-text-primary">
                  {info?.display_name || info?.name || "Unnamed Organization"}
                </h1>
                {info?.is_verified && (
                  <span className="glassy-card text-blue-700 text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                    ✔ Verified
                  </span>
                )}
              </div>
              <Button
                type="button"
                onClick={() =>
                  handleFollowUnfollow(
                    data?._id,
                    data?.type,
                    data?.isFollowed,
                    data?.info?.display_name || data?.info?.name
                  )
                }
                loading={followActionLoading}
                icon={<BsPersonFillAdd />}
                className="w-full glassy-button"
              >
                {!data.isFollowed ? "Follow" : "Unfollow"}
              </Button>
            </div>

            {info?.name && info.name !== info?.display_name && (
              <p className="glassy-text-secondary mt-1">{info?.name}</p>
            )}

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-4 mt-4 text-sm glassy-text-secondary">
              {info?.country_code?.name && (
                <span className="flex items-center gap-1">
                  <span className="text-lg">{info.country_code?.emoji}</span>
                  {info.country_code?.name}
                </span>
              )}

              {info?.founded_year && isInstitute && (
                <span className="flex items-center gap-1 ">
                  <BiCalendar className="w-4 h-4" />
                  Est. {new Date(info.founded_year).getFullYear()}
                </span>
              )}

              {info?.company_type && !isInstitute && (
                <span className="flex items-center gap-1">
                  <BiBuilding className="w-4 h-4" />
                  {info.company_type}
                </span>
              )}
            </div>
            <button
              className="border text-sm px-3 py-1 rounded-md glassy-button mt-2 font-medium flex items-center gap-1"
              onClick={() => handleResumeDownload(companydata)}
            >
              Profile URL <MdOutlineContentCopy />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Description */}
          {info?.description && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold glassy-text-primary capitalize mb-2">
                About
              </h2>
              <p className="glassy-text-secondary leading-relaxed">
                {info.description}
              </p>
            </div>
          )}

          {/* Contact Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {info?.website_url && (
              <div className="flex items-center gap-3 p-3 glassy-card hover:bg-black rounded-lg transition-colors">
                <div className="p-2 glassy-card rounded-lg shadow-sm">
                  <BiGlobe className="w-5 h-5 glassy-text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm glassy-text-primary">Website</p>
                  <a
                    href={info.website_url}
                    target="_blank"
                    rel="noreferrer"
                    className="glassy-text-secondary hover:underline truncate block"
                  >
                    {info.website_url.replace(/^https?:\/\//, "")}
                  </a>
                </div>
              </div>
            )}

            {info?.phone_no && (
              <div className="flex items-center gap-3 p-3  rounded-lg glassy-card hover:bg-black transition-colors">
                <div className="p-2 glassy-card rounded-lg shadow-sm">
                  <BiPhoneIncoming className="w-5 h-5 glassy-text-primary" />
                </div>
                <div>
                  <p className="text-sm glassy-text-primary">Phone</p>
                  <a
                    href={`tel:${info.phone_no}`}
                    className="glassy-text-secondary hover:glassy-text-primary"
                  >
                    {info.phone_no}
                  </a>
                </div>
              </div>
            )}

            {info?.email && (
              <div className="flex items-center gap-3 p-3 rounded-lg glassy-card hover:bg-black transition-colors">
                <div className="p-2 glassy-card rounded-lg shadow-sm">
                  <MdEmail className="w-5 h-5 glassy-text-primary" />
                </div>
                <div>
                  <p className="text-sm glassy-text-primary">Email</p>
                  <a
                    href={`mailto:${info.email}`}
                    className="glassy-text-secondary hover:glassy-text-primary"
                  >
                    {info.email}
                  </a>
                </div>
              </div>
            )}

            {info?.linkedin_page_url && (
              <div className="flex items-center gap-3 p-3 rounded-lg glassy-card hover:bg-black transition-colors">
                <div className="p-2 glassy-card rounded-lg shadow-sm">
                  <FaLinkedin className="w-5 h-5 glassy-text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm glassy-text-primary">LinkedIn</p>
                  <a
                    href={info.linkedin_page_url}
                    target="_blank"
                    rel="noreferrer"
                    className="glassy-text-secondary hover:underline truncate block"
                  >
                    LinkedIn Page
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 " >
            <div className="glassy-card p-5 rounded-xl border border-blue-100 transition-all hover:shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg">
                  <BiUser className="w-5 h-5 glassy-text-primary" />
                </div>
                <p className="text-sm font-medium glassy-text-primary">
                  Followers
                </p>
              </div>
              <p className="text-2xl font-bold glassy-text-secondary">
                {info?.follower_count?.toLocaleString() || 0}
              </p>
            </div>

            <div className="glassy-card p-5 rounded-xl border border-blue-100 transition-all hover:shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg">
                  <MdGroups className="w-5 h-5 glassy-text-primary" />
                </div>
                <p className="text-sm font-medium glassy-text-primary">
                  Employees
                </p>
              </div>
              <p className="text-2xl font-bold glassy-text-secondary">
                {info?.employee_count?.toLocaleString() || 0}
              </p>
            </div>

            <div className="glassy-card p-5 rounded-xl border border-blue-100 transition-all hover:shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2  rounded-lg">
                  {isInstitute ? (
                    <BiCalendar className="w-5 h-5 glassy-text-primary" />
                  ) : (
                    <BiBuilding className="w-5 h-5 glassy-text-primary" />
                  )}
                </div>
                <p className="text-sm font-medium glassy-text-primary">
                  {isInstitute ? "Founded" : "Company Type"}
                </p>
              </div>
              <p className="text-2xl font-bold glassy-text-secondary">
                {isInstitute
                  ? info?.founded_year
                    ? new Date(info.founded_year).getFullYear()
                    : "N/A"
                  : info?.company_type || "N/A"}
              </p>
            </div>
          </div>

          {/* Tags */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold glassy-text-primary capitalize mb-3">
              {isInstitute ? "Specialties" : "Industries"}
            </h2>
            <div className="flex flex-wrap gap-2">
              {(isInstitute ? info?.specialties : info?.industries)?.length >
              0 ? (
                (isInstitute ? info.specialties : info.industries).map(
                  (item, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full text-[13px] font-semibold  border border-[#E8E8E8] glassy-text-secondary hover:glassy-text-primary"
                    >
                      {typeof item === "string" ? item : item?.name}
                    </span>
                  )
                )
              ) : (
                <p className="glassy-text-secondary">
                  No {isInstitute ? "specialties" : "industries"} listed
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyInstituteView;
