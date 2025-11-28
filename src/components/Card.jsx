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
      className="relative w-64 bg-white backdrop-blur-md/70 rounded-3xl shadow-md hover:shadow-2xl border border-gray-200 overflow-hidden flex flex-col"
    >
      {/* Wishlist Button */}
      <button
        className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow hover:bg-red-500 hover:text-white transition"
        title="Add to wishlist"
      >
        <Heart className="w-4 h-4" />
      </button>

      {/* Badge */}
      {badge && (
        <span className="absolute top-3 left-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
          {badge}
        </span>
      )}

      {/* Product Image */}
      <Link to={`/details/${id}`}>
        <div className="w-full h-56 bg-gray-100 flex items-center justify-center overflow-hidden group">
          {image ? (
            <img
              src={image}
              alt={title}
              className="object-contain w-full h-full transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <span className="text-gray-400 text-sm">No Image</span>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div className="text-center">
          <h2 className="text-lg font-bold text-gray-900 truncate">{title}</h2>
          <p className="text-gray-500 text-sm mt-1">{category}</p>
          <p className="text-xl font-bold text-blue-600 mt-2">₹{price}</p>
        </div>

        {/* Buttons */}
        <div className="mt-4 flex gap-3 justify-center">
          {/* View Button */}
          <Link
            to={`/details/${id}`}
            className="flex items-center gap-1 px-4 py-2 bg-gray-900 text-white rounded-2xl shadow hover:bg-black transition"
          >
            <Eye className="w-4 h-4" /> View
          </Link>

          {/* Add to Cart */}
          <AddToCartButton product={{ _id: id, title, price, image, category }} />
        </div>
      </div>
    </motion.div>
  );
}

export default Card;
