// OrderTracking.jsx — Live Auto-Refresh Order Tracking Page
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function OrderTracking() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const STATUS_FLOW = [
    "Placed",
    "Packed",
    "Shipped",
    "Out for Delivery",
    "Delivered",
  ];

  // Fetch order from backend
  const fetchOrder = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/orders/${orderId}`);

      if (res.ok) {
        const data = await res.json();
        if (!data.status) data.status = "Placed";

        setOrder(data);
        localStorage.setItem("latest_order", JSON.stringify(data));
        return;
      }

      // fallback → localStorage
      const saved = JSON.parse(localStorage.getItem("latest_order"));
     if (!savedOrder || savedOrder._id !== orderId) {
        if (!saved.status) saved.status = "Placed";
        setOrder(saved);
        return;
      }

      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // Initial load
    fetchOrder().then(() => setLoading(false));

    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchOrder, 10000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [orderId]);

  if (loading || !order)
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );

  const currentStep = STATUS_FLOW.indexOf(order.status);

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
          <h1 className="text-3xl font-extrabold mb-4">Track Order</h1>

          <p className="text-white/80 mb-6">
            Order ID: <span className="font-bold">{order._id}</span>
          </p>

          {/* TIMELINE */}
          <div className="relative border-l-2 border-white/20 ml-4 transition-all">
            {STATUS_FLOW.map((step, index) => {
              const completed = index <= currentStep;

              return (
                <div key={step} className="mb-8 ml-4 relative">
                  <span
                    className={`absolute -left-6 top-0 w-5 h-5 rounded-full border-2 transition-all duration-300 ${
                      completed
                        ? "bg-green-500 border-green-500"
                        : "bg-white/20 border-white/40"
                    }`}
                  ></span>

                  <div
                    className={`pl-2 transition-all duration-300 ${
                      completed ? "text-white" : "text-white/60"
                    }`}
                  >
                    <p className="font-semibold">{step}</p>
                    {completed && index === currentStep && (
                      <p className="text-green-400 text-sm mt-1">
                        Current Status (Live Updating...)
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Estimated Delivery */}
          <div className="mt-6 bg-white/10 p-4 rounded-xl border border-white/20">
            <p className="text-white/80">
              Estimated Delivery:{" "}
              <span className="text-white font-semibold">
                {order.shippingMethod === "express"
                  ? "1–2 days"
                  : "3–5 days"}
              </span>
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={() => navigate(`/order/${order._id}`)
}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg shadow-lg hover:scale-105 transition"
            >
              View Order Details
            </button>

            <button
              onClick={() => navigate("/")}
              className="flex-1 py-3 rounded-xl bg-white/20 border border-white/30 text-white font-bold text-lg hover:bg-white/10 transition"
            >
              Continue Shopping
            </button>
          </div>

          {/* Auto-refresh label */}
          <p className="text-white/50 text-sm mt-4 text-center">
            🔄 Auto-refreshing every 10 seconds
          </p>
        </div>
      </div>
    </div>
  );
}
