import axios from 'axios';
import { getCookie, removeCookie } from '../utils/cookieHandler';


const isLive = false
// const isLive = true

export const apiUrl = isLive ? 'https://dev-verified.jamsara.com/api/v1/' : ' http://192.168.94.185:5004/api/v1/';
export const socketApiUrl = isLive ? 'https://dev-verified.jamsara.com/socket' : ' http://192.168.94.185:5004socket';


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

const authRequestInterceptor = (config) => {
    const token = getCookie("VERIFIED_TOKEN")?.replace(/^"|"$/g, '');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        removeCookie();
        return Promise.reject(new Error("No authentication token found"));
    }
    return config;
};

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

[axiosPrivate, axiosImage].forEach(instance => {
    instance.interceptors.request.use(authRequestInterceptor);
    instance.interceptors.response.use(
        (response) => {
            if (response?.data?.code === 3) {
                removeCookie();
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

const uploadImageDirect = async (apiPath, formData) => {
    try {
        const response = await axiosImage.post(apiPath, formData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export { axiosPrivate, axiosPublic, axiosImage, uploadImageDirect };