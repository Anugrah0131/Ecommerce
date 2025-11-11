import React from "react";
import { Link } from "react-router-dom";

function Card({ id, title, price, image, category, onDelete }) {
    return (
        <div
            key={id}
            className="w-60 bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
        >
            {/* Product Image */}
            <div className="w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                {Image ? (
                    <img
                        src={image}
                        alt={title}
                        className="object-cover w-full h-full"
                    />
                ) : (
                    <span className="text-gray-400 text-sm">No Image</span>
                )}
            </div>

            {/* Product Info */}
            <div className="p-4 flex flex-col items-center text-center">
                <h2 className="text-lg font-semibold text-gray-800 truncate">
                    {title || "Untitled Product"}
                </h2>
                <p className="text-gray-600 mt-2 text-sm">
                    ₹{price ? price : "N/A"}
                </p>
                <p>{category}</p>
                <button className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-all duration-200">
                   <link rel="" />View
                </button>
                <button className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-all duration-200">
                    Add to cart
                </button>
            </div>
        </div>
    );
}

export default Card;
