import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Eye } from "lucide-react";
import AddToCartButton from "./AddToCartButton.jsx";

function Card({ id, title, price, image, category, badge }) {
  return (
    <motion.div
      key={id}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="relative w-64 bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200"
    >
      {/* Wishlist Heart Button */}
      <button className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:bg-red-500 hover:text-white transition">
        <Heart className="w-4 h-4" />
      </button>

      {/* Badge */}
      {badge && (
        <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
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
      <div className="p-4 text-center">
        <h2 className="text-lg font-bold text-gray-800 truncate">
          {title}
        </h2>

        <p className="text-gray-500 mt-1 text-sm">{category}</p>

        <p className="text-2xl font-bold text-blue-600 mt-2">₹{price}</p>

        {/* Buttons */}
        <div className="mt-5 flex justify-center gap-3 w-full">
          {/* View Button */}
          <Link
            to={`/details/${id}`}
            className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-black transition flex items-center gap-1 shadow"
          >
            <Eye className="w-4 h-4" />
            View
          </Link>

          {/* Add To Cart Component */}
          <AddToCartButton
            product={{ _id: id, title, price, image, category }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default Card;
