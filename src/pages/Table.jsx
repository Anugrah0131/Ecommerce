import React, { useEffect, useState } from "react";
import { TiDelete } from "react-icons/ti";

function Table() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [preview, setPreview] = useState(null); // <--- added for preview

  const [form, setForm] = useState({
    title: "",
    price: "",
    image: null,
    category: "",
  });

  const API_URL = "http://localhost:8080/api/products";
  const CATEGORY_URL = "http://localhost:8080/api/categories";

  const fetchCategories = async () => {
    try {
      const res = await fetch(CATEGORY_URL);
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.price || (!editingId && !form.image) || !form.category) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("price", form.price);
      formData.append("category", form.category);

      if (form.image) formData.append("image", form.image);

      let res;

      if (editingId) {
        res = await fetch(`${API_URL}/${editingId}`, {
          method: "PUT",
          body: formData,
        });
      } else {
        res = await fetch(API_URL, {
          method: "POST",
          body: formData,
        });
      }

      const data = await res.json();

      if (editingId) {
        setProducts(products.map((p) => (p._id === editingId ? data : p)));
        setEditingId(null);
        alert("Product updated");
      } else {
        setProducts([...products, data]);
        alert("Product added");
      }

      setForm({ title: "", price: "", image: null, category: "" });
      setPreview(null);
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (product) => {
    setEditingId(product._id);
    setForm({
      title: product.title,
      price: product.price,
      image: null,
      category: product.category?._id || "",
    });

    setPreview(product.image); // show old image
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ title: "", price: "", image: null, category: "" });
    setPreview(null);
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    setProducts(products.filter((p) => p._id !== id));
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <h1 className="text-2xl font-semibold text-gray-600 mb-4">Product Manager</h1>

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

          {/* ⭐ UPDATED FILE CHOOSE SECTION WITH PREVIEW ⭐ */}
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 mb-1">Product Image</label>

            <label className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-md w-max">
              Choose File
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setForm({ ...form, image: file });
                  if (file) setPreview(URL.createObjectURL(file));
                }}
              />
            </label>

            {form.image && (
              <p className="text-sm mt-1 text-gray-700">
                Selected: <strong>{form.image.name}</strong>
              </p>
            )}

            {preview && (
              <img
                src={preview}
                className="mt-2 w-20 h-20 object-cover border rounded"
                alt="Preview"
              />
            )}
          </div>

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

        <div className="flex gap-4 mt-5">
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-md">
            {loading ? "Saving..." : editingId ? "Update Product" : "Add Product"}
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
            {products.length ? (
              products.map((item, index) => (
                <tr key={item._id} className="border-b">
                  <td className="px-4 py-3 text-center">{index + 1}</td>

                  <td className="px-4 py-3 text-center">
                    <img
                      src={item.image}
                      className="w-14 h-14 object-contain rounded-md border mx-auto"
                    />
                  </td>

                  <td className="px-4 py-3">{item.title}</td>
                  <td className="px-4 py-3">₹ {item.price}</td>
                  <td className="px-4 py-3">{item.category?.name || "N/A"}</td>

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
