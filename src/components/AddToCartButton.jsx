import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";

export default function AddToCartButton({ product, className }) {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(stored);
  }, []);

  const addToCart = () => {
    const stored = JSON.parse(localStorage.getItem("cart")) || [];
    const exist = stored.find((item) => item._id === product._id);

    if (exist) {
      exist.quantity += 1;
    } else {
      stored.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(stored));
    setCart(stored);

    // Toast notification
    const toast = document.createElement("div");
    toast.className = `
      fixed top-5 right-5
      bg-gradient-to-r from-blue-600 to-indigo-600
      text-white px-6 py-3 rounded-2xl shadow-xl
      z-50 flex items-center gap-2 font-semibold
      animate-toast
    `;
    toast.innerText = `✔ Added "${product.title}" to Cart!`;
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 2200);
  };

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={addToCart}
        className={`
          w-full flex items-center justify-center gap-2
          bg-gradient-to-r from-yellow-400 to-yellow-500
          hover:from-yellow-500 hover:to-yellow-400
          text-black font-semibold
          px-4 py-3 rounded-2xl shadow-md hover:shadow-lg
          transition-all duration-300
          ${className || ""}
        `}
      >
        <ShoppingCart size={18} />
        Add to Cart
      </motion.button>

      <style>{`
        @keyframes toastSlide {
          0% { opacity: 0; transform: translateX(100%) translateY(-10px); }
          10% { opacity: 1; transform: translateX(0) translateY(0); }
          90% { opacity: 1; transform: translateX(0) translateY(0); }
          100% { opacity: 0; transform: translateX(100%) translateY(-10px); }
        }
        .animate-toast {
          animation: toastSlide 2.2s ease-in-out forwards;
        }
      `}</style>
    </>
  );
}
