// /src/pages/Checkout.jsx
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, CreditCard, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * Optimized Checkout page
 * - Individual input states for smooth typing
 * - Memoized pricing & cart list
 * - Buttons explicitly type="button" (prevents accidental form submit)
 * - Safe getters for various cart item shapes
 * - Framer-motion animations run once on mount
 */

/* ------- Helpers ------- */
const safeGet = (obj, ...keys) => {
  for (const k of keys) {
    if (obj && typeof obj[k] !== "undefined") return obj[k];
  }
  return undefined;
};

const fmt = (v = 0) =>
  typeof v === "number" ? `₹${Math.round(v).toLocaleString()}` : `₹0`;

/* ------- Memoized subcomponents ------- */
const GlassPanel = React.memo(function GlassPanel({ children, mounted, className = "" }) {
  // animation only depends on `mounted` which flips once on mount
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={mounted ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.98 }}
      transition={{ type: "spring", stiffness: 120, damping: 16, delay: 0.06 }}
      className={`bg-white/5 backdrop-blur-3xl rounded-[1.25rem] border border-white/30 p-6 shadow-[0_6px_24px_rgba(0,0,0,0.12)] ${className}`}
    >
      {children}
    </motion.div>
  );
});

const StyledInput = React.memo(function StyledInput({ label, value, onChange, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-white/80 mb-1">{label}</label>
      <input
        className="w-full px-4 py-3 rounded-lg bg-white/8 border border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition duration-150"
        placeholder={label}
        value={value}
        onChange={onChange}
        {...props}
      />
    </div>
  );
});

const CartList = React.memo(function CartList({ items, priceFormatter }) {
  return (
    <div className="space-y-3 mb-4 max-h-56 overflow-y-auto pr-2 custom-scrollbar">
      {items.length === 0 ? (
        <div className="text-white/60 text-sm">Your cart is empty</div>
      ) : (
        items.map((it) => {
          const id = safeGet(it, "_id", "id", "productId") ?? Math.random().toString(36).slice(2, 8);
          const title = safeGet(it, "title", "name") ?? "Item";
          const price = Number(safeGet(it, "price", "unitPrice") ?? 0);
          const qty = Number(safeGet(it, "quantity", "qty") ?? 1);
          return (
            <div key={id} className="flex justify-between items-center text-white/90 pb-2 border-b border-white/8">
              <span className="font-light truncate max-w-[70%]">
                {title} <span className="text-white/60 text-sm ml-2">(x{qty})</span>
              </span>
              <span className="font-medium">{priceFormatter(price * qty)}</span>
            </div>
          );
        })
      )}
    </div>
  );
});

