// OrderTracking.jsx — SUPER PRO EDITION
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Truck,
  Package,
  MapPin,
  Clock,
  Bell,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function OrderTracking() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const STATUS_FLOW = [
    "Placed",
    "Packed",
    "Shipped",
    "Out for Delivery",
    "Delivered",
  ];

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [previousStatus, setPreviousStatus] = useState(null);

  // NEW FEATURES
  const [vanPosition, setVanPosition] = useState(0); // moves left → right
  const [stopsAway, setStopsAway] = useState(5);
  const [eta, setEta] = useState("Calculating...");
  const [issue, setIssue] = useState(null);

  // Fetch Order
  const fetchOrder = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/orders/${orderId}`);

      if (res.ok) {
        const data = await res.json();

        if (!data.status) data.status = "Placed";

        // NEW: status change alert + sound
        if (previousStatus && previousStatus !== data.status) {
          playAlertSound();
        }

        setPreviousStatus(data.status);
        setOrder(data);
        setLastUpdated(new Date());
        localStorage.setItem("latest_order", JSON.stringify(data));
      } else {
        const saved = JSON.parse(localStorage.getItem("latest_order"));
        if (saved) setOrder(saved);
      }
    } catch (err) {
      console.log(err);
      const saved = JSON.parse(localStorage.getItem("latest_order"));
      if (saved) setOrder(saved);
    }
  };

  // Soft notification sound
  const playAlertSound = () => {
    const audio = new Audio(
      "https://assets.mixkit.co/active_storage/sfx/2563/2563-preview.mp3"
    );
    audio.volume = 0.4;
    audio.play();
  };

  useEffect(() => {
    fetchOrder().then(() => setLoading(false));

    // Auto updates every 10 sec
    const interval = setInterval(fetchOrder, 10000);

    return () => clearInterval(interval);
  }, [orderId]);

  // 🚚 Real-time animated van movement
  useEffect(() => {
    if (!order) return;

    if (order.status === "Out for Delivery") {
      const vanInterval = setInterval(() => {
        setVanPosition((prev) => (prev < 100 ? prev + 5 : prev));
      }, 2000);

      return () => clearInterval(vanInterval);
    }
  }, [order]);

  // Auto-calc ETA + stops away
  useEffect(() => {
    if (!order) return;

    if (order.status === "Shipped") {
      setStopsAway(Math.floor(Math.random() * 7) + 3);
      setEta("Tomorrow");
    }

    if (order.status === "Out for Delivery") {
      setStopsAway((prev) => (prev > 0 ? prev - 1 : 0));
      setEta("Arriving Today");
    }

    if (order.status === "Delivered") {
      setStopsAway(0);
      setEta("Delivered");
    }
  }, [order]);

  if (loading || !order)
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );

  const currentStep = STATUS_FLOW.indexOf(order.status);
  const progressPercent =
    ((currentStep + 1) / STATUS_FLOW.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 py-10 px-4 text-white">
      <div className="max-w-3xl mx-auto">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/80 mb-6 hover:text-white"
        >
          <ArrowLeft /> Back
        </button>

        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-xl">

          {/* Title */}
          <h1 className="text-3xl font-extrabold flex items-center gap-2">
            <Truck /> Order Tracking
          </h1>

          {/* Status Alert */}
          <AnimatePresence>
            {previousStatus !== order.status && previousStatus && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 bg-green-500/20 p-4 rounded-lg border border-green-500/30 flex gap-2"
              >
                <Bell className="text-green-400" />
                <p className="text-green-300 font-semibold">
                  Status Updated: {order.status}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-white/80 mt-4">
            Order ID: <span className="font-bold">{order._id}</span>
          </p>

          {/* STATUS BADGE */}
          <div className="mt-4">
            <span className="px-4 py-1 rounded-full text-sm bg-green-500/20 border border-green-500/30 text-green-300 font-semibold">
              {order.status}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mt-6 w-full h-3 bg-white/20 rounded-xl overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.6 }}
              className="h-full bg-green-500"
            ></motion.div>
          </div>

          {/* DELIVERY ISSUES (Random Example) */}
          {issue && (
            <div className="mt-6 bg-red-500/20 p-4 rounded-xl border border-red-500/40 flex gap-3">
              <AlertTriangle className="text-red-300" />
              <p className="text-red-200">{issue}</p>
            </div>
          )}

          {/* Timeline */}
          <div className="relative border-l-2 border-white/20 ml-4 mt-10">
            {STATUS_FLOW.map((step, index) => {
              const completed = index <= currentStep;

              return (
                <div key={step} className="mb-10 ml-4 relative">
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`absolute -left-6 top-0 w-6 h-6 rounded-full border-2 ${
                      completed
                        ? "bg-green-500 border-green-500"
                        : "bg-white/20 border-white/40"
                    }`}
                  ></motion.span>

                  <p
                    className={`font-semibold ${
                      completed ? "text-white" : "text-white/60"
                    }`}
                  >
                    {step}
                  </p>

                  {completed && index === currentStep && (
                    <p className="text-green-400 text-sm mt-1">
                      ✔ Live: Currently Here
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* OUT FOR DELIVERY LIVE VAN UI */}
          {order.status === "Out for Delivery" && (
            <div className="mt-10">
              <p className="text-white/80 mb-2">
                🚚 Your package is <b>{stopsAway}</b> stops away
              </p>

              <div className="w-full h-20 bg-white/10 rounded-xl border border-white/20 relative overflow-hidden">
                <motion.div
                  animate={{ x: `${vanPosition}%` }}
                  transition={{ duration: 1 }}
                  className="absolute left-0 top-4"
                >
                  <Truck className="w-10 h-10 text-white" />
                </motion.div>
              </div>
            </div>
          )}

          {/* Estimated Time */}
          <div className="mt-6 bg-white/10 p-4 rounded-xl border border-white/20">
            <p className="text-white/70">
              ETA: <span className="text-white font-semibold">{eta}</span>
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-10">
            <button
              onClick={() => navigate(`/order/${order._id}`)}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg shadow-lg hover:scale-105 transition"
            >
              View Details
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex-1 py-3 rounded-xl bg-white/20 border border-white/30 text-white font-bold text-lg hover:bg-white/10 transition"
            >
              Continue Shopping
            </button>
          </div>

          {/* Last Updated */}
          {lastUpdated && (
            <p className="text-white/50 text-sm mt-4 text-center">
              🔄 Updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}

        </div>
      </div>
    </div>
  );
}
