import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, LogIn } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="
      w-full 
      bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 
      text-white 
      px-6 sm:px-10 py-4 
      shadow-lg 
      backdrop-blur-md
      sticky top-0 z-50
      flex flex-col md:flex-row items-center justify-between gap-4
    ">

      {/* Brand */}
      <Link
        to="/"
        className="text-3xl font-extrabold tracking-wide drop-shadow-sm"
      >
        <span className="text-yellow-300">Shop</span>Ease
      </Link>

     {/* Search Bar */}
<div
  className="
    flex items-center 
    w-full md:w-[40%]
    bg-white/20 
    backdrop-blur-lg
    border border-white/30
    rounded-full 
    shadow-lg
    overflow-hidden
  "
>
  <input
    type="text"
    placeholder="Search products..."
    className="
      w-full 
      px-4 py-2
      bg-transparent
      text-white 
      placeholder-white/70
      focus:outline-none 
      focus:ring-0 
      text-sm sm:text-base
    "
  />
  <button
    className="
      bg-yellow-400 hover:bg-yellow-300 
      text-black 
      p-2 
      rounded-full 
      m-1
      transition
    "
  >
    <Search size={16} />
  </button>
</div>
      {/* Links & Buttons */}
      <div className="flex items-center gap-4 sm:gap-6 text-lg font-medium">

        <Link to="/" className="hover:text-yellow-300 transition-all">
          Home
        </Link>

        <Link to="/products" className="hover:text-yellow-300 transition-all">
          Products
        </Link>

        <Link to="/contact" className="hover:text-yellow-300 transition-all">
          Contact
        </Link>

        <Link to="/about" className="hover:text-yellow-300 transition-all">
          About
        </Link>

        {/* Cart Button */}
        <button
          onClick={() => navigate("/cart")}
          className="
            flex items-center gap-2 
            bg-yellow-400 text-black 
            hover:bg-yellow-300 
            px-4 py-2 
            rounded-full
            font-semibold 
            shadow-md 
            transition
          "
        >
          <ShoppingCart size={18} /> Cart
        </button>

        {/* Login Button */}
        <button
          onClick={() => navigate("/login")}
          className="
            flex items-center gap-2 
            border border-yellow-300 
            text-yellow-300 
            hover:bg-yellow-300 hover:text-black 
            px-4 py-2 
            rounded-full
            font-semibold 
            shadow-md 
            transition
          "
        >
          <LogIn size={18} /> Login
        </button>

      </div>
    </nav>
  );
}

export default Navbar;






