import React, { useEffect, useState } from "react";
import Card from "./Card"; // using your card design
import Navbar from "./Navbar";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/products");
      const data = await res.json();

      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-500">
        Loading products...
      </div>
    );

  return (
    <>
      

      <div className="min-h-screen bg-gray-50 p-6">
        <h1 className="text-3xl font-bold text-center mb-8">
          All Products
        </h1>

        {products.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No products found.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
            {products.map((p) => (
              <Card
                key={p._id}
                id={p._id}
                title={p.title}
                price={p.price}
                image={p.image}
                category={p.category?.name}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Products;


