import React, { useState, useRef, useEffect } from "react";
import { convertTimestampToDate } from "../../components/utils/globalFunction";
import { BiDotsHorizontal } from "react-icons/bi";

const ContactItem = React.memo(
  ({ contact, isSelected, onClick, onDelete }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
          setMenuOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    return (
      <div
        className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
          isSelected ? "bg-blue-50 border-r-2 border-blue-500" : ""
        }`}
        onClick={() => onClick(contact)}
      >
        {/* Avatar */}
        <div className="relative">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center overflow-hidden shadow-md
             ${
               contact?.isBlocked
                 ? "bg-gradient-to-br from-gray-400 to-gray-600"
                 : "bg-gradient-to-br from-blue-400 to-blue-600"
             }`}
          >
            {contact?.profile_picture_url ? (
              <img
                src={contact.profile_picture_url}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "/0684456b-aa2b-4631-86f7-93ceaf33303c.png";
                }}
              />
            ) : (
              <span className="text-white text-sm font-semibold">
                <img
                  src="/0684456b-aa2b-4631-86f7-93ceaf33303c.png"
                  alt="default logo"
                />
              </span>
            )}
          </div>
          {contact.unread > 0 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow-sm">
              <span className="text-white text-xs font-medium">
                {contact.unread}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="ml-3 flex-1 min-w-0">
          <div className="flex items-center justify-between relative" ref={menuRef}>
            <h3 className="text-sm font-medium text-[#000000E6] truncate capitalize">
              {contact.first_name} {contact?.last_name}
              {contact?.isBlocked && (
                <span className="ml-2 text-xs text-red-500">(Blocked)</span>
              )}
            </h3>
            <span className="text-xs text-gray-500">
              {convertTimestampToDate(contact.latestMessageTime)}
            </span>

            {/* Dots menu toggle */}
            <button
              className="ml-2 p-1 rounded-full hover:bg-gray-200"
              onClick={(e) => {
                e.stopPropagation(); // prevent parent onClick
                setMenuOpen((prev) => !prev);
              }}
            >
              <BiDotsHorizontal />
            </button>

            {/* Dropdown menu */}
            {menuOpen && (
              <div className="absolute right-0 top-6 w-28 bg-white border rounded-lg shadow-lg z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(contact); // Call delete function
                    setMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-t-lg"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          <p
            className={`text-sm truncate mt-1 ${
              contact?.isBlocked
                ? "text-gray-400 italic"
                : "text-gray-600"
            }`}
          >
            {contact?.isBlocked
              ? "You have blocked this user"
              : contact.latestMessage || "No messages yet"}
          </p>
        </div>
      </div>
    );
  }
);

export default ContactItem;
