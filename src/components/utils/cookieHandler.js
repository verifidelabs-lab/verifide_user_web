import Cookies from "js-cookie";

/**
 * Set a cookie with optional options
 * @param {string} key
 * @param {string|object} value
 * @param {object} options
 */
export const setCookie = (key, value, options = {}) => {
    Cookies.set(key, value, { expires: 7, ...options });
};

/**
 * Get a cookie value by key
 * @param {string} key
 * @returns {string | undefined}
 */
export const getCookie = (key) => {
    return Cookies.get(key);
};

/**
 * Remove a specific cookie
 * @param {string} key
 */
export const removeCookie = (key) => {
    Cookies.remove(key);
};

/**
 * Clear all cookies, localStorage, sessionStorage
 */
export const clearAllData = () => {
    Object.keys(Cookies.get()).forEach(cookie => Cookies.remove(cookie));
    sessionStorage.clear();
    localStorage.clear();
};

/**
 * Clear only user token
 */
export const clearUserSession = () => {
    removeCookie("VERIFIED_TOKEN");
    removeCookie("USER_ROLE");
};

/**
 * Clear only company token
 */
export const clearCompanySession = () => {
    removeCookie("ROLE");
    removeCookie("TOKEN");
    removeCookie("ACTIVE_MODE")
    removeCookie("ASSIGNED_USER")
};

/**
 * Clear all cookies/data and detect incognito mode
 */
export const clearAllDataIncognito = () => {
    const detectIncognito = async () => {
        let isIncognito = false;
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
        } catch (e) {
            isIncognito = true;
        }
        return isIncognito;
    };

    Object.keys(Cookies.get()).forEach(cookie => Cookies.remove(cookie));
    sessionStorage.clear();
    localStorage.clear();

    detectIncognito().then(status => {
        if (status) {
            console.log('Incognito mode detected. All data cleared.');
        } else {
            console.log('Normal browsing mode. All data cleared.');
        }
    });
};

/**
 * Clear both user & company session (recommended when logging out completely)
 */
export const clearAllSessions = () => {
    clearUserSession();
    clearCompanySession();
};
