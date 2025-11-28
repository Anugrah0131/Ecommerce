import React, { useEffect, useState } from "react";
import { TiDelete } from "react-icons/ti";

function Table() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [form, setForm] = useState({
    title: "",
    price: "",
    image: "",
    category: "",
    description: "",
  });

  const API_URL = "http://localhost:8080/api/products";
  const CATEGORY_URL = "http://localhost:8080/api/categories";
  const BACKEND_BASE = "http://localhost:8080";

  // ---------- Fetch Categories ----------
  const fetchCategories = async () => {
    try {
      const res = await fetch(CATEGORY_URL);
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  // ---------- Fetch Products ----------
  const fetchProducts = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  // ---------- Get Correct Image URL ----------
  const getImageUrl = (img) => {
    if (!img) return null;

    if (typeof img === "string") {
      if (img.startsWith("http")) return img;
      if (img.startsWith("/")) return `${BACKEND_BASE}${img}`;
      return `${BACKEND_BASE}/uploads/${img}`;
    }

    return previewUrl;
  };

  // ---------- Handle Input ----------
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files?.[0];

      if (file) {
        setForm((prev) => ({ ...prev, image: file }));
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        setForm((prev) => ({ ...prev, image: "" }));
        setPreviewUrl(null);
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ---------- Reset Form ----------
  const resetForm = () => {
    setForm({ title: "", price: "", image: "", category: "", description: "" });
    setPreviewUrl(null);
    setEditingId(null);
  };

  // ---------- Submit (Add / Update) ----------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.price || !form.category) {
      alert("Please fill title, price, and category");
      return;
    }

    setLoading(true);

    try {
      const isFile = form.image instanceof File;
      let res;

      if (editingId) {
        // UPDATE
        if (isFile) {
          const fd = new FormData();
          fd.append("title", form.title);
          fd.append("price", form.price);
          fd.append("category", form.category);
          fd.append("description", form.description);
          fd.append("image", form.image);

          res = await fetch(`${API_URL}/${editingId}`, {
            method: "PUT",
            body: fd,
          });
        } else {
          res = await fetch(`${API_URL}/${editingId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: form.title,
              price: form.price,
              category: form.category,
              description: form.description,
              image: typeof form.image === "string" ? form.image : "",
            }),
          });
        }
      } else {
        // CREATE
        const fd = new FormData();
        fd.append("title", form.title);
        fd.append("price", form.price);
        fd.append("category", form.category);
        fd.append("description", form.description);
        if (isFile) fd.append("image", form.image);

        res = await fetch(API_URL, {
          method: "POST",
          body: fd,
        });
      }

      if (!res.ok) throw new Error("Failed to save product");

      const saved = await res.json();

      if (editingId) {
        setProducts((prev) => prev.map((p) => (p._id === editingId ? saved : p)));
        alert("Product updated");
      } else {
        setProducts((prev) => [...prev, saved]);
        alert("Product added");
      }

      resetForm();
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ---------- Edit ----------
  const startEditing = (product) => {
    setEditingId(product._id);
    setForm({
      title: product.title,
      price: product.price,
      image: product.image,
      category: product.category?._id || "",
      description: product.description,
    });
    setPreviewUrl(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ---------- Delete ----------
  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      setProducts((prev) => prev.filter((p) => p._id !== id));
      alert("Product deleted");
    } catch {
      alert("Error deleting product");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <h1 className="text-2xl font-semibold text-gray-600 mb-4">Product Manager</h1>

      {/* Form */}
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

          {/* Image Upload */}
          <div>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="border rounded-md px-4 py-2 w-full"
            />

            <div className="mt-2">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  className="w-24 h-24 object-contain border rounded-md"
                />
              ) : form.image ? (
                <img
                  src={getImageUrl(form.image)}
                  className="w-24 h-24 object-contain border rounded-md"
                />
              ) : (
                <div className="w-24 h-24 border rounded-md flex items-center justify-center text-gray-400 text-sm">
                  No Image
                </div>
              )}
            </div>
          </div>

          {/* Category */}
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="border rounded-md px-4 py-2"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <textarea
          name="description"
          placeholder="Description (optional)"
          value={form.description}
          onChange={handleChange}
          className="border rounded-md px-4 py-2 w-full mt-4"
          rows={3}
        />

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
              onClick={resetForm}
              className="bg-gray-400 text-white px-6 py-2 rounded-md"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Table */}
      <div className="w-[90%] md:w-[70%] bg-white shadow-xl rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="px-4 py-3">No</th>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.length ? (
              products.map((item, index) => (
                <tr key={item._id} className="border-b">
                  <td className="px-4 py-3 text-center">{index + 1}</td>
                  <td className="px-4 py-3 text-center">
                    {item.image ? (
                      <img
                        src={getImageUrl(item.image)}
                        className="w-14 h-14 object-contain border rounded-md mx-auto"
                      />
                    ) : (
                      <div className="w-14 h-14 border rounded-md flex items-center justify-center text-xs text-gray-400 mx-auto">
                        No Image
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">{item.title}</td>
                  <td className="px-4 py-3">₹ {item.price}</td>
                  <td className="px-4 py-3">{item.category?.name}</td>
                  <td className="px-4 py-3 flex gap-3 justify-center">
                    <button
                      onClick={() => startEditing(item)}
                      className="text-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProduct(item._id)}
                      className="text-red-500 text-2xl"
                    >
                      <TiDelete />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-6 text-center text-gray-500">
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
