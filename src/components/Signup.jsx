import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Handle Input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Validate Email
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Password Strength Check
  const isStrongPassword = (password) =>
    password.length >= 6;

  // Submit Signup Form
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
        setErrors({ server: data.message });
        setLoading(false);
        return;
      }

      navigate("/login");
    } catch (error) {
      setErrors({ server: "Server error, try again later" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex justify-center items-center px-4">
      <div className="w-full md:w-[420px] bg-white/80 backdrop-blur-xl border border-blue-100 rounded-2xl shadow-lg p-8 text-center">

        <h1 className="text-3xl font-semibold text-blue-700 mb-2">
          Create Account ✨
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          Join <span className="font-semibold text-blue-600">ZenElegance</span>
        </p>

        {/* Server Error */}
        {errors.server && (
          <p className="text-red-600 mb-3 text-sm">{errors.server}</p>
        )}

        <form onSubmit={handleSignup} className="flex flex-col items-center space-y-4">

          <input
            name="name"
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-full border border-blue-200 bg-blue-50"
          />
          {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}

          <input
            name="email"
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-full border border-blue-200 bg-blue-50"
          />
          {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}

          <input
            name="password"
            type="password"
            placeholder="Create password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-full border border-blue-200 bg-blue-50"
          />
          {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}

          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-full border border-blue-200 bg-blue-50"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs">{errors.confirmPassword}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-blue-600 text-white py-3 rounded-full font-medium hover:bg-blue-700"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-medium">Login</Link>
        </p>

      </div>
    </div>
  );
}

export default Signup;
