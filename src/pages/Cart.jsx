import React from "react";

export default function Cart() {
  // Temporary static cart data (you can later connect to real state or API)
  const cartItems = [
    {
      id: 1,
      title: "Leather Handbag",
      price: 59.99,
      quantity: 1,
      image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
    },
    {
      id: 2,
      title: "Men's Cotton Jacket",
      price: 89.99,
      quantity: 2,
      image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
    },
  ];

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        🛒 Your Shopping Cart
      </h1>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-600">Your cart is currently empty.</p>
      ) : (
        <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-center justify-between border-b pb-4"
              >
                {/* Product Info */}
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-24 h-24 object-contain rounded-md"
                  />
                  <div>
                    <h2 className="font-semibold text-gray-800">
                      {item.title}
                    </h2>
                    <p className="text-gray-500">${item.price.toFixed(2)}</p>
                  </div>
                </div>

                {/* Quantity and Price */}
                <div className="flex items-center gap-6 mt-4 sm:mt-0">
                  <div className="flex items-center gap-2">
                    <button className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300">
                      -
                    </button>
                    <span className="font-medium">{item.quantity}</span>
                    <button className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300">
                      +
                    </button>
                  </div>
                  <p className="text-lg font-bold text-green-600">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Total Section */}
          <div className="mt-8 flex flex-col sm:flex-row justify-between items-center border-t pt-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Total: <span className="text-green-600">${total.toFixed(2)}</span>
            </h3>
            <button className="mt-4 sm:mt-0 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
