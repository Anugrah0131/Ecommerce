import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, Camera } from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    fullName: "",
    phone: "",
    address: "",
    bio: "",
  });
  const [avatar, setAvatar] = useState(null); // base64 string
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedProfile = JSON.parse(localStorage.getItem("profile"));
    const storedAvatar = localStorage.getItem("avatar");

    if (!storedUser) return setUser(null);
    setUser(storedUser);

    if (storedProfile) setProfile(storedProfile);
    if (storedAvatar) setAvatar(storedAvatar);
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleAvatarPick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target.result;
      setAvatar(base64);
      localStorage.setItem("avatar", base64);
    };
    reader.readAsDataURL(file);
  };

  const triggerFile = () => fileInputRef.current?.click();

  const handleSave = () => {
    setLoading(true);
    try {
      localStorage.setItem("profile", JSON.stringify(profile));
      // avatar already saved on pick
      setLoading(false);
      // subtle UI feedback — could replace with toast later
      alert("Profile saved successfully");
    } catch (err) {
      setLoading(false);
      alert("Could not save profile. Try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // keep profile & avatar if you want, but here we clear them
    // localStorage.removeItem("profile");
    // localStorage.removeItem("avatar");
    navigate("/login");
  };
if (!user) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 
      bg-[radial-gradient(circle_at_20%_20%,#e8e9ff,#ffffff,#e6e9ff)] relative overflow-hidden">

      {/* floating background blobs */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-indigo-300/30 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-300/30 blur-3xl rounded-full"></div>

      <div className="relative w-full max-w-md p-10 rounded-3xl 
        backdrop-blur-2xl bg-white/60 border border-white/30 
        shadow-[0_8px_35px_rgba(0,0,0,0.08)]">

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500
            rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white text-3xl">!</span>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          No User Found
        </h2>

        <p className="text-center text-gray-600 mt-3 leading-relaxed">
          You need to be logged in to access your profile.  
          Please sign in to continue your journey.
        </p>

        {/* button */}
        <div className="mt-6 flex justify-center">
          <Link
            to="/login"
            className="px-6 py-3 rounded-xl font-semibold text-white 
              bg-gradient-to-r from-indigo-600 to-purple-600 
              shadow-lg hover:shadow-xl hover:scale-[1.03] 
              transition-transform duration-300"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
}


  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#eef2ff] via-white to-[#e9f0ff] flex items-start justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-xl bg-white/70 backdrop-blur-md border border-gray-200/40 rounded-2xl shadow-lg p-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Your Profile</h1>
            <p className="text-sm text-gray-500">Manage your account and personal info</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg hover:bg-gray-100 transition"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-gray-700">Logout</span>
          </button>
        </div>

        {/* Profile top */}
        <div className="mt-6 flex flex-col items-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-indigo-200 to-indigo-50 p-1">
              <div className="w-full h-full rounded-full bg-white overflow-hidden flex items-center justify-center shadow-inner">
                {avatar ? (
                  <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-indigo-500 text-xl font-medium">{user.email?.charAt(0).toUpperCase()}</div>
                )}
              </div>
            </div>

            <button
              onClick={triggerFile}
              className="absolute right-0 bottom-0 transform translate-x-1/4 translate-y-1/4 bg-white border border-gray-200 rounded-full p-2 shadow hover:scale-105 transition"
              title="Change avatar"
            >
              <Camera className="w-4 h-4 text-gray-700" />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarPick}
            />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-gray-800">{profile.fullName || user.name || "Your Name"}</h2>
          <p className="text-sm text-gray-500 mt-1">{profile.bio || "Tell us something about yourself..."}</p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4">
          {/* Email (readonly) */}
          <div>
            <label className="text-xs text-gray-600 font-medium">Email</label>
            <input
              readOnly
              value={user.email}
              className="w-full mt-2 px-4 py-3 rounded-xl border bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Full name */}
          <div>
            <label className="text-xs text-gray-600 font-medium">Full Name</label>
            <input
              name="fullName"
              value={profile.fullName}
              onChange={handleChange}
              placeholder="Your full name"
              className="w-full mt-2 px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-200 outline-none"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-xs text-gray-600 font-medium">Phone</label>
            <input
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              placeholder="e.g. +91 98765 43210"
              className="w-full mt-2 px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-200 outline-none"
            />
          </div>

          {/* Address */}
          <div>
            <label className="text-xs text-gray-600 font-medium">Address</label>
            <textarea
              name="address"
              value={profile.address}
              onChange={handleChange}
              rows={2}
              placeholder="Your address"
              className="w-full mt-2 px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-200 outline-none"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="text-xs text-gray-600 font-medium">Bio</label>
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              rows={2}
              placeholder="A short bio to show on your profile"
              className="w-full mt-2 px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-200 outline-none"
            />
          </div>

          <div className="flex gap-3 mt-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 active:scale-95 transition"
            >
              {loading ? "Saving..." : "Save Profile"}
            </button>

            <button
              onClick={() => {
                // revert changes from storage
                const storedProfile = JSON.parse(localStorage.getItem("profile")) || { fullName: "", phone: "", address: "", bio: "" };
                setProfile(storedProfile);
              }}
              className="py-3 px-4 rounded-xl border border-gray-300 bg-white font-medium hover:bg-gray-50 transition"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Want to edit account settings? <Link to="/settings" className="text-indigo-600 font-semibold hover:underline">Go to Settings</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
