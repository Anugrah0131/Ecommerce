import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Minus, Plus } from "lucide-react";

export default function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(stored);
  }, []);

  const showToast = (message, type = "info") => {
    const toast = document.createElement("div");
    toast.className = `
      fixed top-5 right-5 px-5 py-3 rounded-xl shadow-xl z-50 
      text-white font-semibold animate-slide 
      ${
        type === "error"
          ? "bg-red-600"
          : type === "success"
          ? "bg-green-600"
          : "bg-blue-600"
      }
    `;
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 1800);
  };

  const updateQuantity = (id, amount) => {
    const updated = cart.map((item) => {
      if (item._id === id) {
        const newQty = Math.max(1, item.quantity + amount);
        if (newQty !== item.quantity)
          showToast(`Quantity updated to ${newQty}`, "success");
        return { ...item, quantity: newQty };
      }
      return item;
    });

    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const removeItem = (id) => {
    const updated = cart.filter((item) => item._id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    showToast("Item removed", "error");
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0)
    return (
      <h1 className="text-center mt-20 text-2xl font-semibold text-gray-600">
        Your cart is empty 🛒
      </h1>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">

      <h1 className="text-4xl font-bold text-gray-800 mb-10">
        Your Cart
      </h1>

      <div className="space-y-6">
        <AnimatePresence>
          {cart.map((item) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col md:flex-row justify-between items-center gap-5 
                         p-5 rounded-3xl
                         bg-white/70 backdrop-blur-md
                         border border-gray-200
                         shadow-lg hover:shadow-xl transition"
            >
              {/* LEFT SECTION */}
              <div className="flex items-center gap-5 w-full md:w-auto">
                <img
                  src={item.image}
                  className="w-24 h-24 rounded-2xl object-cover shadow-md"
                />
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {item.title}
                  </h2>
                  <p className="text-blue-600 font-bold text-lg">
                    ₹{item.price}
                  </p>
                </div>
              </div>

              {/* RIGHT SECTION */}
              <div className="flex items-center gap-6">

                {/* QUANTITY CONTROL */}
                <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 shadow-inner">
                  <button
                    onClick={() => updateQuantity(item._id, -1)}
                    disabled={item.quantity === 1}
                    className={`w-9 h-9 flex items-center justify-center 
                                bg-white rounded-full shadow 
                                hover:bg-gray-100 transition
                                ${
                                  item.quantity === 1
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                  >
                    <Minus size={18} />
                  </button>

                  <span className="px-4 text-lg font-semibold">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => updateQuantity(item._id, 1)}
                    className="w-9 h-9 flex items-center justify-center 
                               bg-white rounded-full shadow 
                               hover:bg-gray-100 transition"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                {/* REMOVE BUTTON */}
                <button
                  onClick={() => removeItem(item._id)}
                  className="flex items-center gap-2 bg-red-500 text-white 
                             px-5 py-2 rounded-2xl shadow hover:bg-red-600 transition font-medium"
                >
                  <Trash2 size={18} /> Remove
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* TOTAL BAR */}
      <div className="mt-12 p-6 bg-white/70 backdrop-blur-lg 
                      shadow-xl rounded-3xl border border-gray-200 text-right">
        <h2 className="text-3xl font-bold text-gray-800">
          Total: ₹{total.toLocaleString()}
        </h2>

        <button className="mt-5 bg-green-600 text-white px-8 py-3 rounded-2xl 
                           shadow-lg hover:bg-green-700 transition text-lg font-semibold">
          Checkout
        </button>
      </div>
    </div>
  );
}
