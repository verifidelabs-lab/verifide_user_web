
import Cookies from "js-cookie";

export const setCookie = (key, value, options = {}) => {
    Cookies.set(key, value, { expires: 7, ...options });
};

export const getCookie = (key) => {
    return Cookies.get(key);
};

export const removeCookie = (key) => {
    Cookies.remove(key);
};


export const clearAllData = () => {
    Object.keys(Cookies.get()).forEach((cookie) => {
        Cookies.remove(cookie);
    });
    sessionStorage.clear();

    localStorage.clear();
};

export const clearAllDataIncognito = () => {
    const isIncognito = (async () => {
        let isIncognito = false;
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
        } catch (e) {
            isIncognito = true;
        }
        return isIncognito;
    })();
    Object.keys(Cookies.get()).forEach((cookie) => {
        Cookies.remove(cookie);
    });
    sessionStorage.clear();
    localStorage.clear();
    isIncognito.then((status) => {
        if (status) {
            console.log('Incognito mode detected. All data cleared.');
        } else {
            console.log('Normal browsing mode. All data cleared.');
        }
    });
};
