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
<div className="flex flex-col justify-center p-8 gap-4">

  {/* Title */}
  <h1 className="text-3xl font-bold text-gray-900 leading-tight">
    {product.title}
  </h1>

  {/* Ratings */}
  <div className="flex items-center gap-2 text-yellow-500 text-sm">
    <span className="flex items-center">
      ⭐⭐⭐⭐⭐
    </span>
    <span className="text-gray-600 ml-1">(1,142 ratings)</span>
  </div>

  {/* Badges */}
  <div className="flex flex-wrap gap-2 mt-1">
    <span className="bg-green-100 text-green-700 px-3 py-1 text-xs rounded-full">
      Best Seller
    </span>
    <span className="bg-blue-100 text-blue-700 px-3 py-1 text-xs rounded-full">
      Free Delivery
    </span>
    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 text-xs rounded-full">
      7-Day Return
    </span>
  </div>

  {/* Price Section */}
  <div className="mt-3">
    <p className="text-3xl font-bold text-blue-600">₹ {product.price}</p>
    <p className="text-sm text-gray-500">Inclusive of all taxes</p>
  </div>

  {/* Description */}
  <p className="text-gray-700 leading-relaxed mt-4 text-[15px]">
    {product.description}
  </p>

  {/* Product Highlights */}
  <div className="mt-6">
    <h2 className="text-lg font-semibold mb-2 text-gray-800">Product Highlights</h2>
    <ul className="list-disc ml-6 text-gray-600 space-y-1 text-sm">
      <li>Premium quality materials</li>
      <li>Designed for long-lasting performance</li>
      <li>Lightweight & user-friendly</li>
      <li>Trusted by thousands of customers</li>
    </ul>
  </div>

  {/* Buttons */}
  <div className="flex gap-4 mt-6">
    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition w-[180px]">
      Add to Cart
    </button>

    <Link
      to="/Products"
      className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-100 transition w-[180px] text-center"
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

