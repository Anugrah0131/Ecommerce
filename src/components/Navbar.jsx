import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="w-full bg-blue-500 text-white flex justify-between items-center px-8 py-4 shadow-md">
      {/* Left - Logo */}
      <div className="w-[20%]">
        <h1 className="text-2xl font-bold">Ecommerce</h1>
      </div>

      {/* Middle - Search Bar */}
      <div className="w-[40%] px-4">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full p-2 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>

      {/* Right - Navigation Links */}
      <div className="w-[40%]">
        <ul className="flex justify-evenly items-center gap-6 text-lg font-medium">
          <li className="cursor-pointer hover:text-yellow-300">Home</li>
          
          <li className="cursor-pointer hover:text-yellow-300"><Link to={"/products"}>Products</Link></li>
          <li className="cursor-pointer hover:text-yellow-300">About</li>
          <li className="cursor-pointer hover:text-yellow-300">Contact</li>
        </ul>
      </div>
    </div>
  );
}

