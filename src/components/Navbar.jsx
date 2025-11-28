import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, LogIn, Menu, X } from "lucide-react";
import { motion } from "framer-motion";

function Navbar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  // Fetch live search results
  const fetchSuggestions = async (value) => {
    if (!value.trim()) return setSuggestions([]);

    try {
      const res = await fetch(`http://localhost:8080/api/products/search?q=${value}`);
      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.error("Suggestion fetch error:", err);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => fetchSuggestions(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${query}`);
    setShowDropdown(false);
  };

  return (
    <nav className="w-full sticky top-0 z-50 bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* BRAND */}
        <Link to="/" className="text-3xl font-extrabold tracking-wide">
          <span className="text-yellow-300">Shop</span>Ease
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8">

          {/* SEARCH */}
          <div className="relative w-64">
            <form
              onSubmit={handleSearch}
              className="flex items-center bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl overflow-hidden"
            >
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowDropdown(true);
                }}
                placeholder="Search products…"
                className="w-full px-4 py-2 bg-transparent text-white placeholder-white/70 focus:outline-none text-sm"
              />
              <button
                type="submit"
                className="bg-yellow-400 text-black p-2 rounded-full m-1 hover:bg-yellow-300 transition"
              >
                <Search size={16} />
              </button>
            </form>

            {/* LIVE DROPDOWN */}
            {showDropdown && suggestions.length > 0 && (
              <div className="absolute left-0 w-full mt-2 bg-white text-black rounded-2xl shadow-xl overflow-hidden">
                {suggestions.map((item) => (
                  <motion.div
                    key={item._id}
                    whileHover={{ backgroundColor: "#f0faff" }}
                    className="flex items-center gap-3 p-3 cursor-pointer"
                    onClick={() => {
                      navigate(`/product/${item._id}`);
                      setShowDropdown(false);
                    }}
                  >
                    <img src={item.image} className="w-10 h-10 rounded-xl object-cover" />
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-gray-500">₹{item.price}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* NAV LINKS */}
          <div className="flex items-center gap-6 text-lg font-medium">
            <Link to="/" className="hover:text-yellow-300 transition">Home</Link>
            <Link to="/products" className="hover:text-yellow-300 transition">Products</Link>
            <Link to="/categories" className="hover:text-yellow-300 transition">Categories</Link>
            <Link to="/contact" className="hover:text-yellow-300 transition">Contact</Link>
            <Link to="/about" className="hover:text-yellow-300 transition">About</Link>
          </div>

          {/* CART */}
          <motion.button
            onClick={() => navigate("/cart")}
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 rounded-full font-semibold shadow-md hover:bg-yellow-300"
          >
            <ShoppingCart size={18} />
            Cart
          </motion.button>

          {/* LOGIN */}
          <motion.button
            onClick={() => navigate("/login")}
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 border border-yellow-300 text-yellow-300 px-4 py-2 rounded-full font-semibold hover:bg-yellow-300 hover:text-black transition"
          >
            <LogIn size={18} />
            Login
          </motion.button>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden"
          onClick={() => setOpenMenu(!openMenu)}
        >
          {openMenu ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {openMenu && (
        <div className="md:hidden bg-indigo-700 p-6 space-y-4 text-lg">
          <Link to="/" className="block hover:text-yellow-300">Home</Link>
          <Link to="/products" className="block hover:text-yellow-300">Products</Link>
          <Link to="/categories" className="block hover:text-yellow-300">Categories</Link>
          <Link to="/contact" className="block hover:text-yellow-300">Contact</Link>
          <Link to="/about" className="block hover:text-yellow-300">About</Link>

          <button
            onClick={() => navigate("/cart")}
            className="w-full bg-yellow-400 text-black py-2 rounded-full font-semibold mt-4"
          >
            Cart
          </button>

          <button
            onClick={() => navigate("/login")}
            className="w-full border border-yellow-300 text-yellow-300 py-2 rounded-full font-semibold"
          >
            Login
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
