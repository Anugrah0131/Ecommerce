import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Card from "./Card";

function Products() {
  const [products, setProducts] = useState([]);

  const fetchStoreProducts = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/products");
      const data = await res.json();
      console.log("Fetched products:", data);
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/products/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setProducts((prev) => prev.filter((item) => item._id !== id));
        console.log("Product deleted:", id);
      } else {
        console.error("Failed to delete product:", id);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  useEffect(() => {
    fetchStoreProducts();
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <div className="w-full h-[12vh]">
        <Navbar />
      </div>

      <div className="flex flex-wrap justify-center gap-6 p-6">
        {products.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">No products found</p>
        ) : (
          products.map((item) => (
            <Card
              key={item._id}
              id={item._id}
              title={item.title}
              price={item.price}
              image={item.image}
              category={item?.category?.name??"Uncategorized"}
              onDelete={deleteProduct}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Products;

