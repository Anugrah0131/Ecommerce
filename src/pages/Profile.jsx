// Profile.jsx — Realistic E‑Commerce Profile Page
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, MapPin, Package, CreditCard, Phone, Save, Trash2, ShieldCheck } from "lucide-react";

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

  // Load from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user_profile"));
    if (stored) setProfile(stored);
  }, []);

  // Save to localStorage
  const handleSave = () => {
    localStorage.setItem("user_profile", JSON.stringify(profile));
    alert("Profile updated!");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-5xl mx-auto p-6 mt-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Account</h1>
    <button
        onClick={() => {
           localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("user_profile");
            navigate("/login");
            window.dispatchEvent(new Event("storage")); // forces navbar refresh
      }}
         className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
     >
      Logout
      </button>

      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Profile Info */}
        <motion.div layout className="lg:col-span-2 bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><User size={18}/> Profile Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Full Name</label>
              <input
                name="name"
                className="w-full mt-1 border rounded-xl px-4 py-3"
                value={profile.name}
                onChange={handleChange}
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                name="email"
                type="email"
                className="w-full mt-1 border rounded-xl px-4 py-3"
                value={profile.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Phone</label>
              <input
                name="phone"
                className="w-full mt-1 border rounded-xl px-4 py-3"
                value={profile.phone}
                onChange={handleChange}
                placeholder="9876543210"
              />
            </div>
          </div>

          <h3 className="text-lg font-semibold mt-6 mb-2 flex items-center gap-2"><MapPin size={18}/> Shipping Address</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm text-gray-600">Address</label>
              <input
                name="address"
                className="w-full mt-1 border rounded-xl px-4 py-3"
                value={profile.address}
                onChange={handleChange}
                placeholder="Street, area"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">City</label>
              <input
                name="city"
                className="w-full mt-1 border rounded-xl px-4 py-3"
                value={profile.city}
                onChange={handleChange}
                placeholder="City"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Pincode</label>
              <input
                name="pincode"
                className="w-full mt-1 border rounded-xl px-4 py-3"
                value={profile.pincode}
                onChange={handleChange}
                placeholder="560001"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            className="mt-6 w-full bg-black text-white py-3 rounded-xl flex items-center justify-center gap-2"
          >
            <Save size={18}/> Save Changes
          </button>
        </motion.div>

        {/* Right: Order History + Payment Methods */}
        <div className="space-y-6">
          {/* Order History */}
          <div className="bg-white shadow rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Package size={18}/> Recent Orders</h2>

            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="border rounded-lg p-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-gray-600">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{order.total}</p>
                    <p className="text-sm text-green-600">{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Account Security */}
          <div className="bg-white shadow rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><ShieldCheck size={18}/> Security</h2>
            <button className="w-full border rounded-xl py-3 mb-3 hover:bg-gray-50 transition">Change Password</button>
            <button className="w-full border rounded-xl py-3 text-red-600 hover:bg-red-50 transition">Delete Account</button>
          </div>

          {/* Payment Methods */}
          <div className="bg-white shadow rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><CreditCard size={18}/> Saved Cards</h2>
            <div className="space-y-3">
              {paymentMethods.map((card) => (
                <div key={card.id} className="border rounded-lg p-3 flex justify-between items-center">
                  <p>{card.brand} •••• {card.last4}</p>
                  <Trash2 size={18} className="text-red-500 cursor-pointer" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
