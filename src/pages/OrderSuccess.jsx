// OrderSuccess.jsx — Premium Glassmorphic Order Success Page
import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function OrderSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-900 px-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-10 text-center border border-white/20 shadow-xl max-w-md w-full">
        <CheckCircle className="mx-auto text-green-400 mb-6" size={64} />
        <h1 className="text-3xl font-bold text-white mb-4">Order Placed!</h1>
        <p className="text-white/80 mb-6">
          Thank you for your purchase. Your order has been successfully placed.
        </p>

        <Link
          to="/"
          className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
