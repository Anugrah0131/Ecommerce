import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function SingleCategory() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/categories/${id}`);
        const data = await res.json();
        setCategory(data.category || {});
        setProducts(data.products || []);
      } catch (error) {
        console.error("Error fetching category details:", error);
      }
    };
    fetchCategoryProducts();
  }, [id]);

  if (!category) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center">
        {category.name || "Category"}
      </h2>

      {products.length === 0 ? (
        <p className="text-center text-gray-600">No products found in this category.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {products.map((p) => (
            <div
              key={p._id}
              className="bg-white border rounded-xl p-3 shadow-sm hover:shadow-lg transition-transform transform hover:scale-105"
            >
              <img
                src={p.image}
                alt={p.title}
                className="w-full h-40 object-cover rounded-md"
              />
              <h3 className="mt-2 font-semibold">{p.title}</h3>
              <p className="text-gray-600">₹{p.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SingleCategory;
