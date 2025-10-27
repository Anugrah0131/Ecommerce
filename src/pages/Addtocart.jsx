import React, { useState } from "react";

function Addtocart() {
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");

  const upload = async () => {
    try {
      const res = await fetch("http://localhost:8080/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // ✅ Fixed header
        },
        body: JSON.stringify({
          id: id,
          title: title,
          price: price,
          image: image,
        }),
      });

      if (res.ok) {
        alert("Product added successfully!");
        // Optionally clear fields after success:
        setId("");
        setTitle("");
        setPrice("");
        setImage("");
      } else {
        alert("Error adding product!");
      }
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="w-full h-[100vh] bg-red-200 flex justify-center items-center">
      <div className="w-full md:w-[50%] lg:w-[30%] h-[80%] px-3 bg-white rounded-xl shadow-xl flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Add Product</h1>

        <input
          type="text"
          placeholder="ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="w-[85%] rounded-xl border px-4 py-2 mb-3"
        />

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-[85%] rounded-xl border px-4 py-2 mb-3"
        />

        <input
          type="text"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-[85%] rounded-xl border px-4 py-2 mb-3"
        />

        <textarea
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-[85%] rounded-xl border px-4 py-2 mb-4"
        />

        <button
          onClick={upload}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          ADD
        </button>

        {/* For debugging/displaying current input values */}
        <div className="mt-4 text-sm text-gray-600 text-center">
          <h1>ID: {id}</h1>
          <h1>Title: {title}</h1>
          <h1>Price: {price}</h1>
          <h1>Image: {image}</h1>
        </div>
      </div>
    </div>
  );
}

export default Addtocart;
