import React, { createContext, useContext, useState, useEffect } from "react";
import { removeCookie, getCookie, setCookie } from "../components/utils/cookieHandler";

// Role codes for different entities
export const ROLE_CODES = {
    company: "3",
    institution: "4",
    // Add more roles here if needed
};

// Create Context
const GlobalKeysContext = createContext();

// Provider
export const GlobalKeysProvider = ({ children }) => {
    const [token, setToken] = useState("");
    const [role, setRole] = useState("");
    const [activeMode, setActiveMode] = useState("user"); // "user" | "company" | "institution"
    const [isAssignedUser, setIsAssignedUser] = useState(false);

    // Initialize from cookies
    useEffect(() => {
        const initToken = getCookie("TOKEN") || getCookie("VERIFIED_TOKEN");
        const initRole = getCookie("ROLE") || "";
        const initMode = getCookie("ACTIVE_MODE") || "user";
        const initAssigned = getCookie("ASSIGNED_USER") === "true";

        setToken(initToken?.replace(/^"|"$/g, "") || "");
        setRole(initRole);
        setActiveMode(initMode);
        setIsAssignedUser(initAssigned);
    }, []);

    // Setters that update both state and cookies
    const updateToken = (newToken) => {
        setToken(newToken);
        setCookie(activeMode === "user" ? "VERIFIED_TOKEN" : "TOKEN", newToken);
    };

    const updateRole = (newRole) => {
        setRole(newRole);
        setCookie("ROLE", newRole);
    };

    const updateActiveMode = (mode) => {
        setActiveMode(mode);
        setCookie("ACTIVE_MODE", mode);
    };

    const updateIsAssignedUser = (assigned) => {
        setIsAssignedUser(assigned);
        setCookie("ASSIGNED_USER", assigned);
    };

    const clearAll = () => {
        setToken("");
        setRole("");
        setActiveMode("user");
        setIsAssignedUser(false);
        removeCookie("VERIFIED_TOKEN");
        removeCookie("TOKEN");
        removeCookie("ROLE");
        removeCookie("ACTIVE_MODE");
        removeCookie("ASSIGNED_USER");
    };

    // Role check functions (global)
    const isCompany = () => activeMode === "company" && role === ROLE_CODES.company;
    const isInstitution = () => activeMode === "institution" && role === ROLE_CODES.institution;
    const isUser = () => activeMode === "user"; // user role optional
    useEffect(() => {
        // Sync state with cookies if they change externally
        const interval = setInterval(() => {
            const cookieRole = getCookie("ROLE");
            const cookieMode = getCookie("ACTIVE_MODE");
            const cookieToken = getCookie("TOKEN") || getCookie("VERIFIED_TOKEN");
            const cookieAssigned = getCookie("ASSIGNED_USER") === "true";

            if (cookieRole && cookieRole !== role) setRole(cookieRole);
            if (cookieMode && cookieMode !== activeMode) setActiveMode(cookieMode);
            if (cookieToken && cookieToken !== token) setToken(cookieToken);
            if (cookieAssigned !== isAssignedUser) setIsAssignedUser(cookieAssigned);
        }, 500);

        return () => clearInterval(interval);
    }, [role, activeMode, token, isAssignedUser]);

    return (
        <GlobalKeysContext.Provider
            value={{
                token,
                role,
                activeMode,
                isAssignedUser,
                updateToken,
                updateRole,
                updateActiveMode,
                updateIsAssignedUser,
                clearAll,
                isCompany,
                isInstitution,
                isUser,
            }}
        >
            {children}
        </GlobalKeysContext.Provider>
    );
};

// Custom hook to use context
export const useGlobalKeys = () => useContext(GlobalKeysContext);
