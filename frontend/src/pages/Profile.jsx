import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Upload,
  Save,
  CheckCircle,
  AlertCircle,
  FileText,
  Loader2,
  Paperclip, 
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import UserDropdown from "../components/UserDropdown.jsx";

const Profile = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false); // For profile save
  const [statementLoading, setStatementLoading] = useState(false); // ✅ ADDED: For statement upload
  const [message, setMessage] = useState({ type: "", text: "" });
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
    profileImage: null,
    bankStatementUrl: "", // ✅ ADDED: To store the file URL
  });

  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null); // ✅ ADDED: To hold the file before upload

  const avatarOptions = [
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Iron-Man",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Captain-America",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Thor",
    // ... rest of your avatars
  ];

  // ✅ UPDATED: Fetches bankStatementUrl as well
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            localStorage.clear();
            navigate("/");
          }
          throw new Error("Failed to fetch profile");
        }

        const data = await res.json();
        
        // Ensure all fields from the profile response are set in the state
        setProfileData({
          fullName: data.username || "",
          email: data.email || "",
          phone: data.phone || "",
          profileImage: data.profileImage || null,
          bankStatementUrl: data.bankStatementUrl || "", // This ensures the URL is loaded on page load
        });
        setPreviewImage(data.profileImage || null);
      } catch (err) {
        console.error(err);
        setMessage({ type: "error", text: "Could not load profile" });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleAvatarSelect = (avatarUrl) => {
    setPreviewImage(avatarUrl);
    setShowAvatarSelector(false);
    setMessage({ type: "success", text: "Avatar selected successfully!" });
    setTimeout(() => setMessage({ type: "", text: "" }), 2000);
  };

  // ✅ NEW: This function just selects the file and validates it
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setSelectedFile(null);
      return;
    }

    // --- Validation ---
    if (file.size > 10 * 1024 * 1024) {
      setMessage({ type: "error", text: "File must be < 10MB" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      e.target.value = null; // Reset file input
      setSelectedFile(null);
      return;
    }
    if (
      !["application/pdf", "text/csv", "application/vnd.ms-excel"].includes(
        file.type
      )
    ) {
      setMessage({ type: "error", text: "Only PDF or CSV allowed" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      e.target.value = null; // Reset file input
      setSelectedFile(null);
      return;
    }
    // ------------------

    // File is valid, store it in state
    setSelectedFile(file);
    setMessage({ type: "success", text: `File selected: ${file.name}` });
    setTimeout(() => setMessage({ type: "", text: "" }), 4000);
  };

  // ✅ UPDATED: This function is now triggered by the BUTTON CLICK
  const handleStatementUpload = async () => {
    // Check if a file is actually selected
    if (!selectedFile) {
      setMessage({ type: "error", text: "Please select a file first." });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      return;
    }

    const formData = new FormData();
    // Use "file" to match your backend: upload.single("file")
    formData.append("file", selectedFile);

    const token = localStorage.getItem("token");
    setStatementLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Call your new PUT endpoint
      const res = await fetch("http://localhost:5000/users/replace-statement", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          // No "Content-Type" needed, browser sets it for FormData
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to replace statement");
      }

      // Success! Update state and show message
      setProfileData((prev) => ({
        ...prev,
        bankStatementUrl: data.bankStatementUrl,
      }));
      setMessage({
        type: "success",
        text: "Statement replaced successfully!",
      });
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: err.message || "Could not replace statement",
      });
    } finally {
      setStatementLoading(false);
      setSelectedFile(null); // ✅ Clear the selected file
      // Reset the file input
      const fileInput = document.getElementById("statement-upload");
      if (fileInput) fileInput.value = null;
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  // ✅ NEW: Implemented the profile save logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    const token = localStorage.getItem("token");

    const { fullName, email, phone } = profileData;
    const body = {
      fullName,
      email,
      phone,
      profileImage: previewImage, // Send the avatar URL
    };

    try {
      const res = await fetch("http://localhost:5000/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      // Success! Update state and show message
      setProfileData({
        ...profileData,
        fullName: data.username,
        email: data.email,
        phone: data.phone,
        profileImage: data.profileImage,
      });
      setPreviewImage(data.profileImage);
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: err.message || "Could not update profile",
      });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-200">
      {/* --- Your Original Navbar (Unchanged) --- */}
      <header className="bg-slate-900/70 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="#" className="flex items-center gap-2">
            <div className="w-6 h-6 text-emerald-400">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h1 className="text-lg font-bold text-emerald-400">FinWell</h1>
          </Link>
        </div>

        <nav className="flex items-center gap-6">
          <Link
            to="/dashboard"
            className="text-sm font-medium text-gray-300 hover:text-emerald-400 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            to="/chat"
            className="text-sm font-medium text-gray-300 hover:text-emerald-400 transition-colors"
          >
            Chatbot
          </Link>

          <button
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
            className="text-sm font-medium text-gray-300 hover:text-emerald-400 transition-colors"
          >
            Logout
          </button>
        </nav>
        <UserDropdown />
      </header>

      {/* ✅ Profile Page Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center text-emerald-400">
            User Profile
          </h1>

          {/* --- Message Bar (Unchanged) --- */}
          {message.text && (
            <div
              className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                message.type === "success"
                  ? "bg-green-900/30 border border-green-700"
                  : "bg-red-900/30 border border-red-700"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-400" />
              )}
              <span
                className={
                  message.type === "success" ? "text-green-400" : "text-red-400"
                }
              >
                {message.text}
              </span>
            </div>
          )}

          {/* 💠 Profile Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* --- Profile Image Section (Unchanged) --- */}
            <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6 flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center overflow-hidden">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-16 w-16 text-white" />
                  )}
                </div>
              </div>
              {errors.profileImage && (
                <p className="text-red-400 text-sm mb-2">
                  {errors.profileImage}
                </p>
              )}

              <button
                onClick={() => setShowAvatarSelector(!showAvatarSelector)}
                className="mb-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-lg transition-colors"
              >
                Choose Random Avatar
              </button>

              {showAvatarSelector && (
                <div className="w-full mb-4 p-4 bg-gray-900 rounded-lg border border-gray-700">
                  <p className="text-xs text-gray-400 mb-3 text-center">
                    Select an avatar
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {avatarOptions.map((avatar, i) => (
                      <div
                        key={i}
                        onClick={() => handleAvatarSelect(avatar)}
                        className="w-16 h-16 rounded-full overflow-hidden cursor-pointer border-2 border-gray-700 hover:border-emerald-500 transition-all transform hover:scale-110"
                      >
                        <img
                          src={avatar}
                          alt={`Avatar ${i + 1}`}
                          className="w-full h-full"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <h2 className="text-xl font-bold text-gray-200 mb-1">
                {profileData.fullName}
              </h2>
              <p className="text-sm text-gray-400 mb-4">{profileData.email}</p>
            </div>

            {/* Right - Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Personal Info */}
              <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
                <h2 className="text-2xl font-semibold mb-6 text-emerald-400">
                  Personal Information
                </h2>

                {/* ✅ UPDATED: Added onSubmit */}
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <User className="inline h-4 w-4 mr-2" /> Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={profileData.fullName}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          fullName: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Mail className="inline h-4 w-4 mr-2" /> Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          email: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Phone className="inline h-4 w-4 mr-2" /> Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          phone: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-200"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {/* ✅ UPDATED: Added loading state */}
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Save className="h-5 w-5" />
                    )}
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </form>
              </div>

              {/* Bank Statements */}
              {/* ✅ UPDATED: This whole section is modified */}
              <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
                <h2 className="text-2xl font-semibold mb-6 text-emerald-400">
                  Bank Statements
                </h2>

                {/* Show current statement if it exists */}
                {profileData.bankStatementUrl && (
                  <div className="mb-4 p-4 bg-gray-900 border border-gray-700 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-emerald-400" />
                      <span className="text-sm text-gray-300">
                        Current Bank Statement
                      </span>
                    </div>
                    <a
                      href={profileData.bankStatementUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-emerald-400 hover:text-emerald-300 hover:underline"
                    >
                      View File
                    </a>
                  </div>
                )}

                {/* File Input Box */}
                <label
                  htmlFor="statement-upload"
                  className={`flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-emerald-500 transition-colors bg-gray-900/50 ${
                    statementLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <div className="text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-300 mb-1">
                      Click to{" "}
                      {profileData.bankStatementUrl
                        ? "select file to replace"
                        : "select file to upload"}
                    </p>
                    <p className="text-xs text-gray-500">
                      PDF or CSV (Max 10MB)
                    </p>
                  </div>
                  <input
                    id="statement-upload"
                    type="file"
                    className="hidden"
                    accept=".pdf,.csv,application/vnd.ms-excel"
                    disabled={statementLoading}
                    // ✅ UPDATED: Points to the new file select handler
                    onChange={handleFileSelect}
                  />
                </label>

                {/* ✅ ADDED: Show selected file name and the upload button */}
                {selectedFile && !statementLoading && (
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Paperclip className="h-4 w-4" />
                      <span>{selectedFile.name}</span>
                    </div>
                    <button
                      onClick={handleStatementUpload}
                      disabled={statementLoading}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Upload className="h-5 w-5" />
                      Upload File
                    </button>
                  </div>
                )}
                
                {/* ✅ ADDED: Show loading state separately */}
                {statementLoading && (
                   <div className="mt-4 flex items-center justify-center">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Uploading, please wait...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;

