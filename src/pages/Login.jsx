import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
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

      // Store JWT in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect to home or landing page
      navigate("/");

    } catch (error) {
      setLoading(false);
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex justify-center items-center px-4">
      {/* Login Card */}
      <div className="w-full md:w-[420px] bg-white/80 backdrop-blur-xl border border-blue-100 rounded-2xl shadow-lg p-8 text-center">

        <h1 className="text-3xl font-semibold text-blue-700 mb-2">
          Welcome Back 👋
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Log in to continue shopping with <span className="font-semibold text-blue-600">ZenElegance</span>
        </p>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-sm mb-3">{error}</p>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="flex flex-col items-center space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-full border border-blue-200 bg-blue-50 focus:ring-2 focus:ring-blue-300 focus:outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-full border border-blue-200 bg-blue-50 focus:ring-2 focus:ring-blue-300 focus:outline-none"
          />

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-blue-600 text-white py-3 rounded-full font-medium hover:bg-blue-700 transition-all"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Forgot Password */}
        <div className="mt-4">
          <a href="#" className="text-blue-500 hover:underline text-sm">
            Forgot your password?
          </a>
        </div>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-blue-100"></div>
          <span className="px-3 text-gray-400 text-sm">or</span>
          <div className="flex-1 h-px bg-blue-100"></div>
        </div>

        {/* Google Login */}
        <button className="w-full flex items-center justify-center border border-blue-200 rounded-full py-3 hover:bg-blue-50 transition-all">
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5 mr-2"
          />
          <span className="text-gray-700 text-sm font-medium">
            Continue with Google
          </span>
        </button>

        {/* Signup Option */}
        <p className="mt-6 text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600 font-medium hover:text-blue-700">
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;
