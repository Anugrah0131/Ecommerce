import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Eye } from "lucide-react";
import AddToCartButton from "./AddToCartButton.jsx";

function Card({ id, title, price, image, category, badge }) {
  return (
    <motion.div
      key={id}
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="
        relative w-80 sm:w-96 
        rounded-3xl 
        bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-indigo-900/20
        backdrop-blur-2xl 
        border border-white/10 
        shadow-[0_10px_40px_rgba(0,0,0,0.35)]
        hover:shadow-purple-500/40 
        overflow-hidden 
        flex flex-col 
        transition-all
      "
    >
      {/* Wishlist Button */}
      <button
        className="
          absolute top-4 right-4 
          w-10 h-10 flex items-center justify-center 
          rounded-full 
          bg-white/20 backdrop-blur-md 
          border border-white/30
          text-white 
          hover:bg-red-500 hover:text-white 
          transition
        "
        title="Add to wishlist"
      >
        <Heart className="w-5 h-5" />
      </button>

      {/* Badge */}
      {badge && (
        <span className="
          absolute top-4 left-4 
          bg-gradient-to-r from-purple-400 to-pink-400 
          text-black 
          text-sm font-semibold 
          px-4 py-1.5 
          rounded-full 
          shadow-md
        ">
          {badge}
        </span>
      )}

      {/* Product Image */}
      <Link to={`/details/${id}`} className="block w-full h-64 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={title}
            className="object-contain w-full h-full transition-transform duration-700 hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-white/10">
            <span className="text-gray-400 text-sm">No Image</span>
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="p-6 flex flex-col flex-1 justify-between">
        <div className="text-center">
          <h2 className="text-lg sm:text-xl font-bold text-white truncate">{title}</h2>
          <p className="text-purple-300 text-sm sm:text-base mt-1">{category}</p>
          <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent mt-2">
            ₹{price}
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-5 flex gap-4 justify-center">
          {/* View Button */}
          <Link
            to={`/details/${id}`}
            className="
              flex items-center justify-center flex-1 py-3 rounded-2xl
              bg-gradient-to-r from-pink-500 to-purple-500 
              text-white font-semibold shadow-xl
              transition-transform transform hover:scale-105
            "
          >
            <Eye className="w-5 h-5 mr-2" /> View
          </Link>

          {/* Add to Cart */}
          <AddToCartButton
            product={{ _id: id, title, price, image, category }}
            className="
              flex-1 py-3 rounded-2xl shadow-xl
              transition-transform transform hover:scale-105
            "
          />
        </div>
      </div>
    </motion.div>
  );
}

export default Card;
