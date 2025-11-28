import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        setError(data.message);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");

    } catch (error) {
      setLoading(false);
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center px-4">

      {/* Card */}
      <div className="w-full max-w-md bg-white/60 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/50 px-10 py-12">

        {/* Title */}
        <h1 className="text-4xl font-bold text-blue-700 text-center">Welcome Back</h1>
        <p className="text-center text-gray-500 mt-2">
          Sign in to continue shopping with{" "}
          <span className="font-semibold text-blue-600">ZenElegance</span>
        </p>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-center mt-4 text-sm">{error}</p>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="mt-8 space-y-5">

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className="w-full px-5 py-3 rounded-xl border border-blue-200 bg-blue-50/40 backdrop-blur-sm shadow-sm focus:ring-2 focus:ring-blue-300 outline-none transition"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-5 py-3 rounded-xl border border-blue-200 bg-blue-50/40 backdrop-blur-sm shadow-sm focus:ring-2 focus:ring-blue-300 outline-none transition"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-medium shadow-md hover:bg-blue-700 active:scale-95 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Forgot password */}
        <div className="mt-4 text-center">
          <button className="text-sm text-blue-500 hover:underline">
            Forgot your password?
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-blue-200"></div>
          <span className="px-3 text-gray-400 text-sm">or</span>
          <div className="flex-1 h-px bg-blue-200"></div>
        </div>

        {/* Google login */}
        <button className="w-full py-3 rounded-xl border border-blue-200 bg-white/60 backdrop-blur-md flex items-center justify-center gap-3 hover:bg-blue-50 transition">
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-5 h-5"
          />
          <span className="text-gray-700 font-medium text-sm">
            Continue with Google
          </span>
        </button>

        {/* Signup */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600 font-semibold hover:underline">
            Sign Up
          </Link>
        </p>

      </div>
    </div>
  );
}
