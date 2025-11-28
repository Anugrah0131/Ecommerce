import React from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Star, ShieldCheck, Truck, Users } from "lucide-react";

export default function About() {
  return (
    <div className="w-full min-h-screen bg-[#fbfcfd] font-inter text-gray-800">
      
      {/* HERO SECTION */}
      <section className="py-20 px-6 md:px-16 bg-gradient-to-r from-[#f8fbff] to-[#ffffff]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold leading-snug">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">ShopEase</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-md">
              Your trusted marketplace for quality, convenience, and everyday essentials — crafted
              for modern shoppers.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <img
              src="http://localhost:5173/public/shopEase.png"
              alt="About ShopEase"
              className="rounded-3xl shadow-2xl object-cover h-96 w-full hover:scale-105 transition-transform duration-500"
            />

            {/* Floating badge */}
            <div className="absolute -top-5 -right-5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-2xl shadow-lg text-sm font-semibold">
              10+ Years Trusted
            </div>
          </motion.div>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="py-20 px-6 md:px-16">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.img
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1200&q=80"
            className="rounded-3xl shadow-xl object-cover h-96 w-full"
          />

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">
              Our Story
            </h2>
            <p className="text-gray-600 text-lg">
              ShopEase began with a simple mission — to make premium-quality products accessible for everyone at honest prices.
            </p>
            <p className="text-gray-600 text-lg">
              From humble beginnings to a rapidly growing marketplace, our goal has always been to provide a seamless, fast, and joyful shopping experience.
            </p>
            <p className="text-gray-700 font-semibold text-xl">
              Quality that speaks. Service that feels.
            </p>
          </motion.div>
        </div>
      </section>

      {/* MISSION STATS */}
      <section className="py-20 px-6 md:px-16 bg-[#f7fafc]">
        <h2 className="text-center text-4xl font-extrabold text-gray-900 mb-14">Our Mission</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto">
          {[ 
            { icon: ShoppingBag, value: "10,000+", label: "Products Delivered" },
            { icon: Users, value: "5,000+", label: "Happy Customers" },
            { icon: Star, value: "4.9/5", label: "Average Rating" },
            { icon: Truck, value: "24–48 hrs", label: "Fast Delivery" }
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 text-center hover:shadow-2xl transition transform hover:-translate-y-1"
              >
                <div className="mx-auto mb-4 p-4 w-fit rounded-full bg-gradient-to-r from-blue-50 to-indigo-50">
                  <Icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-3xl font-extrabold text-gray-900">{item.value}</h3>
                <p className="text-gray-600 mt-1">{item.label}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-24 px-6 md:px-16 bg-gradient-to-br from-blue-50 to-white">
        <h1 className="text-4xl font-extrabold text-center mb-16 text-gray-900">
          Why Shop with <span className="text-blue-600">ShopEase?</span>
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-7xl mx-auto">
          {[ 
            { icon: ShieldCheck, title: "Trusted Quality", desc: "Every product goes through quality checks before shipping." },
            { icon: Truck, title: "Superfast Delivery", desc: "Express deliveries across major cities in India." },
            { icon: Star, title: "Top Rated", desc: "A highly rated platform loved by thousands of shoppers." },
            { icon: Users, title: "Customer First", desc: "We focus on satisfaction and long-term trust." }
          ].map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="group bg-white/80 backdrop-blur-xl rounded-3xl p-10 text-center border border-gray-100 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2"
              >
                <div className="mx-auto mb-5 p-4 w-fit rounded-full bg-blue-100 group-hover:bg-blue-600 transition-all">
                  <Icon className="w-8 h-8 text-blue-600 group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{card.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{card.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
