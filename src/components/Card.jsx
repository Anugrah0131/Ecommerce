import React from "react";
import { Link } from "react-router-dom";

function Card({ id, title, price, image, category }) {
  return (
    <div
      key={id}
      className="w-64 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
    >
      {/* Product Image */}
      <Link to={`/details/${id}`}>
        <div className="w-full h-52 bg-gray-100 flex items-center justify-center overflow-hidden">
          {image ? (
            <img
              src={image}
              alt={title}
              className="object-contain w-full h-full transition-transform duration-500 hover:scale-110"
            />
          ) : (
            <span className="text-gray-400 text-sm">No Image</span>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4 text-center">
        <h2 className="text-lg font-semibold text-gray-800 truncate">
          {title || "Untitled Product"}
        </h2>
        <p className="text-gray-600 mt-1 text-sm">{category}</p>
        <p className="text-xl font-bold text-blue-600 mt-2">₹{price || "N/A"}</p>

        <div className="mt-4 flex justify-center gap-3">
          <Link
            to={`/details/${id}`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            View
          </Link>
          <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default Card;