/* ------- Main Component ------- */
export default function Checkout() {
  const navigate = useNavigate();

  // mounted toggles to true once on client mount so animations run only once
  const [mounted, setMounted] = useState(false);

  // cart and coupon come from localStorage (unchanged structure support)
  const [cart, setCart] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Individual input states to avoid re-rendering whole page on each keystroke
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pincode, setPincode] = useState("");

  // constants
  const GST_RATE = 0.18;
  const DELIVERY_FEE = 79;
  const FREE_DELIVERY_THRESHOLD = 4000;

  useEffect(() => {
    // only run on client
    setMounted(true);

    try {
      const stored = JSON.parse(localStorage.getItem("cart")) || [];
      const coupon = JSON.parse(localStorage.getItem("cart_coupon")) || null;
      setCart(Array.isArray(stored) ? stored : []);
      setAppliedCoupon(coupon);
    } catch (err) {
      console.error("Failed to parse cart from localStorage", err);
      setCart([]);
    }
  }, []);

  // Memoize price calculations so typing doesn't recalc heavy things
  const totals = useMemo(() => {
    const subtotal = cart.reduce((s, i) => {
      const price = Number(safeGet(i, "price", "unitPrice") ?? 0);
      const qty = Number(safeGet(i, "quantity", "qty") ?? 1);
      return s + price * qty;
    }, 0);

    let discount = 0;
    if (appliedCoupon && typeof appliedCoupon === "object") {
      if (appliedCoupon.type === "percent") {
        discount = Math.round((subtotal * (Number(appliedCoupon.amount) || 0)) / 100);
      } else if (appliedCoupon.type === "fixed") {
        discount = Number(appliedCoupon.amount) || 0;
      }
    }

    const taxable = Math.max(0, subtotal - discount);
    const gst = Math.round(taxable * GST_RATE);
    const delivery = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
    const grandTotal = taxable + gst + delivery;

    return { subtotal, discount, gst, delivery, grandTotal };
  }, [cart, appliedCoupon]);

  // stable callbacks to avoid re-creating on each render
  const handlePlaceOrder = useCallback(() => {
    // validation
    if (!fullName.trim()) return alert("Please enter Full Name");
    if (!phone.trim()) return alert("Please enter Phone Number");
    if (!address.trim()) return alert("Please enter Address");
    if (!city.trim()) return alert("Please enter City");
    if (!stateName.trim()) return alert("Please enter State");
    if (!pincode.toString().trim()) return alert("Please enter Pincode");

    const order = {
      form: { fullName, phone, address, city, state: stateName, pincode },
      cart,
      totals,
      createdAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem("order_details", JSON.stringify(order));
      localStorage.removeItem("cart");
    } catch (err) {
      console.error("Failed to save order", err);
    }

    // navigate after writing to storage
    navigate("/order-success");
  }, [fullName, phone, address, city, stateName, pincode, cart, totals, navigate]);

  // small handlers
  const back = useCallback(() => navigate(-1), [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 py-10 px-4">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.36 }} className="max-w-5xl mx-auto text-white">
        <button onClick={back} type="button" className="flex items-center gap-2 text-white/70 mb-6 hover:text-white transition duration-150 p-2 rounded">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Return to Cart</span>
        </button>

        <h1 className="text-4xl font-extrabold mb-8 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-indigo-300">
          Secure Checkout
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT: Shipping & Payment */}
          <div className="lg:col-span-2 space-y-6">
            <GlassPanel mounted={mounted}>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-pink-300">
                <MapPin className="w-6 h-6" /> Shipping Details
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <StyledInput label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                <StyledInput label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" />
              </div>

              <div className="mt-4">
                <StyledInput label="Full Address" value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>

              <div className="grid md:grid-cols-3 gap-4 mt-4">
                <StyledInput label="City" value={city} onChange={(e) => setCity(e.target.value)} />
                <StyledInput label="State" value={stateName} onChange={(e) => setStateName(e.target.value)} />
                <StyledInput label="Pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} type="text" />
              </div>
            </GlassPanel>

            <GlassPanel mounted={mounted}>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-pink-300">
                <CreditCard className="w-6 h-6" /> Payment Method
              </h2>

              <div className="bg-white/8 p-4 rounded-lg border border-white/12 flex items-center justify-between">
                <p className="text-white/80 font-medium">Currently only Cash on Delivery (COD) is supported.</p>
                <Truck className="w-5 h-5 text-pink-300" />
              </div>
            </GlassPanel>
          </div>

          {/* RIGHT: Summary */}
          <div>
            <GlassPanel mounted={mounted}>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-pink-300">
                <CreditCard className="w-6 h-6" /> Order Summary
              </h2>

              <CartList items={cart} priceFormatter={fmt} />

              <div className="space-y-3 text-white/80 text-base">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{fmt(totals.subtotal)}</span>
                </div>

                <div className="flex justify-between text-green-400">
                  <span>Discount</span>
                  <span>-{fmt(totals.discount)}</span>
                </div>

                <div className="flex justify-between">
                  <span>GST ({GST_RATE * 100}%)</span>
                  <span>{fmt(totals.gst)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>{totals.delivery === 0 ? <span className="text-cyan-400">Free</span> : fmt(totals.delivery)}</span>
                </div>

                <hr className="border-white/20 my-3" />

                <div className="flex justify-between text-xl font-extrabold text-pink-300">
                  <span>Grand Total</span>
                  <span>{fmt(totals.grandTotal)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handlePlaceOrder}
                className="w-full mt-5 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-extrabold text-lg shadow-lg shadow-pink-500/25 hover:scale-[1.01] transition-transform duration-150"
              >
                Place Order
              </button>
            </GlassPanel>
          </div>
        </div>
      </motion.div>

      {/* optional tiny scrollbar style */}
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar { width: 8px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.03); border-radius: 8px; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.14); border-radius: 8px; }
        `}
      </style>
    </div>
  );
}
