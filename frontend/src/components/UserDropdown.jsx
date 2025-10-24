import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

const UserDropdown = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const token = localStorage.getItem("token");
  let username = "User";
  if (token) {
    try {
      const decoded = jwtDecode(token);
      username = decoded.username;
    } catch (err) {
      console.log("invalid token(frontend)", err);
    }
  }

  const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 focus:outline-none"
      >
        <div className="w-10 h-10 flex items-center justify-center rounded-full hover:text-emerald-400 transition-colors">
          <span className="material-symbols-outlined text-grey text-4xl hover:text-emerald-400 transition-colors">
            account_circle
          </span>
        </div>
        <span className="text-lg font-medium text-gray-300 hover:text-emerald-400 transition-colors">
          {username ? capitalizeFirst(username) : "User"}
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-2 mt-2 w-40 bg-gray-800 rounded-md shadow-lg border border-gray-700 z-50">
          <button
            onClick={handleProfile}
            className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            Profile
          </button>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
