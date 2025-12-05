// Profile.jsx — Classic Elegant E‑Commerce Profile Page
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, MapPin, Package, CreditCard, Save, Trash2, ShieldCheck } from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, brand: "Visa", last4: "4242" },
    { id: 2, brand: "Mastercard", last4: "5511" },
  ]);

  const [orders, setOrders] = useState([
    { id: "ORD7342", date: "2025-01-22", total: 1299, status: "Delivered" },
    { id: "ORD7231", date: "2025-01-18", total: 899, status: "Shipped" },
    { id: "ORD7194", date: "2025-01-12", total: 499, status: "Processing" },
  ]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user_profile"));
    if (stored) setProfile(stored);
  }, []);

  const handleSave = () => {
    localStorage.setItem("user_profile", JSON.stringify(profile));
    alert("Profile updated!");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 mt-6 font-sans text-gray-800 bg-gray-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 md:gap-0">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 tracking-tight">My Account</h1>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("user_profile");
            navigate("/login");
            window.dispatchEvent(new Event("storage"));
          }}
          className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition w-full md:w-auto text-center shadow"
        >
          Logout
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Profile Info */}
        <motion.div
          layout
          className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition"
        >
          <h2 className="text-xl font-serif font-semibold mb-4 flex items-center gap-2 text-blue-800">
            <User size={20} /> Profile Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Full Name", name: "name", type: "text", placeholder: "Your name" },
              { label: "Email", name: "email", type: "email", placeholder: "you@example.com" },
              { label: "Phone", name: "phone", type: "text", placeholder: "9876543210" },
            ].map((field) => (
              <div key={field.name}>
                <label className="text-sm text-gray-700">{field.label}</label>
                <input
                  name={field.name}
                  type={field.type}
                  className="w-full mt-1 border border-gray-300 bg-white rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                  value={profile[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                />
              </div>
            ))}
          </div>

          <h3 className="text-lg font-serif font-semibold mt-6 mb-2 flex items-center gap-2 text-blue-800">
            <MapPin size={20} /> Shipping Address
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm text-gray-700">Address</label>
              <input
                name="address"
                className="w-full mt-1 border border-gray-300 bg-white rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                value={profile.address}
                onChange={handleChange}
                placeholder="Street, area"
              />
            </div>
            <div>
              <label className="text-sm text-gray-700">City</label>
              <input
                name="city"
                className="w-full mt-1 border border-gray-300 bg-white rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                value={profile.city}
                onChange={handleChange}
                placeholder="City"
              />
            </div>
            <div>
              <label className="text-sm text-gray-700">Pincode</label>
              <input
                name="pincode"
                className="w-full mt-1 border border-gray-300 bg-white rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                value={profile.pincode}
                onChange={handleChange}
                placeholder="560001"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            className="mt-6 w-full bg-gradient-to-r from-yellow-500 to-yellow-600 py-3 rounded-lg flex items-center justify-center gap-2 text-white font-semibold shadow hover:scale-105 transition"
          >
            <Save size={20} /> Save Changes
          </button>
        </motion.div>

        {/* Right: Orders + Security + Payment */}
        <div className="flex flex-col space-y-6">
          {/* Order History */}
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition">
            <h2 className="text-xl font-serif font-semibold mb-4 flex items-center gap-2 text-blue-800">
              <Package size={20} /> Recent Orders
            </h2>
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 hover:bg-gray-50 transition">
                  <div>
                    <p className="font-medium text-gray-900">{order.id}</p>
                    <p className="text-sm text-gray-500">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-yellow-700">₹{order.total}</p>
                    <p className={`text-sm ${order.status === "Delivered" ? "text-green-600" : order.status === "Shipped" ? "text-blue-600" : "text-gray-500"}`}>
                      {order.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Account Security */}
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition">
            <h2 className="text-xl font-serif font-semibold mb-4 flex items-center gap-2 text-blue-800">
              <ShieldCheck size={20} /> Security
            </h2>
            <button className="w-full border border-gray-300 rounded-lg py-3 mb-3 text-gray-800 hover:bg-gray-100 transition font-medium">Change Password</button>
            <button className="w-full border border-red-500 rounded-lg py-3 text-red-600 hover:bg-red-50 transition font-medium">Delete Account</button>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition">
            <h2 className="text-xl font-serif font-semibold mb-4 flex items-center gap-2 text-blue-800">
              <CreditCard size={20} /> Saved Cards
            </h2>
            <div className="space-y-3">
              {paymentMethods.map((card) => (
                <div key={card.id} className="border border-gray-200 rounded-lg p-3 flex justify-between items-center hover:bg-gray-50 transition">
                  <p className="text-gray-900">{card.brand} •••• {card.last4}</p>
                  <Trash2 size={18} className="text-red-600 cursor-pointer hover:text-red-700 transition" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
