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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
    <div className="min-h-screen w-full bg-gradient-to-br from-[#f3f6ff] via-white to-[#eef2ff] flex items-center justify-center px-4">

      {/* Main Card */}
      <div className="w-full max-w-md bg-white/80 backdrop-blur-2xl border border-gray-200/50 shadow-[0_8px_25px_rgba(0,0,0,0.05)] rounded-2xl p-10">

        {/* Heading */}
        <h1 className="text-3xl font-semibold text-gray-800 text-center tracking-tight">
          Welcome Back 👋
        </h1>
        <p className="text-center text-gray-500 mt-1">
          Continue your journey with{" "}
          <span className="font-semibold text-indigo-600">Shop Ease</span>
        </p>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-center mt-4 text-sm">{error}</p>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="mt-8 space-y-5">

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-600 font-medium">Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              className="w-full px-5 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-indigo-300 outline-none transition shadow-sm"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-600 font-medium">Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className="w-full px-5 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-indigo-300 outline-none transition shadow-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-indigo-600 text-white font-medium shadow hover:bg-indigo-700 active:scale-95 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Forgot Password */}
        <div className="mt-4 text-center">
          <button className="text-sm text-indigo-500 hover:underline">
            Forgot your password?
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-3 text-gray-400 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Google Login */}
        <button className="w-full py-3 rounded-xl border border-gray-300 bg-white/70 backdrop-blur-md flex items-center justify-center gap-3 hover:bg-gray-50 transition shadow-sm">
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-5 h-5"
          />
          <span className="text-gray-700 font-medium text-sm">
            Continue with Google
          </span>
        </button>

        {/* Signup Link */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>

      </div>
    </div>
  );
}
