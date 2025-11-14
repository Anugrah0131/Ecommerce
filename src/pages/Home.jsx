import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/categories");
      const data = await res.json();
      if (Array.isArray(data)) setCategories(data);
      else if (Array.isArray(data.categories)) setCategories(data.categories);
      else setCategories([]);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gray-50 px-6 py-12 text-gray-810">
        <h1 className="text-3xl font-bold text-center mb-10 text-blue-600">
          Shop by Category
        </h1>

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {categories.map((cat) => (
            <div
              key={cat._id}
              onClick={() => navigate(`/category/${cat._id}`)}
              className="cursor-pointer bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-transform transform hover:scale-105"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-44 object-cover"
              />
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold">{cat.name}</h3>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <h2 className="text-4xl font-bold mb-3 text-gray-800">
            Discover the Best Deals 🛒
          </h2>
          <p className="text-gray-600 mb-6">
            Explore a wide range of products at unbeatable prices.
          </p>
          <Link
            to="/Products"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    </>
  );
}
