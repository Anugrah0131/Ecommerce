import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/categories");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
      <Navbar />

      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4 text-center">Shop by Category</h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-10">
          {categories.map((cat) => (
            <div
              key={cat._id}
              onClick={() => navigate(`/category/${cat._id}`)}
              className="cursor-pointer rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-transform transform hover:scale-105 bg-white"
            >
              <img src={cat.image} alt={cat.name} className="w-full h-40 object-cover" />
              <div className="p-3 text-center font-semibold">{cat.name}</div>
            </div>
          ))}
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Welcome to Our Store 🛍️
        </h1>
        <p className="text-gray-600 mb-6 text-sm md:text-base">
          Find the best products at unbeatable prices.
        </p>

        <Link
          to="/Products"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Shop Now
        </Link>
      </div>
    </>
  );
}
