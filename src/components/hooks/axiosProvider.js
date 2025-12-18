// import axios from "axios";
// import { getCookie, removeCookie } from "../utils/cookieHandler";
// import { CiNoWaitingSign } from "react-icons/ci";
// import { toast } from "sonner";

// const isLive = false;
// // const isLive = true;
// // export const BaseUrl = "https://verifide.xyz/"
// export const BaseUrl = "http://dev-verifide.rktitdemo.xyz/"
// // export const BaseUrl = "https://dev-verifide.verifide.xyz/";
// // export const BaseUrl = "http://localhost:3000/";
// export const apiUrl = isLive
//   ? `${BaseUrl}api/v1/`
//   : "http://192.168.1.5:5004/api/v1/";
// export const socketApiUrl = isLive
//   ? `${BaseUrl}socket`
//   : "http://192.168.1.5:5004/socket";

// const axiosPublic = axios.create({
//   baseURL: apiUrl,
//   headers: { "Content-Type": "application/json" },
// });

// const axiosPrivate = axios.create({
//   baseURL: apiUrl,
//   headers: { "Content-Type": "application/json" },
// });

// const axiosImage = axios.create({
//   baseURL: apiUrl,
//   headers: { "Content-Type": "multipart/form-data" },
// });

// // Auth request interceptor for user, company, or institution token
// const authRequestInterceptor = (config) => {
//   console.log("Request config:", config);

//   // Default to user token
//   let token = getCookie("VERIFIED_TOKEN")?.replace(/^"|"$/g, "");
//   const activeMode = getCookie("ACTIVE_MODE"); // "company" | "institution" | undefined

//   // Use TOKEN for company or institution if ACTIVE_MODE is set
//   if (activeMode === "company" || activeMode === "institution") {
//     token = getCookie("TOKEN")?.replace(/^"|"$/g, "");
//   }

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   } else {
//     // Clear cookies if no valid token found
//     removeCookie("VERIFIED_TOKEN");
//     removeCookie("TOKEN");
//     removeCookie("ACTIVE_MODE");
//     removeCookie("ASSIGNED_USER");
//        toast.error("Session expired! Please log in again.");

//     // Redirect to login page after a short delay
//     setTimeout(() => {
//       window.location.href = "/login"; // adjust path if needed
//     }, 1000);
    
//     return Promise.reject(new Error("No authentication token found"));

//   }

//   return config;
// };

// export default authRequestInterceptor;


// // Central error interceptor
// const errorResponseInterceptor = (error) => {
//   if (!error.response) {
//     return Promise.reject({ message: "Network error. Please try again." });
//   }

//   switch (error.response.status) {
//     case 403:
//       return Promise.reject({
//         message:
//           error.response.data?.message ||
//           "Access denied. Insufficient permissions.",
//       });
//     case 500:
//       return Promise.reject({
//         message: "Internal server error. Please try again later.",
//       });
//     default:
//       return Promise.reject(
//         error.response.data || { message: "An unknown error occurred" }
//       );
//   }
// };

// // Apply interceptors
// [axiosPrivate, axiosImage].forEach((instance) => {
//   instance.interceptors.request.use(authRequestInterceptor);
//   instance.interceptors.response.use((response) => {
//     // Session expired handling for user OR company
//     if (response?.data?.code === 3) {
//       removeCookie("VERIFIED_TOKEN");
//       removeCookie("TOKEN");
//       return Promise.reject({ message: "Session expired" });
//     }
//     return response;
//   }, errorResponseInterceptor);
// });

// axiosPublic.interceptors.response.use(
//   (response) => response,
//   errorResponseInterceptor
// );

// // Helper for uploading images directly
// const uploadImageDirect = async (apiPath, formData) => {
//   try {
//     const response = await axiosImage.post(apiPath, formData);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export { axiosPrivate, axiosPublic, axiosImage, uploadImageDirect };
import axios from "axios";
import { forceLogout, getCookie } from "../utils/cookieHandler";

const isLive = false;

export const BaseUrl = "http://dev-verifide.rktitdemo.xyz/";

export const apiUrl = isLive
  ? `${BaseUrl}api/v1/`
  : "http://192.168.1.5:5004/api/v1/";

export const socketApiUrl = isLive
  ? `${BaseUrl}socket`
  : "http://192.168.1.5:5004/socket";

const axiosPublic = axios.create({
  baseURL: apiUrl,
  headers: { "Content-Type": "application/json" },
});

const axiosPrivate = axios.create({
  baseURL: apiUrl,
  headers: { "Content-Type": "application/json" },
});

const axiosImage = axios.create({
  baseURL: apiUrl,
  headers: { "Content-Type": "multipart/form-data" },
});

/* ===============================
   REQUEST INTERCEPTOR (AUTH)
================================ */
const authRequestInterceptor = (config) => {
  let token = getCookie("VERIFIED_TOKEN")?.replace(/^"|"$/g, "");
  const activeMode = getCookie("ACTIVE_MODE"); // company | institution

  if (activeMode === "company" || activeMode === "institution") {
    token = getCookie("TOKEN")?.replace(/^"|"$/g, "");
  }

  if (!token) {
    forceLogout();
    return Promise.reject(new Error("Authentication token missing"));
  }

  config.headers.Authorization = `Bearer ${token}`;
  return config;
};

/* ===============================
   RESPONSE ERROR INTERCEPTOR
================================ */
const errorResponseInterceptor = (error) => {
  // 🔴 No response (server down / network issue)
  if (!error.response) {
    forceLogout("Network error. Please login again.");
    return Promise.reject(error);
  }

  const { status, data } = error.response;

  // 🔴 Auth related errors
  if (status === 401 || status === 403) {
    forceLogout(data?.message || "Unauthorized access");
    return Promise.reject(error);
  }

  // 🔴 Server crash
  if (status >= 500) {
    forceLogout("Server error. Please login again.");
    return Promise.reject(error);
  }

  return Promise.reject(data || error);
};

/* ===============================
   APPLY INTERCEPTORS
================================ */
[axiosPrivate, axiosImage].forEach((instance) => {
  instance.interceptors.request.use(authRequestInterceptor);
  instance.interceptors.response.use(
    (response) => {
      // backend session expired code handling
      if (response?.data?.code === 3) {
        forceLogout("Session expired");
        return Promise.reject(response);
      }
      return response;
    },
    errorResponseInterceptor
  );
});

axiosPublic.interceptors.response.use(
  (response) => response,
  errorResponseInterceptor
);

/* ===============================
   IMAGE UPLOAD HELPER
================================ */
export const uploadImageDirect = async (apiPath, formData) => {
  const response = await axiosImage.post(apiPath, formData);
  return response.data;
};

export { axiosPrivate, axiosPublic, axiosImage };
