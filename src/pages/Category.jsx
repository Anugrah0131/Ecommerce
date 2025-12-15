import React, { useEffect, useState } from "react";
import { TiDelete } from "react-icons/ti";
import { motion } from "framer-motion";

function CategoryTable() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
    imageFile: null,
  });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const API_URL = "http://localhost:8080/api/categories";
  const BACKEND_BASE = "http://localhost:8080";

  const fetchCategories = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setForm((prev) => ({ ...prev, imageFile: null }));
      setPreviewUrl(null);
      return;
    }
    setForm((prev) => ({ ...prev, imageFile: file }));
    setPreviewUrl(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setForm({ name: "", description: "", image: "", imageFile: null });
    setPreviewUrl(null);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.description) {
      alert("Please fill name and description");
      return;
    }

    setLoading(true);
    let res;

    try {
      if (editingId) {
        // UPDATE
        if (form.imageFile) {
          const fd = new FormData();
          fd.append("name", form.name);
          fd.append("description", form.description);
          fd.append("image", form.imageFile);

          res = await fetch(`${API_URL}/${editingId}`, {
            method: "PUT",
            body: fd,
          });
        } else {
          res = await fetch(`${API_URL}/${editingId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: form.name,
              description: form.description,
              image: form.image,
            }),
          });
        }
      } else {
        // CREATE
        const fd = new FormData();
        fd.append("name", form.name);
        fd.append("description", form.description);
        if (form.imageFile) fd.append("image", form.imageFile);

        res = await fetch(API_URL, {
          method: "POST",
          body: fd,
        });
      }

      if (!res.ok) throw new Error("Failed to save category");

      await fetchCategories();
      resetForm();
    } catch (error) {
      console.error("Error saving category:", error);
      alert("Error saving category");
    } finally {
      setLoading(false);
    }
  };

  const editCategory = (cat) => {
    setForm({
      name: cat.name || "",
      description: cat.description || "",
      image: cat.image || "",
      imageFile: null,
    });
    setPreviewUrl(null);
    setEditingId(cat._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c._id !== id));
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const getImageUrl = (img) => {
    if (!img) return null;
    if (img.startsWith("http")) return img;
    if (img.startsWith("/")) return BACKEND_BASE + img;
    return `${BACKEND_BASE}/uploads/${img}`;
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 py-12 flex flex-col items-center">
      
      {/* PAGE TITLE */}
       <h1 className="text-4xl font-bold text-gray-800 tracking-tight mb-8">
        Category Management
       </h1>

      {/* FORM CARD */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-[90%] md:w-[70%] lg:w-[60%] bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-8 border border-gray-200"
      >
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          {editingId ? "Edit Category" : "Add New Category"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <input
            type="text"
            name="name"
            placeholder="Category Name"
            value={form.name}
            onChange={handleChange}
            className="input-field"
          />

          <input
            type="text"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="input-field"
          />

          {/* IMAGE UPLOAD */}
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="input-field"
            />

            <div className="mt-3 flex justify-center">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  className="w-24 h-24 object-contain border rounded-md shadow"
                />
              ) : form.image ? (
                <img
                  src={getImageUrl(form.image)}
                  className="w-24 h-24 object-contain border rounded-md shadow"
                />
              ) : (
                <div className="w-24 h-24 flex items-center justify-center border rounded-md text-sm text-gray-400">
                  No Image
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BUTTONS */}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow-md font-semibold"
        >
          {loading
            ? editingId
              ? "Updating..."
              : "Adding..."
            : editingId
            ? "Update Category"
            : "Add Category"}
        </button>

        {editingId && (
          <button
            onClick={resetForm}
            className="ml-4 text-gray-500 underline"
            type="button"
          >
            Cancel
          </button>
        )}
      </motion.form>

      {/* TABLE */}
      <div className="w-[90%] md:w-[70%] mt-10 bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
        <table className="w-full">
          <thead className="bg-indigo-600 text-white sticky top-0">
            <tr>
              <th className="table-head">No</th>
              <th className="table-head">Image</th>
              <th className="table-head">Name</th>
              <th className="table-head">Description</th>
              <th className="table-head">Action</th>
            </tr>
          </thead>

          <tbody>
            {categories.length > 0 ? (
              categories.map((item, index) => (
                <motion.tr
                  key={item._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="table-cell text-center">{index + 1}</td>

                  <td className="table-cell text-center">
                    <img
                      src={getImageUrl(item.image)}
                      className="w-14 h-14 object-contain border rounded-md mx-auto"
                    />
                  </td>

                  <td className="table-cell">{item.name}</td>
                  <td className="table-cell">{item.description}</td>

                  <td className="flex justify-center gap-4">
                    <button
                      onClick={() => editCategory(item)}
                      className="text-blue-600 font-medium hover:underline"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteCategory(item._id)}
                      className="text-red-500 text-2xl hover:text-red-600"
                    >
                      <TiDelete />
                    </button>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-6 text-gray-500">
                  No Categories Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CategoryTable;
