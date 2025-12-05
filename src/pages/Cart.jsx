// Cart.jsx — PREMIUM GLASSMORPHIC DRAWER (FIXED)
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Minus, Plus, X, Tag } from "lucide-react";
import { Link } from "react-router-dom";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);

  const GST_RATE = 0.18;
  const FREE_DELIVERY_THRESHOLD = 4000;
  const DELIVERY_FEE = 79;

  const VALID_COUPONS = [
    { code: "SAVE10", type: "percent", amount: 10 },
    { code: "FLAT500", type: "fixed", amount: 500 },
    { code: "FREESHIP", type: "freeShip", amount: 0 },
  ];

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("cart")) || [];
      const savedCoupon =
        JSON.parse(localStorage.getItem("cart_coupon")) || null;

      setCart(stored);
      setAppliedCoupon(savedCoupon);
      setCouponInput(savedCoupon?.code || "");
    } catch {}
  }, []);

  useEffect(() => {
  const syncCart = () => {
    const stored = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(stored);
  };

  // Listen for updates
  window.addEventListener("cartUpdated", syncCart);

  // Cleanup
  return () => window.removeEventListener("cartUpdated", syncCart);
}, []);


  const persistCart = (updated) => {
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const showToast = (msg, type = "info") => {
    const t = document.createElement("div");
    t.className = `
      fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl text-white shadow-xl 
      backdrop-blur-xl font-semibold tracking-wide
      ${type === "error" ? "bg-red-500/90" : ""}
      ${type === "success" ? "bg-green-500/90" : ""}
      ${type === "info" ? "bg-indigo-500/90" : ""}
    `;
    t.innerText = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 1800);
  };

  const updateQuantity = (id, amt) => {
    const updated = cart.map((item) => {
      if (item._id === id) {
        const qty = Math.max(1, item.quantity + amt);
        return { ...item, quantity: qty };
      }
      return item;
    });

    persistCart(updated);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const removeItem = (id) => {
    const updated = cart.filter((i) => i._id !== id);
    persistCart(updated);
    window.dispatchEvent(new Event("cartUpdated"));
    showToast("Item removed", "error");
  };

  const fmt = (v) => `₹${v.toLocaleString()}`;

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

  const applyCoupon = () => {
    const c = VALID_COUPONS.find(
      (x) => x.code.toLowerCase() === couponInput.toLowerCase()
    );
    if (!c) return showToast("Invalid coupon", "error");

    setAppliedCoupon(c);
    localStorage.setItem("cart_coupon", JSON.stringify(c));
    showToast("Coupon applied", "success");
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    localStorage.removeItem("cart_coupon");
    setCouponInput("");
    showToast("Coupon removed", "info");
  };

  return (
    <>
      {/* Button (triggerable from Navbar) */}
      <button
        onClick={() => setDrawerOpen(true)}
        className="hidden"
        id="openCartDrawerButton"
      ></button>

      {/* Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.45 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-black z-40"
            />

            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
              className="
                fixed right-0 top-0 h-full w-full sm:w-[430px] z-50 
                bg-white/10 backdrop-blur-2xl
                border-l border-white/20 shadow-2xl
                p-6 overflow-y-auto
              "
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-3xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Your Cart
                </h3>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition"
                >
                  <X size={22} className="text-gray-700" />
                </button>
              </div>

              {/* Items */}
              <div className="space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-20">
                    <h4 className="text-xl font-semibold">Your cart is empty</h4>
                    <p className="text-gray-500 mt-2">Add items to begin</p>
                    <Link
                      to="/"
                      onClick={() => setDrawerOpen(false)}
                      className="mt-4 inline-block px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                ) : (
                  cart.map((item) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="
                        p-4 rounded-2xl bg-white/20 backdrop-blur-xl 
                        border border-white/30 shadow-lg flex gap-4
                      "
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-20 h-20 rounded-xl object-cover shadow"
                      />

                      <div className="flex-1">
                        <h4 className="font-semibold line-clamp-2">
                          {item.title}
                        </h4>

                        <div className="mt-3 flex justify-between items-center">
                          {/* Qty */}
                          <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                            <button
                              onClick={() => updateQuantity(item._id, -1)}
                              disabled={item.quantity === 1}
                            >
                              <Minus size={14} />
                            </button>
                            <span className="font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item._id, 1)}
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          {/* Price + Remove */}
                          <div className="text-right">
                            <p className="font-bold text-purple-600">
                              {fmt(item.price * item.quantity)}
                            </p>
                            <button
                              onClick={() => removeItem(item._id)}
                              className="text-red-500 text-xs flex items-center gap-1"
                            >
                              <Trash2 size={14} /> Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Coupon */}
              <div className="mt-6 p-4 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30">
                <div className="flex items-center gap-3">
                  <Tag />
                  <div>
                    <div className="font-semibold">Apply Coupon</div>
                    <p className="text-sm text-gray-600">Get discounts</p>
                  </div>
                </div>

                <div className="mt-3 flex gap-3">
                  <input
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-xl bg-white/40 border"
                    placeholder="Enter coupon"
                  />
                  {!appliedCoupon ? (
                    <button
                      onClick={applyCoupon}
                      className="px-4 py-2 rounded-xl bg-indigo-600 text-white"
                    >
                      Apply
                    </button>
                  ) : (
                    <button
                      onClick={removeCoupon}
                      className="px-4 py-2 rounded-xl bg-red-500 text-white"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              {/* Pricing */}
              <div className="mt-6 p-4 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>{fmt(subtotal)}</span>
                </div>
                <div className="flex justify-between mt-2 text-green-600">
                  <span>Discount</span>
                  <span>-{fmt(discount)}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span>GST (18%)</span>
                  <span>{fmt(gst)}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span>Delivery Fee</span>
                  <span>{delivery === 0 ? "Free" : fmt(delivery)}</span>
                </div>

                <div className="border-t mt-3 mb-3" />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{fmt(grandTotal)}</span>
                </div>
              </div>

              <div className="mt-5">
    <button
  onClick={() => {
    if (cart.length === 0) {
      showToast("Add at least one product to proceed", "error");
      return;
    }

    setDrawerOpen(false);
    window.location.href = "/checkout";
  }}
  className={`
    w-full py-3 rounded-xl font-semibold shadow-xl
    bg-gradient-to-r from-purple-600 to-pink-600 text-white
    ${cart.length === 0 ? "opacity-50 cursor-not-allowed" : ""}
  `}
>
  Proceed to Checkout
</button>


              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
