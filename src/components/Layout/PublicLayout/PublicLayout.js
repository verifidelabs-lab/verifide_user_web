import React, {
  lazy,
  Suspense,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import sideBarJson from "./Sidebar/Sidebar.json";
import { useDispatch, useSelector } from "react-redux";

const Sidebar = lazy(() => import("./Sidebar/Sidebar"));
const Header = lazy(() => import("./Header/Header"));
const PageNotFound = lazy(() => import("../../Not found/PageNotFound"));

function PublicLayout({ children }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const sidebarRef = useRef(null);
  const [navbarOpen, setNavbarOpen] = useState(true);
  const [setIsOpen] = useState(false);

  const [unreadCounts, setUnreadCounts] = useState({
    notifications: 0,
    messages: 0,
  });

  const openLogout = () => {
    setIsOpen(true);
  };

  // Collapse sidebar automatically on screens < 1500px
  useLayoutEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1500) {
        setNavbarOpen(false);
      } else {
        setNavbarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
// 🔥 Auto close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!navbarOpen) return; // already closed

      // If click is outside sidebar
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setNavbarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [navbarOpen]);
  return (
    <div className="flex h-screen overflow-hidden">

      {/* === SIDEBAR === */}
      <div
       ref={sidebarRef}
        className={`
          h-full transition-all duration-300 
          ${navbarOpen ? "w-72" : "w-0"} 
          md:relative 
          absolute z-20   shadow-lg
        `}
      >
        <Sidebar
          openLogout={openLogout}
          setNavbarOpen={setNavbarOpen}
          navbarOpen={navbarOpen}
          unreadCounts={unreadCounts}
        />
      </div>

      {/* === MAIN LAYOUT AREA === */}
      <div
        className={`
          flex flex-col h-full transition-all duration-300 
          ${navbarOpen ? "flex-1 md:ml-0" : "w-full"}
          overflow-hidden
        `}
      >
        {/* Header receives toggle function */}
        <Header
          openLogout={openLogout}
          sideBarJson={sideBarJson}
          setNavbarOpen={setNavbarOpen}
          navbarOpen={navbarOpen}
        />

        {/* Scrollable center area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar glassy-card">
          {children}
        </main>
      </div>
    </div>
  );
}

export default PublicLayout;
