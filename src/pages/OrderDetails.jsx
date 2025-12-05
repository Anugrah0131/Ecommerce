// OrderDetails.jsx — Premium Order Details Page
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Package, MapPin, CreditCard, Wallet, Truck } from "lucide-react";

export default function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);

  useEffect(() => {
    const savedOrder = JSON.parse(localStorage.getItem("latest_order"));

    if (!savedOrder || savedOrder.orderId !== orderId) {
      navigate("/");
      return;
    }

    setOrder(savedOrder);
  }, [orderId, navigate]);

  if (!order)
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );

  const fmt = (v) => `₹${v.toLocaleString()}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 py-10 px-4 text-white">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/80 mb-6 hover:text-white"
        >
          <ArrowLeft /> Back
        </button>

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-xl">
          <h1 className="text-3xl font-extrabold mb-4">Order Details</h1>

          {/* Order ID */}
          <p className="text-white/80 mb-6">
            Order ID: <span className="font-bold text-white">{order.orderId}</span>
          </p>

          {/* ITEMS */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-3">
              <Package /> Items Ordered
            </h2>

            {order.cart.map((item) => (
              <div
                key={item._id}
                className="flex justify-between border-b border-white/10 py-3"
              >
                <span>
                  {item.title} (x{item.quantity})
                </span>
                <span>{fmt(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          {/* SHIPPING DETAILS */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-3">
              <MapPin /> Shipping Address
            </h2>

            <p className="text-white/80 leading-relaxed">
              {order.form.fullName} <br />
              {order.form.address}, {order.form.city} <br />
              {order.form.state} - {order.form.pincode} <br />
              Phone: {order.form.phone}
            </p>
          </div>

          {/* SHIPPING METHOD */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-3">
              <Truck /> Shipping Method
            </h2>
            <p className="text-white/80 capitalize">
              {order.shippingMethod === "express"
                ? "Express Delivery (1–2 days)"
                : "Standard Delivery (3–5 days)"}
            </p>
          </div>

          {/* PAYMENT */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-3">
              <CreditCard /> Payment Method
            </h2>
            <p className="text-white/80 uppercase">{order.paymentMethod}</p>
          </div>

          {/* PRICE */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-3">
              <Wallet /> Price Summary
            </h2>
            <p className="text-white/80 text-lg font-semibold">
              Total Paid: <span className="text-white">{fmt(order.grandTotal)}</span>
            </p>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={() => navigate(`/track/${order.orderId}`)}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg shadow-lg hover:scale-105 transition"
            >
              Track Order
            </button>

            <button
              onClick={() => navigate("/")}
              className="flex-1 py-3 rounded-xl bg-white/20 border border-white/30 text-white font-bold text-lg hover:bg-white/10 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
