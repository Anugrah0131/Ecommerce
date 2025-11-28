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
    // image holds either a string (existing image path) or a File (new upload)
    image: "",
    category: "",
    description: "",
  });

  const [previewUrl, setPreviewUrl] = useState(null); // preview for newly selected file

  const API_URL = "http://localhost:8080/api/products";
  const CATEGORY_URL = "http://localhost:8080/api/categories";
  const BACKEND_BASE = "http://localhost:8080";

  // ---------- Fetch Categories ----------
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

  // ---------- Fetch Products ----------
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

  // ---------- Helpers ----------
  const getImageUrl = (img) => {
    if (!img) return null;
    if (typeof img === "string") {
      if (img.startsWith("http://") || img.startsWith("https://")) return img;
      if (img.startsWith("/")) return `${BACKEND_BASE}${img}`;
      return `${BACKEND_BASE}/uploads/${img}`;
    }
    // if it's a File object, create preview
    return previewUrl;
  };

  // ---------- Input handlers ----------
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files && files[0];
      if (file) {
        setForm((prev) => ({ ...prev, image: file }));
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        // cleared file input
        setForm((prev) => ({ ...prev, image: "" }));
        setPreviewUrl(null);
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ---------- Reset form ----------
  const resetForm = () => {
    setForm({ title: "", price: "", image: "", category: "", description: "" });
    setEditingId(null);
    setPreviewUrl(null);
  };

  // ---------- Submit (Add / Update) ----------
  const handleSubmit = async (e) => {
    e.preventDefault();

    // basic validation
    if (!form.title || !form.price || !form.category) {
      alert("Please fill title, price and category");
      return;
    }

    setLoading(true);

    try {
      // Determine whether to send FormData (if image is File) or JSON
      const isFile = form.image instanceof File;

      let res;
      if (editingId) {
        // UPDATE
        if (isFile) {
          const fd = new FormData();
          fd.append("title", form.title);
          fd.append("price", form.price);
          fd.append("category", form.category);
          fd.append("description", form.description || "");
          fd.append("image", form.image); // file

          res = await fetch(`${API_URL}/${editingId}`, {
            method: "PUT",
            body: fd, // NO headers
          });
        } else {
          // No new file chosen — send JSON and keep existing image on server
          res = await fetch(`${API_URL}/${editingId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: form.title,
              price: form.price,
              category: form.category,
              description: form.description || "",
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
        fd.append("description", form.description || "");
        if (isFile) fd.append("image", form.image);

        res = await fetch(API_URL, {
          method: "POST",
          body: fd, // NO headers
        });
      }

      if (!res.ok) {
        const text = await res.text().catch(() => null);
        throw new Error(text || "Failed to save product");
      }

      const saved = await res.json();

      if (editingId) {
        // update local list
        setProducts((prev) => prev.map((p) => (p._id === editingId ? saved : p)));
        alert("Product updated successfully");
      } else {
        setProducts((prev) => [...prev, saved]);
        alert("Product added successfully");
      }

      resetForm();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Error saving product");
    } finally {
      setLoading(false);
    }
  };

  // ---------- Start editing ----------
  const startEditing = (product) => {
    setEditingId(product._id);
    setForm({
      title: product.title || "",
      price: product.price || "",
      image: product.image || "", // keep as string path until user uploads new file
      category: product.category?._id || "",
      description: product.description || "",
    });
    setPreviewUrl(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ---------- Cancel edit ----------
  const cancelEdit = () => {
    resetForm();
  };

  // ---------- Delete ----------
  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm("Are you sure?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete product");
      setProducts((prev) => prev.filter((p) => p._id !== id));
      alert("Product deleted");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <h1 className="text-2xl font-semibold text-gray-600 mb-4">Product Manager</h1>

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

          {/* File input now */}
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
                  alt="Preview"
                  className="w-24 h-24 object-contain rounded-md border"
                />
              ) : form.image ? (
                <img
                  src={getImageUrl(form.image)}
                  alt="Existing"
                  className="w-24 h-24 object-contain rounded-md border"
                />
              ) : (
                <div className="w-24 h-24 flex items-center justify-center border rounded-md text-sm text-gray-400">
                  No Image
                </div>
              )}
            </div>
          </div>

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
              <option key={cat._id} value={cat._1d ?? cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4">
          <textarea
            name="description"
            placeholder="Description (optional)"
            value={form.description}
            onChange={handleChange}
            className="border rounded-md px-4 py-2 w-full"
            rows={3}
          />
        </div>

        <div className="flex gap-4 mt-5">
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md"
          >
            {loading ? (editingId ? "Updating..." : "Adding...") : editingId ? "Update Product" : "Add Product"}
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
                    {item.image ? (
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.title}
                        className="w-14 h-14 object-contain rounded-md border mx-auto"
                      />
                    ) : (
                      <div className="w-14 h-14 flex items-center justify-center border rounded-md text-xs text-gray-400 mx-auto">
                        No Image
                      </div>
                    )}
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
