import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function SingleCategory() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);

  const API_URL = `http://localhost:8080/api/categories/${id}`;

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();

        setCategory(data.category);
        setProducts(data.products || []);
      } catch (error) {
        console.error("Error fetching category:", error);
      }
    };

    fetchCategoryData();
  }, [id]);

  if (!category)
    return (
      <div className="w-full text-center mt-10 text-gray-600 text-lg">
        Loading category...
      </div>
    );

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">

      {/* Category Header Card */}
      <div className="w-[95%] md:w-[75%] lg:w-[60%] bg-white shadow-xl rounded-lg p-6 mb-10">
        <div className="flex flex-col md:flex-row items-center gap-6">
          
          <img
            src={category.image}
            alt={category.name}
            className="w-36 h-36 md:w-44 md:h-44 object-contain rounded-md border shadow-sm"
          />

          <div>
            <h1 className="text-3xl font-semibold text-gray-800">
              {category.name}
            </h1>
            <p className="text-gray-600 mt-2 text-sm leading-relaxed">
              {category.description}
            </p>
          </div>

        </div>
      </div>

      {/* Products Grid */}
      <div className="w-[95%] md:w-[80%] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">

        {products.length > 0 ? (
          products.map((p) => (
            <div
              key={p._id}
              className="bg-white shadow-lg rounded-lg border hover:shadow-xl transition-all duration-200"
            >
              <Link to={`/details/${p._id}`}>
                <div className="w-full h-36 bg-gray-100 flex items-center justify-center rounded-t-lg overflow-hidden">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.title}
                      className="object-contain w-full h-full"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">No Image</span>
                  )}
                </div>
              </Link>

              <div className="p-3 flex flex-col items-center text-center">
                <h3 className="text-sm font-semibold text-gray-800 truncate w-full">
                  {p.title}
                </h3>

                <p className="text-gray-500 text-xs mt-1">
                  {category.name}
                </p>

                <p className="text-lg font-bold text-blue-600 mt-2">
                  ₹{p.price}
                </p>

                <div className="mt-3 flex gap-2">
                  <Link
                    to={`/details/${p._id}`}
                    className="px-3 py-1.5  text-white text-xs rounded-md hover:bg-indigo-400 transition"
                  >
                    View
                  </Link>
                  <button className="px-3 py-1.5 bg-gray-200 text-gray-800 text-xs rounded-md hover:bg-gray-300 transition">
                    Cart
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 font-medium">
            No products found in this category.
          </p>
        )}
      </div>
    </div>
  );
}

export default SingleCategory;

