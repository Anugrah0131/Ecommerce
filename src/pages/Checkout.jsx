// /src/pages/Checkout.jsx
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, CreditCard, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition duration-150 outline-none"
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
        <div className="text-white/60 text-sm text-center py-4">Your cart is empty</div>
      ) : (
        items.map((it, idx) => {
          const id = safeGet(it, "_id", "id", "productId") ?? `item-${idx}`;
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
  const [mounted, setMounted] = useState(false);
  const [cart, setCart] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Form states
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pincode, setPincode] = useState("");

  const GST_RATE = 0.18;
  const DELIVERY_FEE = 79;
  const FREE_DELIVERY_THRESHOLD = 4000;

  useEffect(() => {
    setMounted(true);
    try {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      const storedCoupon = JSON.parse(localStorage.getItem("cart_coupon")) || null;
      setCart(Array.isArray(storedCart) ? storedCart : []);
      setAppliedCoupon(storedCoupon);
    } catch (err) {
      console.error("Storage error:", err);
    }
  }, []);

  const totals = useMemo(() => {
    const subtotal = cart.reduce((s, i) => {
      const price = Number(safeGet(i, "price", "unitPrice") ?? 0);
      const qty = Number(safeGet(i, "quantity", "qty") ?? 1);
      return s + price * qty;
    }, 0);

    let discount = 0;
    if (appliedCoupon?.amount) {
      discount = appliedCoupon.type === "percent" 
        ? Math.round((subtotal * Number(appliedCoupon.amount)) / 100) 
        : Number(appliedCoupon.amount);
    }

    const taxable = Math.max(0, subtotal - discount);
    const gst = Math.round(taxable * GST_RATE);
    const delivery = (subtotal > 0 && subtotal < FREE_DELIVERY_THRESHOLD) ? DELIVERY_FEE : 0;
    
    return { subtotal, discount, gst, delivery, grandTotal: taxable + gst + delivery };
  }, [cart, appliedCoupon]);
/* ------- Update only this function in your Checkout.jsx ------- */

const handlePlaceOrder = useCallback(async () => {
  // 1. Validation
  if (!fullName || !phone || !address || !city || !stateName || !pincode) {
    return alert("Please fill all shipping details");
  }

  // 2. Auth Check - Flexible detection
  const rawUser = localStorage.getItem("user");
  console.log("Raw user from storage:", rawUser); // Debug log

  let userData = null;
  try {
    userData = JSON.parse(rawUser);
  } catch (e) {
    userData = null;
  }

  // Extract ID (tries _id, then id, then checks if the whole thing is a string)
  const userId = userData?._id || userData?.id || (typeof userData === 'string' && userData !== "guest" ? userData : null);

  if (!userId || userId === "guest") {
    console.error("Auth Failed. UserData:", userData);
    alert("Login session not found. Please log in again to place an order.");
    return navigate("/login");
  }

  const orderBody = {
    userId: userId, // Use the extracted ID
    paymentMethod: "cod",
    amount: totals.grandTotal,
    shipping: { 
      fullName, 
      phone, 
      address, 
      city, 
      state: stateName, 
      pincode 
    },
    items: cart.map((i) => ({
      productId: i._id || i.productId || i.id,
      title: i.title || i.name,
      price: Number(i.price || 0),
      quantity: Number(i.quantity || 1),
      image: i.image || "",
    })),
  };

  try {
    const res = await fetch("http://localhost:8080/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderBody),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Server refused order");
    }

    localStorage.setItem("latest_order", JSON.stringify(data));
    localStorage.removeItem("cart");
    navigate("/order-success");
  } catch (err) {
    console.error("Order error:", err);
    alert(`Order failed: ${err.message}`);
  }
}, [fullName, phone, address, city, stateName, pincode, cart, totals, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 py-10 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 18 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="max-w-5xl mx-auto text-white"
      >
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/70 mb-6 hover:text-white transition p-2">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Return to Cart</span>
        </button>

        <h1 className="text-4xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-indigo-300">
          Secure Checkout
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <GlassPanel mounted={mounted}>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-pink-300">
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
                <StyledInput label="Pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} />
              </div>
            </GlassPanel>

            <GlassPanel mounted={mounted}>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-pink-300">
                <CreditCard className="w-6 h-6" /> Payment Method
              </h2>
              <div className="bg-white/5 p-4 rounded-lg border border-white/10 flex items-center justify-between">
                <p className="text-white/80">Currently only Cash on Delivery (COD) is supported.</p>
                <Truck className="w-5 h-5 text-pink-300" />
              </div>
            </GlassPanel>
          </div>

          <aside>
            <GlassPanel mounted={mounted} className="sticky top-10">
              <h2 className="text-xl font-bold mb-4 text-pink-300">Order Summary</h2>
              <CartList items={cart} priceFormatter={fmt} />
              
              <div className="space-y-3 mt-6 border-t border-white/10 pt-4 text-white/80">
                <div className="flex justify-between"><span>Subtotal</span><span>{fmt(totals.subtotal)}</span></div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-green-400"><span>Discount</span><span>-{fmt(totals.discount)}</span></div>
                )}
                <div className="flex justify-between"><span>GST (18%)</span><span>{fmt(totals.gst)}</span></div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>{totals.delivery === 0 ? <span className="text-cyan-400">FREE</span> : fmt(totals.delivery)}</span>
                </div>
                <div className="flex justify-between text-2xl font-bold text-white pt-2 border-t border-white/20">
                  <span>Total</span><span className="text-pink-300">{fmt(totals.grandTotal)}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                className="w-full mt-6 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-lg shadow-xl hover:brightness-110 active:scale-95 transition-all"
              >
                PLACE ORDER
              </button>
            </GlassPanel>
          </aside>
        </div>
      </motion.div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}