import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import RelatedProducts from "../components/RelatedProducts";
import AddToCartButton from "../components/AddToCartButton";
import { motion } from "framer-motion";

export default function Details() {
  const [product, setProduct] = useState({});
  const [allProducts, setAllProducts] = useState([]);
  const [related, setRelated] = useState([]);

  const { id } = useParams();

  // Fetch single product
  const getProduct = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/products/${id}`);
      const data = await res.json();
      setProduct(data);
    } catch (err) {
      console.error("Error fetching product:", err);
    }
  };

  // Fetch ALL products
  const getAllProducts = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/products");
      const data = await res.json();
      setAllProducts(data);
    } catch (err) {
      console.error("Error fetching all products:", err);
    }
  };

  // Related products
  const generateRelated = (current, products) => {
    if (!current?.category?._id) return;

    const relatedItems = products
      .filter(
        (p) =>
          p.category === current.category?._id ||
          p.category?._id === current.category?._id
      )
      .filter((p) => p._id !== current._id);

    setRelated(relatedItems);
  };

  useEffect(() => {
    getProduct();
    getAllProducts();
  }, [id]);

  useEffect(() => {
    if (product && allProducts.length > 0) {
      generateRelated(product, allProducts);
    }
  }, [product, allProducts]);

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
    <div className="min-h-screen bg-[#f5f5f7] py-14 px-4 md:px-10">

      {/* =========================
          PRODUCT SECTION (APPLE STYLE)
      ========================== */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center bg-white rounded-3xl shadow-xl p-10">

        {/* IMAGE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center items-center"
        >
          <img
            src={`http://localhost:8080/${product.image}`}
            alt={product.title}
            className="w-full max-h-[450px] object-contain drop-shadow-md hover:scale-105 transition-all duration-500"
          />
        </motion.div>

        {/* RIGHT SIDE INFO */}
        <div className="flex flex-col gap-6">

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 leading-tight">
            {product.title}
          </h1>

          {/* Ratings */}
          <div className="flex items-center gap-2 text-yellow-500 text-[15px]">
            ⭐⭐⭐⭐⭐ 
            <span className="text-gray-600">(1,142 reviews)</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-1">
            <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
              Best Seller
            </span>
            <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
              Free Delivery
            </span>
            <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
              7-Day Return
            </span>
          </div>

          {/* Price */}
          <div className="mt-3">
            <p className="text-4xl font-extrabold text-[#0071e3]">
              ₹{product.price}
            </p>
            <p className="text-sm text-gray-500">
              Inclusive of all taxes
            </p>
          </div>

          {/* Description */}
          <p className="text-gray-700 leading-relaxed text-[16px]">
            {product.description}
          </p>

          {/* Buttons */}
          <div className="flex gap-4 mt-4">

            <AddToCartButton product={product} />

            <Link
              to="/products"
              className="bg-gray-100 hover:bg-gray-200 transition px-6 py-3 rounded-xl text-gray-800 font-medium"
            >
              Back to Shop
            </Link>
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      <div className="mt-16">
        <RelatedProducts related={related} />
      </div>

    </div>
  );
}
