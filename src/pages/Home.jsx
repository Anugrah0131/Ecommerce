import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Truck, ShieldCheck, Star, Headphones } from "lucide-react";


export default function Home() {
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);

  const navigate = useNavigate();

  // FETCH CATEGORIES
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

  const fetchFeaturedProducts = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/products");
      const data = await res.json();

      const featuredIndexes = [0, 2, 3, 7];

      const featuredProducts = data.filter((item, index) =>
        featuredIndexes.includes(index)
      );

      setFeatured(featuredProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchFeaturedProducts();
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#f6f9fb] text-gray-800 font-inter">
      

      {/* HERO */}
      <section className="w-full bg-gradient-to-r from-[#f8fbff] to-[#ffffff]">
        <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full px-3 py-1 text-sm text-blue-600 font-medium shadow-sm w-max">
              Curated · Premium · Fast
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl leading-tight font-extrabold text-gray-900">
              Modern products, made for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                everyday living
              </span>
            </h1>


            <div className="mt-8 grid grid-cols-3 gap-4 max-w-md">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-50">
                  <Truck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Fast delivery</div>
                  <div className="text-sm text-gray-500">Across India</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-50">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Secure payments</div>
                  <div className="text-sm text-gray-500">Encrypted & safe</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-50">
                  <Headphones className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Support</div>
                  <div className="text-sm text-gray-500">24/7 help</div>
                </div>
              </div>
            </div>
          </motion.div>


        </div>
      </section>

      {/* SHOP BY CATEGORY */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Shop by Category</h2>
            <Link to="/categories" className="text-sm text-blue-600 hover:underline">
              See all categories
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {categories.length === 0 ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-white rounded-2xl p-6 h-40 shadow-sm" />
              ))
            ) : (
              categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => navigate(`/category/${cat._id}`)}
                  className="group bg-white rounded-2xl p-4 flex flex-col items-center text-center hover:shadow-2xl transition transform hover:-translate-y-1"
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center mb-3 overflow-hidden">
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-sm font-medium text-gray-800">{cat.name}</div>
                </button>
              ))
            )}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-16 bg-[#f7fafc]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
            <Link to="/products" className="text-sm text-blue-600 hover:underline">
              View all
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featured.length === 0 ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-white rounded-3xl p-6 h-80 shadow-sm" />
              ))
            ) : (
              featured.map((p) => (
                <motion.div
                  key={p._id}
                  whileHover={{ scale: 1.02 }}
                  className="relative bg-white rounded-3xl p-6 shadow-md hover:shadow-2xl transition cursor-pointer flex flex-col"
                  onClick={() => navigate(`/details/${p._id}`)}
                >
                  <div className="w-full h-56 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                    <img src={p.image} alt={p.title} className="object-contain w-full h-full" />
                  </div>

                  <div className="mt-4 flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{p.title}</h3>
                    <p className="text-blue-600 font-bold text-xl mt-2">₹ {p.price}</p>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-full font-medium shadow-sm">
                      View
                    </button>
                    <button className="w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm" title="Add to wishlist">
                      ❤
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-extrabold text-gray-900 text-center mb-10"
          >
            Why Choose <span className="text-blue-600">ShopEase</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: "Fast Delivery", desc: "Get your orders delivered quickly and safely." },
              { icon: ShieldCheck, title: "Secure Payments", desc: "Encrypted and trusted checkout." },
              { icon: Star, title: "Premium Quality", desc: "Only top-rated, handpicked items." },
              { icon: Headphones, title: "24/7 Support", desc: "We are here when you need us." },
            ].map((card, idx) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ translateY: -6 }}
                  className="bg-white rounded-2xl p-6 shadow hover:shadow-2xl transition flex flex-col items-center text-center"
                >
                  <div className="p-3 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-lg">{card.title}</h3>
                  <p className="text-sm text-gray-500 mt-2">{card.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BRAND STORY */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <motion.img
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1200&q=80"
            alt="Our Story"
            className="rounded-3xl shadow-xl object-cover w-full h-96"
          />

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="text-sm text-blue-600 font-medium">Our Story</div>
            <h2 className="text-4xl font-bold text-gray-900">ShopEase: Crafted for daily delight</h2>
            <p className="text-gray-600 text-lg">
              We started with a simple belief — quality should be accessible. Every product we create is crafted with intention, detail, and passion.
            </p>
            <p className="text-gray-600">
              From design to delivery, our mission is to bring modern, trusted products and an effortless shopping experience to everyone.
            </p>
            <div className="mt-4">
              <Link to="/about" className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-3 rounded-full shadow-md">Read more</Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">SE</div>
              <div className="text-white font-semibold">ShopEase</div>
            </div>
            <p className="text-gray-400">Bringing thoughtfully designed products that redefine everyday living.</p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="cursor-pointer hover:text-white">Home</li>
              <li className="cursor-pointer hover:text-white">Shop</li>
              <li className="cursor-pointer hover:text-white">Categories</li>
              <li className="cursor-pointer hover:text-white">Contact</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="cursor-pointer hover:text-white">FAQs</li>
              <li className="cursor-pointer hover:text-white">Shipping</li>
              <li className="cursor-pointer hover:text-white">Returns</li>
              <li className="cursor-pointer hover:text-white">Privacy</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Stay Updated</h4>
            <p className="text-gray-400 mb-3">Subscribe to receive updates, launches & offers.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-l-lg focus:outline-none text-gray-800"
              />
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 rounded-r-lg text-white font-semibold">Join</button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 text-center py-6 text-gray-500">
          © {new Date().getFullYear()} ShopEase · All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
