import axios from 'axios';
import { getCookie, removeCookie } from '../utils/cookieHandler';
import { CiNoWaitingSign } from 'react-icons/ci';

// const isLive = false;
const isLive = true


export const apiUrl = isLive ? 'https://dev-verifide.verifide.xyz/api/v1/' : 'http://192.168.88.185:5004/api/v1/';
export const socketApiUrl = isLive ? 'https://dev-verifide.verifide.xyz/socket' : 'http://192.168.88.185:5004/socket';

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
    headers: { 'Content-Type': 'multipart/form-data' },
});

// Auth request interceptor for user OR company token
const authRequestInterceptor = (config) => {
    console.log("this is the config furl", config)
    // Determine which token to use
    // Default to user token
    let token = getCookie("VERIFIED_TOKEN")?.replace(/^"|"$/g, '');
    let isCompany = getCookie("ACTIVE_MODE");

    console.log()
    // If company token exists and path includes /company, use it
    if (getCookie("COMPANY_TOKEN") && isCompany === "company") {
        token = getCookie("COMPANY_TOKEN")?.replace(/^"|"$/g, '');
    }

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        removeCookie("VERIFIED_TOKEN");
        removeCookie("COMPANY_TOKEN");
        return Promise.reject(new Error("No authentication token found"));
    }
    return config;
};

// Central error interceptor
const errorResponseInterceptor = (error) => {
    if (!error.response) {
        return Promise.reject({ message: "Network error. Please try again." });
    }

    switch (error.response.status) {
        case 403:
            return Promise.reject({
                message: error.response.data?.message || "Access denied. Insufficient permissions."
            });
        case 500:
            return Promise.reject({ message: "Internal server error. Please try again later." });
        default:
            return Promise.reject(error.response.data || { message: "An unknown error occurred" });
    }
};

// Apply interceptors
[axiosPrivate, axiosImage].forEach(instance => {
    instance.interceptors.request.use(authRequestInterceptor);
    instance.interceptors.response.use(
        (response) => {
            // Session expired handling for user OR company
            if (response?.data?.code === 3) {
                removeCookie("VERIFIED_TOKEN");
                removeCookie("COMPANY_TOKEN");
                return Promise.reject({ message: "Session expired" });
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

// Helper for uploading images directly
const uploadImageDirect = async (apiPath, formData) => {
    try {
        const response = await axiosImage.post(apiPath, formData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export { axiosPrivate, axiosPublic, axiosImage, uploadImageDirect };
