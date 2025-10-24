import React, { useState,useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Upload,
  Save,
  Camera,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import UserDropdown from "../components/UserDropdown";

const Profile = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
    profileImage: null,
  });

  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);

  const avatarOptions = [
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Iron-Man",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Captain-America",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Thor",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Hulk",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Black-Widow",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Hawkeye",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Spider-Man",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Doctor-Strange",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Black-Panther",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Scarlet-Witch",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Loki",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Groot",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Star-Lord",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Gamora",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Thanos",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Wolverine",
  ];

  useEffect(() => {
  const fetchProfile = async () => {
    const token = localStorage.getItem("token"); 
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/users/profile", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch profile");

      const data = await res.json();
      setProfileData({
        fullName: data.username || "",
        email: data.email || "",
        phone: data.phone || "",
        profileImage: data.profileImage || null,
      });
      setPreviewImage(data.profileImage || null);
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Could not load profile" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  fetchProfile();
}, []);


const handleAvatarSelect = (avatarUrl) => {
  setPreviewImage(avatarUrl);
  setShowAvatarSelector(false);
  setMessage({ type: "success", text: "Avatar selected successfully!" });
  setTimeout(() => setMessage({ type: "", text: "" }), 2000);
};

  // const handleStatementUpload = (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;
  //   if (file.size > 10 * 1024 * 1024)
  //     return setMessage({ type: "error", text: "File must be < 10MB" });
  //   if (!["application/pdf", "text/csv", "application/vnd.ms-excel"].includes(file.type))
  //     return setMessage({ type: "error", text: "Only PDF or CSV allowed" });

  //   const newStatement = {
  //     id: uploadedStatements.length + 1,
  //     fileName: file.name,
  //     uploadDate: new Date().toISOString().split("T")[0],
  //     size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
  //   };

  //   setUploadedStatements((prev) => [newStatement, ...prev]);
  //   setMessage({ type: "success", text: "Statement uploaded successfully!" });
  //   setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  // };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setTimeout(() => {
  //     setLoading(false);
  //     setMessage({ type: "success", text: "Profile updated successfully!" });
  //     setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  //   }, 1000);
  // };

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-200">
      {/* ✅ SAME NAVBAR AS CHAT COMPONENT */}
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
            {/* Left - Profile Image */}
            <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6 flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center overflow-hidden">
                  {previewImage ? (
                    <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="h-16 w-16 text-white" />
                  )}
                </div>
                {/* <label
                  htmlFor="profile-image"
                  className="absolute bottom-0 right-0 bg-emerald-500 rounded-full p-2 cursor-pointer hover:bg-emerald-600 transition-colors"
                >
                  <Camera className="h-4 w-4 text-white" />
                  <input
                    id="profile-image"
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleImageUpload}
                  />
                </label> */}
              </div>
              {errors.profileImage && (
                <p className="text-red-400 text-sm mb-2">{errors.profileImage}</p>
              )}

              <button
                onClick={() => setShowAvatarSelector(!showAvatarSelector)}
                className="mb-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-lg transition-colors"
              >
                Choose Random Avatar
              </button>

              {showAvatarSelector && (
                <div className="w-full mb-4 p-4 bg-gray-900 rounded-lg border border-gray-700">
                  <p className="text-xs text-gray-400 mb-3 text-center">Select an avatar</p>
                  <div className="grid grid-cols-3 gap-3">
                    {avatarOptions.map((avatar, i) => (
                      <div
                        key={i}
                        onClick={() => handleAvatarSelect(avatar)}
                        className="w-16 h-16 rounded-full overflow-hidden cursor-pointer border-2 border-gray-700 hover:border-emerald-500 transition-all transform hover:scale-110"
                      >
                        <img src={avatar} alt={`Avatar ${i + 1}`} className="w-full h-full" />
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

                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <User className="inline h-4 w-4 mr-2" /> Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={profileData.fullName}
                      onChange={(e) =>
                        setProfileData({ ...profileData, fullName: e.target.value })
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
                        setProfileData({ ...profileData, email: e.target.value })
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
                        setProfileData({ ...profileData, phone: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-200"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Save className="h-5 w-5" />
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </form>
              </div>

              {/* Bank Statements */}
              <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
                <h2 className="text-2xl font-semibold mb-6 text-emerald-400">
                  Bank Statements
                </h2>
                <label
                  htmlFor="statement-upload"
                  className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-emerald-500 transition-colors bg-gray-900/50"
                >
                  <div className="text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-300 mb-1">
                      Click to upload bank statement
                    </p>
                    <p className="text-xs text-gray-500">PDF or CSV (Max 10MB)</p>
                  </div>
                  <input
                    id="statement-upload"
                    type="file"
                    className="hidden"
                    accept=".pdf,.csv"
                    // onChange={handleStatementUpload}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
