import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar"; // ✅ Import Navbar
export default function Home() {
  return (
    <>
      {/* ✅ Navbar appears above */}
      <Navbar />

      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Welcome to Our Store 🛍️
        </h1>
        <p className="text-gray-600 mb-6 text-sm md:text-base">
          Find the best products at unbeatable prices.
        </p>

        <Link
          to="/products"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Shop Now
        </Link>
      </div>
    </>
  );
}

