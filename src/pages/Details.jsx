import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import RelatedProducts from "../components/RelatedProducts";
import AddToCartButton from "../components/AddToCartButton";


function Details() {
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

  // Fetch ALL products (required for filtering)
  const getAllProducts = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/products");
      const data = await res.json();
      setAllProducts(data);
    } catch (err) {
      console.error("Error fetching all products:", err);
    }
  };

  // FRONTEND FILTER BASED RELATED PRODUCTS
  const generateRelated = (current, products) => {
    if (!current?.category?._id) return;

    const relatedItems = products.filter(
      (p) => p.category === current.category?._id || p.category?._id === current.category?._id
    ).filter((p) => p._id !== current._id);

    setRelated(relatedItems);
  };

  useEffect(() => {
    getProduct();
    getAllProducts();
  }, [id]);

  // Once product + allProducts loaded → calculate related
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
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="bg-white rounded-2xl shadow-lg max-w-4xl mx-auto grid md:grid-cols-2 overflow-hidden">

        {/* Image */}
        <div className="flex justify-center items-center bg-gray-100 p-6">
          <img
            src={`http://localhost:8080/${product.image}`}
            alt={product.title}
            className="w-full h-80 object-contain hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-center p-8 gap-4">

          <h1 className="text-3xl font-bold text-gray-900 leading-tight">
            {product.title}
          </h1>

          <div className="flex items-center gap-2 text-yellow-500 text-sm">
            ⭐⭐⭐⭐⭐ <span className="text-gray-600 ml-1">(1,142 ratings)</span>
          </div>

          <div className="flex flex-wrap gap-2 mt-1">
            <span className="bg-green-100 text-green-700 px-3 py-1 text-xs rounded-full">Best Seller</span>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 text-xs rounded-full">Free Delivery</span>
            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 text-xs rounded-full">7-Day Return</span>
          </div>

          <div className="mt-3">
            <p className="text-3xl font-bold text-blue-600">₹ {product.price}</p>
            <p className="text-sm text-gray-500">Inclusive of all taxes</p>
          </div>

          <p className="text-gray-700 leading-relaxed mt-4 text-[15px]">
            {product.description}
          </p>

          <div className="flex gap-4 mt-6">

          <AddToCartButton product={product} />


            <Link
              to="/products"
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-100 transition w-[180px] text-center"
            >
              Back to Shop
            </Link>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts related={related} />
    </div>
  );
}

export default Details;
