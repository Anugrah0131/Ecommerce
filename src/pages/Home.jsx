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
    <div className="w-full min-h-screen flex flex-col bg-gray-50 font-sans">

      {/* 🌈 HERO SECTION (synced layout) */}
      <section className="flex flex-col md:flex-row justify-between items-center py-16 px-8 md:px-16 bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="md:w-1/2 space-y-6 text-center md:text-left">
          <h2 className="text-5xl font-extrabold text-gray-800 leading-snug">
            Welcome to{""}<br/>
            <span className="text-blue-600 drop-shadow-lg">Shop Ease</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-md mx-auto md:mx-0">
            Discover high-quality products and exclusive deals — all in one place!
          </p>
          <Link
            to="/Products"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 inline-block"
          >
            🛍️ Start Shopping
          </Link>
        </div>

        <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
          <img
            src="https://i.pinimg.com/280x280_RS/5b/35/07/5b350780e6cd26f0072f593a4da2714e.jpg"
            alt="Shopping"
            className="rounded-xl shadow-2xl w-full md:w-3/4"
          />
        </div>
      </section>

      {/* 🏷 Shop by Category (your actual data) */}
      <section className="py-16 px-8 md:px-16 bg-white">
        <h1 className="text-3xl font-bold text-center mb-12 text-blue-600">
          Shop by Category
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-10 max-w-6xl mx-auto">
          {categories.map((cat) => (
            <div
              key={cat._id}
              onClick={() => navigate(`/category/${cat._id}`)}
              className="cursor-pointer flex flex-col items-center rounded-xl p-4 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-24 h-24 rounded-full object-cover border-2 border-blue-300 mb-3"
              />
              <h3 className="text-lg font-semibold text-gray-700">
                {cat.name}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* 🛒 Promo Section (synced style) */}
      <div className="text-center mt-12 px-6">
        <h2 className="text-4xl font-extrabold mb-4 text-gray-900">
          Discover the Best Deals 🛒
        </h2>

        <p className="text-gray-600 max-w-xl mx-auto mb-8">
          Explore a wide range of products at unbeatable prices.
          Shop the latest trends and grab exciting offers today!
        </p>

        <Link
          to="/Products"
          className="px-8 py-3 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 transition font-medium shadow-md hover:shadow-lg"
        >
          Start Shopping
        </Link>
      </div>

      {/* 🧭 FOOTER */}
      <footer className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 text-white text-center py-6 mt-16">
        <p className="text-sm">
          © {new Date().getFullYear()} <b>Shop Ease</b>. All rights reserved.
        </p>
      </footer>
    </div>
  );
}



