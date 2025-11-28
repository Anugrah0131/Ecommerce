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
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex justify-center items-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full md:w-[420px] bg-white/80 backdrop-blur-xl border border-blue-100 rounded-2xl shadow-lg p-8 text-center"
      >
        <h1 className="text-3xl font-semibold text-blue-700 mb-2">
          Create Account ✨
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Join <span className="font-semibold text-blue-600">ZenElegance</span>
        </p>

        {errors.server && (
          <p className="text-red-600 mb-3 text-sm">{errors.server}</p>
        )}

        <form onSubmit={handleSignup} className="flex flex-col items-center gap-4">
          {/** Name */}
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-full border ${
              errors.name ? "border-rose-400" : "border-blue-200"
            } bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300 transition`}
          />
          {errors.name && <p className="text-rose-500 text-xs">{errors.name}</p>}

          {/** Email */}
          <input
            name="email"
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-full border ${
              errors.email ? "border-rose-400" : "border-blue-200"
            } bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300 transition`}
          />
          {errors.email && <p className="text-rose-500 text-xs">{errors.email}</p>}

          {/** Password */}
          <input
            name="password"
            type="password"
            placeholder="Create password"
            value={form.password}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-full border ${
              errors.password ? "border-rose-400" : "border-blue-200"
            } bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300 transition`}
          />
          {errors.password && <p className="text-rose-500 text-xs">{errors.password}</p>}

          {/** Confirm Password */}
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm password"
            value={form.confirmPassword}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-full border ${
              errors.confirmPassword ? "border-rose-400" : "border-blue-200"
            } bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300 transition`}
          />
          {errors.confirmPassword && (
            <p className="text-rose-500 text-xs">{errors.confirmPassword}</p>
          )}

          {/** Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.97 }}
            className="w-full mt-4 bg-blue-600 text-white py-3 rounded-full font-medium hover:bg-blue-700 shadow-md transition flex justify-center items-center gap-2"
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

        <p className="mt-6 text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-medium">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
