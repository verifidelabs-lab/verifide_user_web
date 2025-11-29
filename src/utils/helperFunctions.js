const getBasePath = (activeMode) => {
  return activeMode === "company"
    ? "/company"
    : activeMode === "institution"
    ? "/institution"
    : "/user";
};

const normalizeType = (type) => {
  if (!type) return null;

  const t = type.toLowerCase();

  if (t.includes("company")) return "companies";
  if (t.includes("institution")) return "institutions";
  return "users"; // default fallback
};

const extractName = (obj) => {
  return (
    obj?.name ||
    obj?.first_name ||
    obj?.fullName ||
    obj?.username ||
    "user"
  );
};

export const navigateToProfile = (navigate, activeMode, data) => {
    console.log("navigateToProfile DATA:",activeMode, data);
  const basePath = getBasePath(activeMode);

  const id = data?._id || data?.id;
  const name = extractName(data);
  const typeKey =
    data?.user_path || data?.userType || data?.entityType || null;

  // If NO type → open simple profile
  if (!typeKey) {
    return navigate(`${basePath}/profile/${encodeURIComponent(name)}/${id}`);
  }

  // Normalize type (Company → companies, Institutions → institutions, etc.)
  const finalType = normalizeType(typeKey);

  // If type is "users" → direct profile
  if (finalType === "users") {
    return navigate(`${basePath}/profile/${encodeURIComponent(name)}/${id}`);
  }

  // Company / Institution details page
  navigate(`${basePath}/view-details/${finalType}/${id}`);
};
