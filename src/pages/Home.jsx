import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Truck, ShieldCheck, Star, Headphones, ChevronLeft, ChevronRight } from "lucide-react";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const navigate = useNavigate();

  // --- keep your fetch logic exactly the same ---
  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/categories");
      const data = await res.json();
      if (Array.isArray(data)) setCategories(data);
      else if (Array.isArray(data.categories)) setCategories(data.categories);
      else setCategories([]);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchFeaturedProducts = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/products");
      const data = await res.json();
      const featuredIndexes = [0, 2, 3, 7];
      setFeatured(data.filter((_, i) => featuredIndexes.includes(i)));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchFeaturedProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // --- end original logic ---

  // ---------- SLIDER IMAGES ----------
  const images = [
    "/mnt/data/Gemini_Generated_Image_dze9yidze9yidze9.png",
    "/mnt/data/Gemini_Generated_Image_dze9yidze9yidze9(1).png",
    "/mnt/data/Gemini_Generated_Image_dze9yidze9yidze9(2).png",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const autoRef = useRef(null);

  useEffect(() => {
    // autoplay
    autoRef.current = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3800);

    return () => clearTimeout(autoRef.current);
  }, [currentIndex, images.length]);

  const next = () => {
    clearTimeout(autoRef.current);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };
  const prev = () => {
    clearTimeout(autoRef.current);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="w-full min-h-screen bg-[#fafaff] text-gray-800 font-inter">
      {/* =============================== */}
      {/* HERO — AUTO SLIDER */}
      {/* =============================== */}
      <section className="relative w-full overflow-hidden">
        {/* floating blobs */}
        <div className="absolute -left-16 -top-8 w-72 h-72 bg-pink-300/30 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute -right-16 bottom-8 w-96 h-96 bg-purple-300/25 blur-[150px] rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-24 lg:py-32 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* LEFT: Text content over slider (kept visually separated) */}
          <div className="z-20">
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="px-3 py-1 rounded-full bg-white/70 backdrop-blur-md text-purple-600 text-sm shadow-sm border border-white/40"
            >
              Aesthetic · Modern · Curated
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mt-4 text-gray-900 max-w-lg"
            >
              Curated for your vibe
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85 }}
              className="text-gray-600 mt-4 max-w-md"
            >
              Everyday essentials, reimagined.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.95 }}
              className="flex gap-4 mt-6"
            >
              <Link
                to="/products"
                className="px-6 py-3 rounded-full text-white bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg hover:scale-[1.03] transition font-semibold"
              >
                Explore now
              </Link>

              <Link
                to="/categories"
                className="px-6 py-3 rounded-full border border-gray-300 bg-white/50 backdrop-blur-md shadow-sm hover:bg-white transition"
              >
                Categories
              </Link>
            </motion.div>

            {/* Trust icons */}
            <div className="grid grid-cols-3 gap-6 max-w-sm mt-8">
              {[
                { icon: Truck, title: "Fast", sub: "Across India" },
                { icon: ShieldCheck, title: "Secure", sub: "Safe Payments" },
                { icon: Headphones, title: "Support", sub: "24/7" },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-white shadow-sm border border-gray-100">
                      <Icon className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-800">{item.title}</div>
                      <div className="text-xs text-gray-500">{item.sub}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Slider card */}
          <div className="relative z-10 w-full">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <AnimatePresence mode="wait">
                {images.map((src, idx) =>
                  idx === currentIndex ? (
                    <motion.img
                      key={src}
                      src={src}
                      initial={{ opacity: 0, scale: 1.03 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.99 }}
                      transition={{ duration: 0.8 }}
                      className="w-full h-80 md:h-[420px] lg:h-[520px] object-cover"
                      alt={`hero-${idx}`}
                    />
                  ) : null
                )}
              </AnimatePresence>

              {/* glass overlay for headline on image */}
              <div className="absolute left-6 bottom-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3">
                <div className="text-white font-semibold">ShopEase Picks</div>
                <div className="text-xs text-white/80">Trendy choices for modern living</div>
              </div>

              {/* arrows */}
              <button
                onClick={prev}
                aria-label="previous"
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/30 backdrop-blur-md rounded-full shadow hover:bg-white/40 transition"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>

              <button
                onClick={next}
                aria-label="next"
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/30 backdrop-blur-md rounded-full shadow hover:bg-white/40 transition"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>

              {/* dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-3 h-3 rounded-full transition ${currentIndex === i ? "bg-white" : "bg-white/40"}`}
                    aria-label={`go-to-${i}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================= */}
      {/* SHOP BY CATEGORY — GLASS */}
      {/* ========================= */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Shop by Category</h2>
            <Link to="/categories" className="text-sm text-purple-600 hover:underline">
              See all categories
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {categories.length === 0 ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-white/60 rounded-2xl h-40 shadow-sm" />
              ))
            ) : (
              categories.map((cat) => (
                <motion.button
                  key={cat._id}
                  whileHover={{ scale: 1.04 }}
                  onClick={() => navigate(`/category/${cat._id}`)}
                  className="h-40 bg-white/60 backdrop-blur-lg border border-white/40 rounded-3xl shadow-md cursor-pointer flex flex-col items-center justify-center gap-3 hover:shadow-xl transition"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center overflow-hidden">
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-sm font-medium text-gray-800">{cat.name}</div>
                </motion.button>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ============================== */}
      {/* FEATURED PRODUCTS — GEN Z CARD */}
      {/* ============================== */}
      <section className="py-16 bg-gradient-to-b from-white to-purple-50/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
            <Link to="/products" className="text-sm text-purple-600 hover:underline">
              View all
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {featured.length === 0 ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-white rounded-3xl h-80 shadow-sm" />
              ))
            ) : (
              featured.map((p) => (
                <motion.div
                  key={p._id}
                  whileHover={{ scale: 1.03 }}
                  className="bg-white rounded-3xl p-5 shadow-lg hover:shadow-2xl transition cursor-pointer flex flex-col"
                  onClick={() => navigate(`/details/${p._id}`)}
                >
                  <div className="w-full h-52 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center mb-4">
                    <img src={p.image} alt={p.title} className="object-contain w-full h-full" />
                  </div>

                  <h3 className="font-semibold text-gray-800 line-clamp-2">{p.title}</h3>
                  <p className="text-purple-600 font-bold text-xl mt-2">₹ {p.price}</p>

                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/details/${p._id}`);
                      }}
                      className="flex-1 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium shadow-md"
                    >
                      View
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // keep behaviour simple (wishlist placeholder)
                      }}
                      className="w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm"
                      title="Add to wishlist"
                    >
                      ❤
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ============================ */}
      {/* WHY CHOOSE US — SOFT CARDS */}
      {/* ============================ */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-extrabold text-gray-900 text-center mb-10"
          >
            Why Choose <span className="text-purple-600">ShopEase</span>
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
                  className="bg-white rounded-3xl p-6 shadow hover:shadow-2xl transition flex flex-col items-center text-center"
                >
                  <div className="p-3 rounded-full bg-gradient-to-br from-pink-50 to-purple-50 mb-4">
                    <Icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-lg">{card.title}</h3>
                  <p className="text-sm text-gray-500 mt-2">{card.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================ */}
      {/* FOOTER */}
      {/* ============================ */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold">SE</div>
              <div className="text-white font-semibold">ShopEase</div>
            </div>
            <p className="text-gray-400">Bringing thoughtfully designed products that redefine everyday living.</p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="cursor-pointer hover:text-white" onClick={() => navigate("/")}>Home</li>
              <li className="cursor-pointer hover:text-white" onClick={() => navigate("/products")}>Shop</li>
              <li className="cursor-pointer hover:text-white" onClick={() => navigate("/categories")}>Categories</li>
              <li className="cursor-pointer hover:text-white" onClick={() => navigate("/contact")}>Contact</li>
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
              <button className="bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-2 rounded-r-lg text-white font-semibold">Join</button>
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
