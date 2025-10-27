import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="w-full bg-blue-400 text-white py-6 px-8 flex justify-between items-center shadow-md">
      {/* Logo / Brand Name */}
      <Link to="/" className="text-xl font-bold hover:text-gray-200">
        Zen elagance
      </Link>
       <div>
        <input type="text"
        placeholder="Search products" 
        id="search"
        className="rounded-md w-[full] px-2 py-2 bg-white text-black"/>
       </div>

      {/* Navigation Links */}
      <div className="space-x-6">
        <Link
          to="/"
          className="hover:text-gray-200 transition duration-200"
        >
          Home
        </Link>
        <Link
          to="/products"
          className="hover:text-gray-200 transition duration-200"
        >
          Products
        </Link>
        <Link
          to="/contact"
          className="hover:text-gray-200 transition duration-200"
        >
          Contact
        </Link>
        <Link
          to="/about"
          className="hover:text-gray-200 transition duration-200"
        >
          About
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;


