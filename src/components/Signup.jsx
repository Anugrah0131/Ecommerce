import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Send } from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | success | error

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isStrongPassword = (password) => password.length >= 6;

  const handleSignup = async (e) => {
    e.preventDefault();
    let err = {};

    if (!form.name.trim()) err.name = "Name is required";
    if (!isValidEmail(form.email)) err.email = "Enter a valid email";
    if (!isStrongPassword(form.password))
      err.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword)
      err.confirmPassword = "Passwords do not match";

    setErrors(err);
    if (Object.keys(err).length !== 0) return;

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrors({ server: data.message || "Signup failed" });
        setStatus("error");
        showToast("Signup failed!", "error");
        setLoading(false);
        return;
      }

      setStatus("success");
      showToast("Account created successfully!", "success");
      setForm({ name: "", email: "", password: "", confirmPassword: "" });

      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      setErrors({ server: "Server error, try again later" });
      setStatus("error");
      showToast("Server error!", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = "success") => {
    const toast = document.createElement("div");
    toast.className = `
      fixed top-5 right-5 px-5 py-3 rounded-xl shadow-xl z-50
      text-white font-semibold animate-slide
      ${type === "success" ? "bg-green-600" : "bg-red-600"}
    `;
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#f3f6ff] via-white to-[#eef2ff] flex justify-center items-center px-4">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/80 backdrop-blur-2xl border border-gray-200/50 shadow-[0_8px_25px_rgba(0,0,0,0.05)] rounded-2xl p-10"
      >

        {/* Title */}
        <h1 className="text-3xl font-semibold text-gray-800 text-center tracking-tight">
          Create Account ✨
        </h1>
        <p className="text-center text-gray-500 mt-1">
          Join{" "}
          <span className="text-indigo-600 font-semibold">Shop Ease</span>
        </p>

        {errors.server && (
          <p className="text-red-600 text-center mt-4 text-sm">
            {errors.server}
          </p>
        )}

        {/* Form */}
        <form
          onSubmit={handleSignup}
          className="mt-8 flex flex-col gap-5"
        >
          {/* Name */}
          <div>
            <label className="text-sm text-gray-600 font-medium">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              className={`w-full px-5 py-3 rounded-xl border ${
                errors.name ? "border-rose-400" : "border-gray-300"
              } bg-gray-50 focus:ring-2 focus:ring-indigo-300 outline-none transition shadow-sm`}
            />
            {errors.name && (
              <p className="text-rose-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-600 font-medium">Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              className={`w-full px-5 py-3 rounded-xl border ${
                errors.email ? "border-rose-400" : "border-gray-300"
              } bg-gray-50 focus:ring-2 focus:ring-indigo-300 outline-none transition shadow-sm`}
            />
            {errors.email && (
              <p className="text-rose-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-600 font-medium">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className={`w-full px-5 py-3 rounded-xl border ${
                errors.password ? "border-rose-400" : "border-gray-300"
              } bg-gray-50 focus:ring-2 focus:ring-indigo-300 outline-none transition shadow-sm`}
            />
            {errors.password && (
              <p className="text-rose-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-sm text-gray-600 font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={handleChange}
              className={`w-full px-5 py-3 rounded-xl border ${
                errors.confirmPassword ? "border-rose-400" : "border-gray-300"
              } bg-gray-50 focus:ring-2 focus:ring-indigo-300 outline-none transition shadow-sm`}
            />
            {errors.confirmPassword && (
              <p className="text-rose-500 text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.97 }}
            className="w-full mt-2 bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 active:scale-95 transition flex justify-center items-center gap-2 shadow"
          >
            {status === "success" ? (
              <>
                <Check size={18} /> Created
              </>
            ) : (
              <>
                <Send size={18} /> {loading ? "Creating..." : "Sign Up"}
              </>
            )}
          </motion.button>
        </form>

        {/* Already have account */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
