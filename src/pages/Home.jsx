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
    <div className="w-full min-h-screen flex flex-col bg-gray-50 font-sans">

      {/*HERO SECTION */}

      <section className="flex flex-col md:flex-row justify-between items-center py-16 px-8 md:px-16 bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="md:w-1/2 space-y-6 text-center md:text-left">
          <h2 className="text-5xl font-extrabold text-gray-800 leading-snug">
            Welcome to <br />
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
            src="public/shopEase.png"
            className="rounded-xl shadow-2xl w-full md:w-3/4"
          />
        </div>
      </section>

      {/*Shop by Category */}
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
              <h3 className="text-lg font-semibold text-gray-700">{cat.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 px-8 md:px-16 bg-gray-50">
        <h1 className="text-3xl font-bold text-center mb-12 text-blue-600">
          Featured Products
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 max-w-7xl mx-auto">
          {featured.length === 0 ? (
            <p className="text-center text-gray-500 col-span-4">
              No featured products.
            </p>
          ) : (
            featured.map((p) => (
              <div
                key={p._id}
                onClick={() => navigate(`/details/${p._id}`)}
                className="
                  cursor-pointer 
                  bg-white 
                  rounded-2xl 
                  shadow-lg 
                  hover:shadow-2xl 
                  transition-all 
                  duration-300 
                  hover:scale-[1.03] 
                  flex 
                  flex-col 
                  items-center 
                  p-6
                "
              >
                <div className="w-full h-52 bg-gray-100 rounded-xl overflow-hidden flex justify-center items-center">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="
                      object-contain 
                      w-full 
                      h-full 
                      transition-transform 
                      duration-300 
                      hover:scale-110
                    "
                  />
                </div>

                <h3 className="text-lg font-semibold text-gray-800 mt-4 text-center line-clamp-2">
                  {p.title}
                </h3>

                <p className="text-blue-600 font-bold text-xl mt-2">₹ {p.price}</p>

                <button
                  className="
                    mt-4 
                    w-full 
                    bg-blue-600 
                    hover:bg-blue-700 
                    text-white 
                    py-2.5 
                    rounded-lg 
                    font-medium 
                    transition
                    shadow-md
                    hover:shadow-lg
                  "
                >
                  View Product
                </button>
              </div>
            ))
          )}
        </div>
      </section>
      
     {/* WHY CHOOSE US SECTION */}
<section className="py-24 px-8 md:px-16 bg-gradient-to-br from-blue-50 to-white">
  <motion.h1
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
    className="text-4xl font-extrabold text-center mb-14 text-gray-800"
  >
    Why Choose <span className="text-blue-600">ShopEase?</span>
  </motion.h1>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-7xl mx-auto">

    {[
      {
        icon: Truck,
        title: "Fast Delivery",
        desc: "Get your orders delivered quickly and safely to your doorstep."
      },
      {
        icon: ShieldCheck,
        title: "Secure Payments",
        desc: "Shop confidently with encrypted and protected payments."
      },
      {
        icon: Star,
        title: "Premium Quality",
        desc: "Only the best, hand-picked products curated for you."
      },
      {
        icon: Headphones,
        title: "24/7 Support",
        desc: "A friendly support team always ready to assist you."
      }
    ].map((card, index) => {
      const Icon = card.icon;
      return (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.15 }}
          viewport={{ once: true }}
          className="group bg-white/80 backdrop-blur-md border border-gray-100 
          shadow-lg hover:shadow-2xl rounded-3xl p-8 text-center cursor-pointer
          transition-all duration-300 hover:-translate-y-2"
        >
          <div className="flex justify-center mb-5">
            <div className="p-4 rounded-full bg-blue-100 group-hover:bg-blue-600 transition-all duration-300">
              <Icon className="w-8 h-8 text-blue-600 group-hover:text-white transition-all duration-300" />
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-800 mb-2">{card.title}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{card.desc}</p>
        </motion.div>
      );
    })}

  </div>
</section>

{/* 🌟 Brand Story Section */}
<section className="py-20 px-6 md:px-16 bg-white">
  <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
    
    {/* Image */}
    <motion.img
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f"
      alt="Our Story"
      className="rounded-2xl shadow-lg object-cover h-96 w-full"
    />

    {/* Text */}
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <h2 className="text-4xl font-bold text-gray-800 leading-tight">
        ShopEase: Our Story
      </h2>

      <p className="text-gray-600 text-lg">
        We started with a simple belief — **quality should be accessible**.
        Every product we create is crafted with intention, detail, and passion.
      </p>

      <p className="text-gray-600 text-lg">
        From day one, our mission has been to bring **modern designs**, 
        **trusted quality**, and a **seamless shopping experience** to every customer.
      </p>

      <p className="text-gray-700 font-semibold text-xl">
        Crafted with care. Built for you.
      </p>
    </motion.div>
  
  </div>
</section>

{/* 🌙 Premium Footer */}
<footer className="bg-gray-900 text-gray-300 py-16 px-10 md:px-20">
  <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10">

    {/* Brand */}
    <div>
      <h1 className="text-2xl font-bold text-white mb-4">ShopEase</h1>
      <p className="text-gray-400 leading-relaxed">
        Bringing you thoughtfully designed products  
        that redefine everyday living.
      </p>
    </div>

    {/* Links */}
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
      <ul className="space-y-3">
        <li className="hover:text-white cursor-pointer transition">Home</li>
        <li className="hover:text-white cursor-pointer transition">Shop</li>
        <li className="hover:text-white cursor-pointer transition">Categories</li>
        <li className="hover:text-white cursor-pointer transition">Contact</li>
      </ul>
    </div>

    {/* Support */}
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
      <ul className="space-y-3">
        <li className="hover:text-white cursor-pointer transition">FAQs</li>
        <li className="hover:text-white cursor-pointer transition">Shipping</li>
        <li className="hover:text-white cursor-pointer transition">Returns</li>
        <li className="hover:text-white cursor-pointer transition">Privacy Policy</li>
      </ul>
    </div>

    {/* Newsletter */}
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">Stay Updated</h3>
      <p className="text-gray-400 mb-3">
        Subscribe to receive updates, new launches & offers.
      </p>

      <div className="flex items-center">
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full px-4 py-2 rounded-l-lg focus:outline-none text-gray-800"
        />
        <button className="bg-blue-600 px-4 py-2 rounded-r-lg text-white font-semibold hover:bg-blue-700 transition">
          Join
        </button>
      </div>
    </div>

  </div>

  <div className="text-center text-gray-500 mt-12 border-t border-gray-700 pt-6">
    © {new Date().getFullYear()} YourBrand · All Rights Reserved.
  </div>
</footer>



    </div>
  );
}



