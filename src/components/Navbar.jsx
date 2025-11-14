import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, LogIn } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="w-full bg-white text-gray-800 py-4 px-6 shadow-sm flex justify-between items-center sticky top-0 z-50 border-b border-gray-100">
      
      {/* Brand */}
      <Link
        to="/"
        className="text-2xl font-bold tracking-tight text-blue-600 hover:text-blue-700 transition"
      >
        ShopEase
      </Link>

      {/* Search Bar */}
      <div className="hidden sm:flex items-center w-1/2 max-w-md border border-gray-200 rounded-full overflow-hidden shadow-sm">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full px-4 py-2 text-gray-700 focus:outline-none"
        />
        <button className="px-4 bg-blue-600 hover:bg-blue-700 text-white transition">
          <Search size={18} />
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center space-x-6">
        <Link
          to="/"
          className="text-gray-700 hover:text-blue-600 font-medium transition"
        >
          Home
        </Link>
        <Link
          to="/products"
          className="text-gray-700 hover:text-blue-600 font-medium transition"
        >
          Products
        </Link>
        <Link
          to="/contact"
          className="text-gray-700 hover:text-blue-600 font-medium transition"
        >
          Contact
        </Link>
        <Link
          to="/about"
          className="text-gray-700 hover:text-blue-600 font-medium transition"
        >
          About
        </Link>

        {/* Cart Button */}
        <button
          onClick={() => navigate("/cart")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-medium shadow-sm transition"
        >
          <ShoppingCart size={18} /> Cart
        </button>

        {/* Login Button */}
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-full font-medium shadow-sm transition"
        >
          <LogIn size={18} /> Login
        </button>
      </div>
    </nav>
  );
}

export default Navbar;




