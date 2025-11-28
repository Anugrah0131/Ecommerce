import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";

export default function AddToCart({ product }) {
  const [cart, setCart] = useState([]);

  // Load cart on mount
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

    // Toast message
    const toast = document.createElement("div");
    toast.className =
      "fixed top-5 right-5 bg-blue-600 text-white px-5 py-3 rounded-xl shadow-xl z-50 animate-slide";
    toast.innerText = "Added to Cart!";
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 1800);
  };

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={addToCart}
      className="
        flex items-center justify-center gap-2
        bg-yellow-500 hover:bg-yellow-400
        text-black font-semibold
        px-4 py-2 rounded-lg shadow-md
        transition w-full
      "
    >
      <ShoppingCart size={18} />
      Add to Cart
    </motion.button>
  );
}
