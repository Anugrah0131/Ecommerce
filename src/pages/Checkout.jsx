// Checkout.jsx — Premium E‑Commerce Checkout (Upgraded)
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, CreditCard, Truck, IndianRupee, ShieldCheck, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState("cod");
  const [shippingMethod, setShippingMethod] = useState("standard");

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const GST_RATE = 0.18;
  const DELIVERY_FEE = shippingMethod === "express" ? 149 : 79;
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

  // Pricing
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
  const finalDelivery = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const grandTotal = taxable + gst + finalDelivery;

const handlePlaceOrder = () => {
  // Validate form
  for (let key in form) {
    if (!form[key].trim()) {
      alert(`Please fill in ${key}!`);
      return;
    }
  }

  if (!selectedPayment) {
    alert("Please select a payment method");
    return;
  }

  // Generate a unique order ID
  const orderId = "ORD" + Math.floor(100000 + Math.random() * 900000);

  const finalOrder = {
    id: orderId, // used for MyOrders/PastOrders
    orderId,     // used for tracking
    form,
    cart,
    paymentMethod: selectedPayment,
    shippingMethod,
    grandTotal,
    status: "Placed", // initial status
    placedAt: new Date().toISOString(),
  };

  // Save as latest_order for tracking page
  localStorage.setItem("latest_order", JSON.stringify(finalOrder));

  // Save to all_orders array
  const allOrders = JSON.parse(localStorage.getItem("all_orders")) || [];
  allOrders.push(finalOrder);
  localStorage.setItem("all_orders", JSON.stringify(allOrders));

  // Clear cart
  localStorage.removeItem("cart");

  // Redirect to order success
  navigate("/order-success");
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 py-10 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto text-white">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/80 mb-6 hover:text-white">
          <ArrowLeft /> Back
        </button>

        <h1 className="text-4xl font-extrabold mb-6">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping */}
            <motion.div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-xl">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><MapPin /> Shipping Details</h2>

              <div className="space-y-4">
                {["fullName", "phone", "address", "city", "state", "pincode"].map((key) => (
                  <input
                    key={key}
                    placeholder={key.replace(/([A-Z])/g, " $1").toUpperCase()}
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 placeholder-white/60"
                  />
                ))}
              </div>
            </motion.div>

            {/* Shipping Method */}
            <motion.div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-xl">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Truck /> Shipping Method</h2>

              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input type="radio" checked={shippingMethod === "standard"} onChange={() => setShippingMethod("standard")} />
                  <span>Standard Delivery – ₹79 (3–5 Days)</span>
                </label>

                <label className="flex items-center gap-3">
                  <input type="radio" checked={shippingMethod === "express"} onChange={() => setShippingMethod("express")} />
                  <span>Express Delivery – ₹149 (1–2 Days)</span>
                </label>
              </div>
            </motion.div>

            {/* Payment Options */}
            <motion.div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-xl">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><CreditCard /> Payment Options</h2>

              <div className="space-y-4">
                <label className="flex items-center gap-3">
                  <input type="radio" checked={selectedPayment === "cod"} onChange={() => setSelectedPayment("cod")} />
                  <span>Cash on Delivery</span>
                </label>

                <label className="flex items-center gap-3">
                  <input type="radio" checked={selectedPayment === "card"} onChange={() => setSelectedPayment("card")} />
                  <span>Credit / Debit Card</span>
                </label>

                <label className="flex items-center gap-3">
                  <input type="radio" checked={selectedPayment === "upi"} onChange={() => setSelectedPayment("upi")} />
                  <span>UPI (GPay / PhonePe / Paytm)</span>
                </label>

                <label className="flex items-center gap-3">
                  <input type="radio" checked={selectedPayment === "netbanking"} onChange={() => setSelectedPayment("netbanking")} />
                  <span>Net Banking</span>
                </label>
              </div>
            </motion.div>
          </div>

          {/* RIGHT SIDE */}
          <motion.div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Wallet /> Order Summary</h2>

            <div className="space-y-3 mb-6">
              {cart.map((i) => (
                <div key={i._id} className="flex justify-between border-b border-white/10 pb-3">
                  <span>{i.title} (x{i.quantity})</span>
                  <span>{fmt(i.price * i.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-white/90">
              <div className="flex justify-between"><span>Subtotal:</span><span>{fmt(subtotal)}</span></div>
              <div className="flex justify-between text-green-400"><span>Discount:</span><span>-{fmt(discount)}</span></div>
              <div className="flex justify-between"><span>GST (18%):</span><span>{fmt(gst)}</span></div>
              <div className="flex justify-between"><span>Delivery Fee:</span><span>{finalDelivery === 0 ? "Free" : fmt(finalDelivery)}</span></div>

              <hr className="border-white/20 my-3" />

              <div className="flex justify-between text-2xl font-bold"><span>Total:</span><span>{fmt(grandTotal)}</span></div>
            </div>

            <button onClick={handlePlaceOrder} className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg shadow-xl hover:scale-105 transition">
              Place Order
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
