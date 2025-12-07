// OrderSuccess.jsx — Premium Ecommerce Order Success Page
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle, Truck, Calendar, Receipt } from "lucide-react";

export default function OrderSuccess() {
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();
  
useEffect(() => {
  const savedOrder = JSON.parse(localStorage.getItem("latest_order"));
  if (!savedOrder) {
    navigate("/");
    return;
  }
  setOrder(savedOrder);
}, []);


  if (!order) return null;

  // Calculate delivery date = 5 days later
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5);

  const formattedDelivery = deliveryDate.toLocaleDateString("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-900 px-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-10 text-center border border-white/20 shadow-xl max-w-lg w-full">
        <CheckCircle className="mx-auto text-green-400 mb-4" size={72} />

        <h1 className="text-3xl font-bold text-white mb-2">
          Order Placed Successfully!
        </h1>

        <p className="text-white/80 mb-6">
          Your order has been confirmed. We’re preparing it for shipping.
        </p>

        {/* Order ID */}
        <div className="bg-white/10 border border-white/20 p-4 rounded-xl mb-6 text-left text-white">
          <p className="font-semibold text-lg mb-1 flex items-center gap-2">
            <Receipt size={20} /> Order ID:
          </p>
          <p className="text-white/90">{order.orderId}</p>

          <p className="font-semibold text-lg mt-4 mb-1 flex items-center gap-2">
            <Truck size={20} /> Estimated Delivery:
          </p>
          <p className="text-white/90">{formattedDelivery}</p>

          <p className="font-semibold text-lg mt-4 mb-1 flex items-center gap-2">
            <Calendar size={20} /> Payment:
          </p>
          <p className="text-white/90 capitalize">{order.paymentMethod}</p>
        </div>

        <div className="flex flex-col gap-3">
<Link
  to={`/order/${order._id}`}
  className="w-full py-3 bg-white/20 border border-white/30 rounded-xl text-white font-semibold hover:bg-white/30 transition"
>
  View Order Details
</Link>

          <Link
            to="/"
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
