import React, { useEffect, useState } from "react";
import { TiDelete } from "react-icons/ti";

function Table() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    price: "",
    image: "",
    category: "",
  });

  const API_URL = "http://localhost:8080/api/products";
  const CATEGORY_URL = "http://localhost:8080/api/categories";

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const res = await fetch(CATEGORY_URL);
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch Products
  const fetchProducts = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  // Handle Input Change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add / Update Product
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.price || !form.image || !form.category) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      if (editingId) {
        // UPDATE PRODUCT
        const res = await fetch(`${API_URL}/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        if (!res.ok) throw new Error("Failed to update product");
        const updated = await res.json();

        setProducts(
          products.map((p) =>
            p._id === editingId ? updated.product || updated : p
          )
        );

        alert("Product updated successfully");
        setEditingId(null);
      } else {
        // ADD PRODUCT
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        if (!res.ok) throw new Error("Failed to add product");

        const data = await res.json();
        setProducts([...products, data.product || data]);
        alert("Product added successfully");
      }

      setForm({ title: "", price: "", image: "", category: "" });
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Load product details for editing
  const startEditing = (product) => {
    setEditingId(product._id);
    setForm({
      title: product.title,
      price: product.price,
      image: product.image,
      category: product.category?._id || "",
    });
  };

  // Cancel Editing
  const cancelEdit = () => {
    setEditingId(null);
    setForm({ title: "", price: "", image: "", category: "" });
  };

  // Delete Product
  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm("Are you sure?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete product");

      setProducts(products.filter((p) => p._id !== id));
      alert("Product deleted");
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Error deleting");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <h1 className="text-2xl font-semibold text-gray-600 mb-4">
        Product Manager
      </h1>

      {/* Add / Edit Form */}
      <form
        onSubmit={handleSubmit}
        className="w-[90%] md:w-[72%] lg:w-[60%] bg-white shadow-lg p-6 m-10 rounded-lg"
      >
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          {editingId ? "Edit Product" : "Add New Product"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            name="title"
            placeholder="Product Title"
            value={form.title}
            onChange={handleChange}
            className="border rounded-md px-4 py-2"
          />
          <input
            type="number"
            name="price"
            placeholder="Price (₹)"
            value={form.price}
            onChange={handleChange}
            className="border rounded-md px-4 py-2"
          />
          <input
            type="text"
            name="image"
            placeholder="Image URL"
            value={form.image}
            onChange={handleChange}
            className="border rounded-md px-4 py-2"
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="border rounded-md px-4 py-2"
          >
            <option value="" disabled>
              Select Category
            </option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-4 mt-5">
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md"
          >
            {loading
              ? editingId
                ? "Updating..."
                : "Adding..."
              : editingId
              ? "Update Product"
              : "Add Product"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="bg-gray-400 text-white px-6 py-2 rounded-md"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Product Table */}
      <div className="w-[90%] md:w-[70%] bg-white shadow-xl rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left">No</th>
              <th className="px-4 py-3 text-left">Image</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.length > 0 ? (
              products.map((item, index) => (
                <tr key={item._id} className="border-b">
                  <td className="px-4 py-3 text-center">{index + 1}</td>

                  <td className="px-4 py-3 text-center">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-14 h-14 object-contain rounded-md border mx-auto"
                    />
                  </td>

                  <td className="px-4 py-3">{item.title}</td>
                  <td className="px-4 py-3">₹ {item.price}</td>
                  <td className="px-4 py-3">
                    {item.category?.name || "N/A"}
                  </td>

                  <td className="px-4 py-3 text-center flex items-center justify-center gap-3">
                    {/* EDIT BUTTON */}
                    <button
                      onClick={() => startEditing(item)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Edit
                    </button>

                    {/* DELETE BUTTON */}
                    <button
                      onClick={() => deleteProduct(item._id)}
                      className="text-red-500 hover:text-red-700 text-2xl"
                    >
                      <TiDelete />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-6 text-gray-500 font-medium"
                >
                  No Products Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;
