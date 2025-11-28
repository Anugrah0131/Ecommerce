import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, LogIn } from "lucide-react";
import { motion } from "framer-motion";

function Navbar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Debounced live search fetch
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
      console.error("Error fetching suggestions:", error);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchSuggestions(query);
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    navigate(`/search?q=${query}`);
    setShowDropdown(false);
  };

  return (
    <nav className="w-full bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 text-white px-6 sm:px-10 py-4 shadow-lg backdrop-blur-md sticky top-0 z-50 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Brand */}
      <Link to="/" className="text-3xl font-extrabold tracking-wide drop-shadow-sm">
        <span className="text-yellow-300">Shop</span>Ease
      </Link>

      {/* Search */}
      <div className="relative w-full md:w-[40%]">
        <form
          onSubmit={handleSearch}
          className="flex items-center bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl shadow-lg overflow-hidden"
        >
          <input
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowDropdown(true);
            }}
            className="w-full px-4 py-2 bg-transparent text-white placeholder-white/70 focus:outline-none text-sm sm:text-base"
          />
          <motion.button
            type="submit"
            whileTap={{ scale: 0.95 }}
            className="bg-yellow-400 hover:bg-yellow-300 text-black p-2 rounded-full m-1 transition"
          >
            <Search size={16} />
          </motion.button>
        </form>

        {/* Live suggestions */}
        {showDropdown && suggestions.length > 0 && (
          <div className="absolute w-full mt-2 bg-white text-black rounded-2xl shadow-2xl overflow-hidden z-50">
            {suggestions.map((item) => (
              <motion.div
                key={item._id}
                whileHover={{ scale: 1.02, backgroundColor: "#f0faff" }}
                transition={{ type: "spring", stiffness: 200 }}
                className="flex items-center gap-3 p-3 cursor-pointer"
                onClick={() => {
                  navigate(`/product/${item._id}`);
                  setShowDropdown(false);
                }}
              >
                <img
                  src={item.image}
                  alt=""
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div>
                  <p className="font-medium text-gray-800">{item.title}</p>
                  <p className="text-sm text-gray-500">₹{item.price}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Links */}
      <div className="flex items-center gap-4 sm:gap-6 text-lg font-medium">
        {["Home", "Products", "Contact", "About"].map((link) => (
          <Link
            key={link}
            to={`/${link.toLowerCase()}`}
            className="hover:text-yellow-300 transition-all"
          >
            {link}
          </Link>
        ))}

        {/* Cart */}
        <motion.button
          onClick={() => navigate("/cart")}
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 rounded-2xl font-semibold shadow-md hover:bg-yellow-300 transition"
        >
          <ShoppingCart size={18} /> Cart
        </motion.button>

        {/* Login */}
        <motion.button
          onClick={() => navigate("/login")}
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 border border-yellow-300 text-yellow-300 px-4 py-2 rounded-2xl font-semibold shadow-md hover:bg-yellow-300 hover:text-black transition"
        >
          <LogIn size={18} /> Login
        </motion.button>
      </div>
    </nav>
  );
}

export default Navbar;
