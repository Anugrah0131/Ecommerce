// src/pages/Details.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Details() {
  const [product, setProduct] = useState({});
  const { id } = useParams();

  const getData = async () => {
    const res = await fetch("http://localhost:8080/user");
    const data = await res.json();
    setProduct(data);
  };

  useEffect(() => {
    getData();
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Product Details</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-64 object-contain mb-4"
        />
        <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
        <p className="text-gray-600 mb-4">{product.description}</p>
        <p className="text-lg font-bold text-green-600">${product.price}</p>
      </div>
    </div>
  );
}

export default Details;
