import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function SingleCategory() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/categories/${id}`);
        const data = await res.json();

        setCategory(data.category);
        setProducts(data.products);
      } catch (error) {
        console.error("Error fetching category details:", error);
      }
    };

    fetchCategoryProducts();
  }, [id]);

  if (!category) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="p-6">
      {/* CATEGORY TITLE */}
      <h2 className="text-3xl font-bold mb-6 text-center">
        {category.name}
      </h2>

      {/* PRODUCT LIST GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {products.map((p) => (
          <div
            key={p._id}
            className="w-64 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
          >
            {/* PRODUCT IMAGE */}
            <Link to={`/details/${p._id}`}>
              <div className="w-full h-52 bg-gray-100 flex items-center justify-center overflow-hidden">
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.title}
                    className="object-contain w-full h-full transition-transform duration-500 hover:scale-110"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">No Image</span>
                )}
              </div>
            </Link>

            {/* PRODUCT INFO */}
            <div className="p-4 text-center">
              <h3 className="text-lg font-semibold text-gray-800 truncate">
                {p.title}
              </h3>
              <p className="text-gray-500 text-sm mt-1">{category?.name}</p>
              <p className="text-xl font-bold text-blue-600 mt-2">
                ₹{p.price}
              </p>

              <div className="mt-4 flex justify-center gap-3">
                <Link
                  to={`/details/${p._id}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  View
                </Link>
                <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SingleCategory;

