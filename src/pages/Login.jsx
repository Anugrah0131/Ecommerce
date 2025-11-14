import React from "react";
import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex justify-center items-center px-4">
      {/* Login Card */}
      <div className="w-full md:w-[420px] bg-white/80 backdrop-blur-xl border border-blue-100 rounded-2xl shadow-lg p-8 text-center">
        
        {/* Title */}
        <h1 className="text-3xl font-semibold text-blue-700 mb-2">
          Welcome Back 👋
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          Log in to continue shopping with <span className="font-semibold text-blue-600">ZenElegance</span>
        </p>

        {/* Login Form */}
        <form className="flex flex-col items-center space-y-4">
          <input
            type="email"
            placeholder="Email address"
            className="w-full px-4 py-3 rounded-full border border-blue-200 bg-blue-50 focus:ring-2 focus:ring-blue-300 focus:outline-none text-gray-700 placeholder-gray-400 transition-all"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-full border border-blue-200 bg-blue-50 focus:ring-2 focus:ring-blue-300 focus:outline-none text-gray-700 placeholder-gray-400 transition-all"
          />

          {/* Login Button */}
          <button
            type="submit"
            className="w-full mt-4 bg-blue-600 text-white py-3 rounded-full font-medium hover:bg-blue-700 transition-all shadow-sm"
          >
            Login
          </button>
        </form>

        {/* Forgot Password */}
        <div className="mt-4">
          <a
            href="#"
            className="text-blue-500 hover:underline text-sm transition"
          >
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
          <Link
            to="/signup"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;


