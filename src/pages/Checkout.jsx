// Checkout.jsx — Premium Glassmorphic Checkout Page
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, CreditCard, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const GST_RATE = 0.18;
  const DELIVERY_FEE = 79;
  const FREE_DELIVERY_THRESHOLD = 4000;

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("cart")) || [];
      const coupon = JSON.parse(localStorage.getItem("cart_coupon")) || null;

      setCart(stored);
      setAppliedCoupon(coupon);
    } catch {}
  }, []);

  const fmt = (v) => `₹${v.toLocaleString()}`;

  // Pricing Calculations
  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const discount = appliedCoupon
    ? appliedCoupon.type === "percent"
      ? Math.round((subtotal * appliedCoupon.amount) / 100)
      : appliedCoupon.type === "fixed"
      ? appliedCoupon.amount
      : 0
    : 0;

  const taxable = subtotal - discount;
  const gst = Math.round(taxable * GST_RATE);
  const delivery = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const grandTotal = taxable + gst + delivery;

  const handlePlaceOrder = () => {
    // Validate form
    for (let key in form) {
      if (!form[key].trim()) {
        alert(`Please fill in ${key.replace(/([A-Z])/g, ' $1')}!`);
        return;
      }
    }

    // Save order to localStorage (optional)
    localStorage.setItem("order_details", JSON.stringify({ form, cart, grandTotal }));

    // Clear cart on success
    localStorage.removeItem("cart");

    navigate("/order-success");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto text-white"
      >
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/80 mb-6 hover:text-white"
        >
          <ArrowLeft /> Back
        </button>

        <h1 className="text-4xl font-extrabold mb-6">Checkout</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* LEFT — SHIPPING FORM */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-xl"
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <MapPin /> Shipping Details
            </h2>

            <div className="space-y-4">
              {[
                { label: "Full Name", key: "fullName" },
                { label: "Phone Number", key: "phone" },
                { label: "Address", key: "address" },
                { label: "City", key: "city" },
                { label: "State", key: "state" },
                { label: "Pincode", key: "pincode" },
              ].map((f) => (
                <input
                  key={f.key}
                  placeholder={f.label}
                  value={form[f.key]}
                  onChange={(e) =>
                    setForm({ ...form, [f.key]: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 placeholder-white/60"
                />
              ))}
            </div>
          </motion.div>

          {/* RIGHT — ORDER SUMMARY */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-xl"
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <CreditCard /> Order Summary
            </h2>

            <div className="space-y-3 mb-6">
              {cart.map((i) => (
                <div
                  key={i._id}
                  className="flex justify-between border-b border-white/10 pb-3"
                >
                  <span>
                    {i.title} (x{i.quantity})
                  </span>
                  <span>{fmt(i.price * i.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-white/90">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{fmt(subtotal)}</span>
              </div>

              <div className="flex justify-between text-green-400">
                <span>Discount</span>
                <span>-{fmt(discount)}</span>
              </div>

              <div className="flex justify-between">
                <span>GST (18%)</span>
                <span>{fmt(gst)}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>
                  {delivery === 0 ? "Free" : fmt(delivery)}
                </span>
              </div>

              <hr className="border-white/20 my-3" />

              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>{fmt(grandTotal)}</span>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg shadow-xl hover:scale-105 transition"
            >
              Place Order
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
