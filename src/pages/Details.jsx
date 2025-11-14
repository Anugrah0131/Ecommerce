import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function Details() {
  const [product, setProduct] = useState({});
  const { id } = useParams();

  const getData = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/products/${id}`);
      const data = await res.json();
      setProduct(data);
    } catch (err) {
      console.error("Error fetching product:", err);
    }
  };

  useEffect(() => {
    getData();
  }, [id]);

  if (!product.title) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <p className="text-gray-500 text-lg animate-pulse">
          Loading product details...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-6">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl grid md:grid-cols-2 overflow-hidden">
        {/* Image Section */}
        <div className="flex justify-center items-center bg-gray-100 p-6">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-80 object-contain hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Product Info Section */}
        <div className="flex flex-col justify-center p-8">
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">
            {product.title}
          </h1>
          <p className="text-gray-600 mb-4 leading-relaxed">
            {product.description || "No description available for this product."}
          </p>
          <p className="text-2xl font-bold text-blue-600 mb-6">
            ₹ {product.price}
          </p>

          <div className="flex gap-4">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition">
              Add to Cart
            </button>
            <Link
              to="/Products"
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-100 transition"
            >
              Back to Shop
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Details;

