import React from "react";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Star,
  ShieldCheck,
  Truck,
  Users,
} from "lucide-react";

export default function About() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 font-inter text-gray-800">

      {/* ================= HERO ================= */}
      <section className="py-24 px-6 md:px-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center">

          {/* LEFT TEXT */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
              About{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                ShopEase
              </span>
            </h1>

            <p className="text-lg text-gray-600 max-w-md">
              Your trusted place for modern, fast, and joyful shopping — where
              quality meets convenience.
            </p>
          </motion.div>

          {/* RIGHT IMAGE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <img
              src="/newlogo.png"
              alt="About ShopEase"
              className="rounded-3xl shadow-2xl object-cover h-96 w-full 
              hover:scale-105 transition-transform duration-500"
            />

            <div className="absolute -top-5 -right-5 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2 rounded-2xl shadow-xl text-sm font-semibold">
              10+ Years Trusted
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= OUR STORY ================= */}
      <section className="py-20 px-6 md:px-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center">

          {/* LEFT IMAGE */}
          <motion.img
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1200&q=80"
            className="rounded-3xl shadow-xl object-cover h-96 w-full"
          />

          {/* RIGHT TEXT */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-4xl font-extrabold text-gray-900">
              Our Story
            </h2>

            <p className="text-gray-600 text-lg">
              ShopEase started with a vision — bringing premium products to
              everyone without the premium price tag.
            </p>

            <p className="text-gray-600 text-lg">
              From humble beginnings to a growing marketplace, our goal remains
              simple: seamless shopping that feels effortless.
            </p>

            <p className="text-gray-700 font-semibold text-xl">
              Quality that speaks. Service that stays.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ================= MISSION STATS ================= */}
      <section className="py-20 px-6 md:px-16">
        <h2 className="text-center text-4xl font-extrabold text-gray-900 mb-14">
          Our Mission
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto">

          {[
            { icon: ShoppingBag, value: "10,000+", label: "Products Delivered" },
            { icon: Users, value: "5,000+", label: "Happy Customers" },
            { icon: Star, value: "4.9/5", label: "Average Rating" },
            { icon: Truck, value: "24–48 hrs", label: "Fast Delivery" },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-lg border border-white/50 
                text-center hover:shadow-2xl transition-all hover:-translate-y-2"
              >
                <div className="mx-auto mb-4 p-4 w-fit rounded-full bg-blue-50">
                  <Icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-3xl font-extrabold text-gray-900">{item.value}</h3>
                <p className="text-gray-600 mt-1">{item.label}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      <section className="py-24 px-6 md:px-16 bg-gradient-to-br from-blue-50 to-white">
        <h1 className="text-4xl font-extrabold text-center mb-16 text-gray-900">
          Why Choose <span className="text-blue-600">ShopEase?</span>
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-7xl mx-auto">
          {[
            {
              icon: ShieldCheck,
              title: "Trusted Quality",
              desc: "Every product passes through strict quality checks.",
            },
            {
              icon: Truck,
              title: "Fast Delivery",
              desc: "Lightning-fast delivery across top Indian cities.",
            },
            {
              icon: Star,
              title: "Top Rated",
              desc: "Highly rated and loved by thousands.",
            },
            {
              icon: Users,
              title: "Customer First",
              desc: "We focus on trust, reliability, and satisfaction.",
            },
          ].map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="group bg-white/80 backdrop-blur-xl rounded-3xl p-10 text-center 
                border border-white/50 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2"
              >
                <div className="mx-auto mb-5 p-4 rounded-full bg-blue-100 group-hover:bg-blue-600 transition-all">
                  <Icon className="w-8 h-8 text-blue-600 group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{c.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{c.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
