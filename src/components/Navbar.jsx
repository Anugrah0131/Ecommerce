import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, LogIn } from "lucide-react";
import AddToCart from "./AddToCartButton.jsx";


function Navbar() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // LIVE SEARCH FETCH (DEBOUNCED)
  const fetchSuggestions = async (value) => {
    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8080/api/products/search?q=${value}`
      );
      const data = await res.json();
      setSuggestions(data);
    } catch (error) {
      console.log("Error fetching suggestions:", error);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchSuggestions(query);
    }, 300); // debounce

    return () => clearTimeout(timeout);
  }, [query]);

  // SEARCH PAGE REDIRECT
  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    navigate(`/search?q=${query}`);
    setShowDropdown(false);
  };

  return (
    <nav
      className="
      w-full 
      bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 
      text-white 
      px-6 sm:px-10 py-4 
      shadow-lg 
      backdrop-blur-md
      sticky top-0 z-50
      flex flex-col md:flex-row items-center justify-between gap-4
    "
    >
      {/* Brand */}
      <Link
        to="/"
        className="text-3xl font-extrabold tracking-wide drop-shadow-sm"
      >
        <span className="text-yellow-300">Shop</span>Ease
      </Link>

      {/* SEARCH BAR + DROPDOWN WRAPPER */}
      <div className="relative w-full md:w-[40%]">
        <form
          onSubmit={handleSearch}
          className="
            flex items-center 
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
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowDropdown(true);
            }}
            className="
              w-full 
              px-4 py-2
              bg-transparent
              text-white 
              placeholder-white/70
              focus:outline-none 
              text-sm sm:text-base
            "
          />

          <button
            type="submit"
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
        </form>

        {/* 🔥 LIVE SUGGESTIONS DROPDOWN */}
        {showDropdown && suggestions.length > 0 && (
          <div className="absolute w-full mt-2 bg-white text-black rounded-xl shadow-xl overflow-hidden z-50">
            {suggestions.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  navigate(`/product/${item._id}`);
                  setShowDropdown(false);
                }}
              >
                <img
                  src={item.image}
                  alt=""
                  className="w-10 h-10 rounded object-cover"
                />
                <div>
                  <p className="font-medium text-gray-800">{item.title}</p>
                  <p className="text-sm text-gray-500">₹{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Links */}
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

      

        {/* Cart */}
       
        <button
          onClick={() => navigate("/cart")}
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
          <ShoppingCart size={18} /> Cart
        </button> 

        {/* Login */}
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
