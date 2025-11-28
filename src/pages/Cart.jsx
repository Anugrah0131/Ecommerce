import React, { useEffect, useState } from "react";

export default function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(stored);
  }, []);

  const updateQuantity = (id, amount) => {
    const updated = cart.map((item) =>
      item._id === id
        ? { ...item, quantity: Math.max(1, item.quantity + amount) }
        : item
    );

    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const removeItem = (id) => {
    const updated = cart.filter((item) => item._id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0)
    return (
      <h1 className="text-center mt-auto my-130 text-2xl font-semibold text-gray-600">
        Your cart is empty 🛒
      </h1>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Your Cart</h1>

      <div className="space-y-5">
        {cart.map((item) => (
          <div
            key={item._id}
            className="
              flex flex-col md:flex-row 
              items-center justify-between 
              bg-white p-5 rounded-2xl shadow-lg 
              border border-gray-100 transition hover:shadow-xl
            "
          >
            {/* Left Section */}
            <div className="flex items-center gap-5 w-full md:w-auto">
              <img
                src={item.image}
                className="w-24 h-24 object-cover rounded-xl shadow-sm"
              />

              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {item.title}
                </h2>
                <p className="text-blue-600 font-semibold text-lg">
                  ₹{item.price}
                </p>
              </div>
            </div>

            {/* Right Section */}
            <div
              className="
                flex items-center gap-5 mt-4 md:mt-0
               "
            >
              {/* Quantity Buttons */}
              <div className="flex items-center bg-gray-100 rounded-full px-3 py-2 shadow-inner">
                <button
                  onClick={() => updateQuantity(item._id, -1)}
                  className="
                    w-8 h-8 flex items-center justify-center 
                    bg-white rounded-full shadow 
                    hover:bg-gray-100 transition
                  "
                >
                  -
                </button>

                <span className="px-4 text-lg font-semibold">
                  {item.quantity}
                </span>

                <button
                  onClick={() => updateQuantity(item._id, +1)}
                  className="
                    w-8 h-8 flex items-center justify-center 
                    bg-white rounded-full shadow 
                    hover:bg-gray-100 transition
                  "
                >
                  +
                </button>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeItem(item._id)}
                className="
                  bg-red-500 text-white px-5 py-2 
                  rounded-xl font-medium
                  shadow hover:bg-red-600 
                  transition
                "
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Total Section */}
      <div className="mt-10 p-6 bg-white shadow-xl rounded-2xl border text-right">
        <h2 className="text-2xl font-bold text-gray-800">
          Total: ₹{total.toLocaleString()}
        </h2>

        <button
          className="
            mt-4 bg-green-600 text-white 
            px-6 py-3 rounded-xl 
            shadow-lg hover:bg-green-700 
            transition font-semibold text-lg
          "
        >
          Checkout
        </button>
      </div>
    </div>
  );
}
