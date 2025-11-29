import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Card from "./Card"; 

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
      <div className="min-h-screen flex justify-center items-center text-gray-500 bg-gray-50">
        Loading products...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
    
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-blue-100">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-gray-800 drop-shadow-md">
          All Products
        </h1>
        <p className="text-center text-gray-600 mt-2 text-sm md:text-base">
          Browse through our collection of quality products.
        </p>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {products.length === 0 ? (
          <p className="text-center text-gray-500 text-lg mt-10">
            No products found.
          </p>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-10 justify-items-center"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            {products.map((p) => (
              <motion.div
                key={p._id}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="hover:shadow-xl hover:shadow-purple-300/30 rounded-3xl"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <Card
                  id={p._id}
                  title={p.title}
                  price={p.price}
                  image={p.image}
                  category={p.category?.name}
                  badge={p.badge}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </div>
  );
}

export default Products;
