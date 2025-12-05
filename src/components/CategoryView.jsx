import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function CategoryView() {
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState(null);
  const [products, setProducts] = useState([]);

  const API_CATEGORIES = "http://localhost:8080/api/categories";
  const API_PRODUCTS = "http://localhost:8080/api/products?category=";
  const BACKEND_BASE = "http://localhost:8080";

  const fetchCategories = async () => {
    const res = await fetch(API_CATEGORIES);
    const data = await res.json();
    setCategories(data);
  };

  const fetchProducts = async (catId) => {
    const res = await fetch(API_PRODUCTS + catId);
    const data = await res.json();
    setProducts(data);
  };

  const getImageUrl = (img) => {
    if (!img) return "/no-image.png";
    if (img.startsWith("http")) return img;
    if (img.startsWith("/")) return BACKEND_BASE + img;
    return `${BACKEND_BASE}/uploads/${img}`;
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSelect = (cat) => {
    setSelected(cat);
    fetchProducts(cat._id);
  };

  return (
    <div className="w-full min-h-screen bg-[#fafaff] font-sans text-gray-900">
      {/* PAGE TITLE */}
      <div className="relative pt-24 pb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold font-serif">
          Browse by <span className="text-purple-700">Category</span>
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          Select a category to explore curated products
        </p>

        {/* Soft Blurs */}
        <div className="absolute -left-20 top-0 w-72 h-72 bg-pink-300/20 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute -right-20 top-20 w-96 h-96 bg-purple-300/15 blur-[150px] rounded-full pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10 px-6 pb-20">
        {/* LEFT SIDEBAR — GLASS CARD */}
        <div className="w-full md:w-72 bg-white/50 backdrop-blur-lg border border-white/30 shadow-xl rounded-3xl p-6 h-fit sticky top-24">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-5">
            Categories
          </h2>

          <div className="flex flex-col gap-4">
            {categories.map((cat) => (
              <motion.button
                key={cat._id}
                onClick={() => handleSelect(cat)}
                whileHover={{ scale: 1.03 }}
                className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all shadow-sm
                  ${
                    selected?._id === cat._id
                      ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg"
                      : "bg-white border border-gray-200 hover:shadow-md text-gray-900"
                  }`}
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200">
                  <img
                    src={getImageUrl(cat.image)}
                    className="object-cover w-full h-full"
                  />
                </div>
                <span className="font-medium text-sm md:text-base">{cat.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* RIGHT PRODUCT GRID */}
        <div className="flex-1 mt-10 md:mt-0">
          {!selected ? (
            <p className="text-center text-gray-500 mt-20 text-lg">
              Select a category from the left to view products.
            </p>
          ) : (
            <>
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8">
                {selected.name} Products
              </h2>

              {products.length === 0 ? (
                <p className="text-gray-500 text-center text-lg">No products found.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {products.map((p) => (
                    <Link to={`/details/${p._id}`} key={p._id}>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="bg-white rounded-3xl p-4 sm:p-5 shadow-lg border border-gray-100 hover:shadow-2xl transition cursor-pointer flex flex-col"
                      >
                        <div className="w-full h-48 sm:h-52 rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center">
                          <img
                            src={getImageUrl(p.image)}
                            className="object-contain w-full h-full"
                            alt={p.title}
                          />
                        </div>

                        <h3 className="mt-4 font-medium text-gray-900 text-sm sm:text-base line-clamp-2">
                          {p.title}
                        </h3>

                        <p className="text-purple-700 font-bold text-lg sm:text-xl mt-2">
                          ₹{p.price}
                        </p>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
