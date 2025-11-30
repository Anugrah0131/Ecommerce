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
   <nav className="w-full sticky top-0 z-50 bg-gradient-to-r from-indigo-900/50 via-purple-800/40 to-indigo-900/50 backdrop-blur-2xl border-b border-white/10 shadow-[0_4px_25px_rgba(0,0,0,0.3)]">
  <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

    {/* BRAND */}
    <Link to="/" className="text-3xl font-extrabold tracking-wide flex items-center gap-2">
      <span className="bg-gradient-to-r from-purple-300 to-pink-400 bg-clip-text text-transparent">
        Shop
      </span>
      <span className="text-white">Ease</span>
    </Link>

    {/* DESKTOP */}
    <div className="hidden md:flex items-center gap-10">

      {/* SEARCH */}
      <div className="relative w-72">
        <form
          onSubmit={handleSearch}
          className="flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-inner hover:bg-white/20 transition"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowDropdown(true);
            }}
            placeholder="Search products…"
            className="w-full px-4 py-2 bg-transparent text-white placeholder-white/50 focus:outline-none text-sm"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-300 to-pink-300 text-black p-2 rounded-full m-1 hover:scale-110 transition"
          >
            <Search size={16} />
          </button>
        </form>

        {/* LIVE DROPDOWN */}
        {showDropdown && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute left-0 w-full mt-2 bg-white/95 backdrop-blur-xl text-black rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.2)] overflow-hidden border border-gray-200"
          >
            {suggestions.map((item) => (
              <motion.div
                key={item._id}
                whileHover={{ backgroundColor: "#f3e8ff" }}
                className="flex items-center gap-3 p-3 cursor-pointer transition"
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
          </motion.div>
        )}
      </div>

      {/* NAV LINKS */}
      <div className="flex items-center gap-8 text-lg font-medium">
        {["Home", "Products", "Contact", "About"].map((text) => (
          <Link
            key={text}
            to={text === "Home" ? "/" : `/${text.toLowerCase()}`}
            className="relative group"
          >
            <span className="text-white group-hover:text-purple-300 transition">
              {text}
            </span>
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-purple-400 group-hover:w-full transition-all duration-300"></span>
          </Link>
        ))}
      </div>

      {/* CART */}
      <motion.button
        onClick={() => navigate("/cart")}
        whileHover={{ scale: 1.06 }}
        className="flex items-center gap-2 bg-gradient-to-r from-purple-300 to-pink-300 text-black px-5 py-2.5 rounded-full font-semibold shadow-md hover:shadow-lg transition"
      >
        <ShoppingCart size={18} />
        Cart
      </motion.button>

      {/* LOGIN */}
      <motion.button
        onClick={() => navigate("/login")}
        whileHover={{ scale: 1.06 }}
        className="flex items-center gap-2 border border-purple-300 text-purple-300 px-5 py-2.5 rounded-full font-semibold hover:bg-purple-300 hover:text-black transition shadow-md"
      >
        <LogIn size={18} />
        Login
      </motion.button>
    </div>

    {/* MOBILE ICON */}
    <button className="md:hidden text-white" onClick={() => setOpenMenu(!openMenu)}>
      {openMenu ? <X size={26} /> : <Menu size={26} />}
    </button>
  </div>

  {/* MOBILE MENU */}
  <motion.div
    initial={{ height: 0 }}
    animate={{ height: openMenu ? "auto" : 0 }}
    transition={{ duration: 0.3 }}
    className="overflow-hidden md:hidden bg-gradient-to-b from-indigo-900/70 to-purple-900/70 backdrop-blur-xl border-t border-white/10"
  >
    <div className="p-6 space-y-4 text-lg text-white">
      <Link to="/" className="block hover:text-purple-300">Home</Link>
      <Link to="/products" className="block hover:text-purple-300">Products</Link>
      <Link to="/contact" className="block hover:text-purple-300">Contact</Link>
      <Link to="/about" className="block hover:text-purple-300">About</Link>

      <button
        onClick={() => navigate("/cart")}
        className="w-full bg-gradient-to-r from-purple-300 to-pink-300 text-black py-2 rounded-full font-semibold shadow-lg"
      >
        Cart
      </button>

      <button
        onClick={() => navigate("/login")}
        className="w-full border border-purple-300 text-purple-300 py-2 rounded-full font-semibold hover:bg-purple-300 hover:text-black transition"
      >
        Login
      </button>
    </div>
  </motion.div>
</nav>

// 
  );
}

export default Navbar;
