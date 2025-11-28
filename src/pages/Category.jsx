import React, { useEffect, useState } from "react";
import { TiDelete } from "react-icons/ti";

function CategoryTable() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    // image is the existing image path (string) from backend, e.g. "/uploads/abc.jpg"
    image: "",
    // imageFile is the File object selected by user (for new upload)
    imageFile: null,
  });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); // preview for newly selected file

  const API_URL = "http://localhost:8080/api/categories";
  const BACKEND_BASE = "http://localhost:8080"; // used to prefix image paths returned from backend

  // Fetch categories
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

  // Generic text input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // File input change (store file and create preview)
  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) {
      // user cleared file input
      setForm((prev) => ({ ...prev, imageFile: null }));
      setPreviewUrl(null);
      return;
    }

    setForm((prev) => ({ ...prev, imageFile: file }));
    // create temporary preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  // Reset form helper
  const resetForm = () => {
    setForm({ name: "", description: "", image: "", imageFile: null });
    setPreviewUrl(null);
    setEditingId(null);
  };

  // Submit for Add + Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.description) {
      alert("Please fill name and description");
      return;
    }

    setLoading(true);

    try {
      let res;

      if (editingId) {
        // UPDATE
        // If user picked a new file -> send FormData (so backend can accept and replace)
        if (form.imageFile) {
          const formData = new FormData();
          formData.append("name", form.name);
          formData.append("description", form.description);
          formData.append("image", form.imageFile); // field name must match upload.single("image")

          res = await fetch(`${API_URL}/${editingId}`, {
            method: "PUT",
            body: formData,
          });
        } else {
          // No new file chosen -> send JSON to preserve existing image on backend
          // Backend PUT handler should accept JSON and update fields without touching the image
          res = await fetch(`${API_URL}/${editingId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: form.name,
              description: form.description,
              // optionally include image path so backend keeps it unchanged
              image: form.image,
            }),
          });
        }
      } else {
        // CREATE NEW CATEGORY (always use FormData so image upload works)
        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("description", form.description);

        if (form.imageFile) {
          formData.append("image", form.imageFile);
        } else {
          // no file chosen: if you want to require image, alert
          // otherwise allow creating category without image
          // here we allow creating without image
        }

        res = await fetch(API_URL, {
          method: "POST",
          body: formData,
        });
      }

      if (!res.ok) throw new Error("Failed to save category");

      // success -> refresh list and reset
      await fetchCategories();
      resetForm();
    } catch (error) {
      console.error("Error saving category:", error);
      alert("Error saving category");
    } finally {
      setLoading(false);
    }
  };

  // Load category into form for editing
  const editCategory = (cat) => {
    setForm({
      name: cat.name || "",
      description: cat.description || "",
      image: cat.image || "", // server returns path like "/uploads/file.jpg" or a full URL
      imageFile: null,
    });
    setPreviewUrl(null); // clear file preview (show existing image from server instead)
    setEditingId(cat._id);
    // scroll to form or focus if needed
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete category
  const deleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c._id !== id));
      } else {
        alert("Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  // Helper to compute image URL to display
  const getImageUrl = (item) => {
    if (!item) return null;

    // If item.image is already a full URL (starts with http), use it
    if (item.startsWith("http://") || item.startsWith("https://")) return item;

    // If it starts with '/', prefix the backend host
    if (item.startsWith("/")) return `${BACKEND_BASE}${item}`;

    // Otherwise, assume it's a filename in uploads
    return `${BACKEND_BASE}/uploads/${item}`;
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <h1 className="text-2xl font-semibold text-gray-600 mb-4">Category Manager</h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="w-[90%] md:w-[70%] lg:w-[60%] bg-white shadow-lg p-6 m-10"
      >
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          {editingId ? "Edit Category" : "Add New Category"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Category Name"
            value={form.name}
            onChange={handleChange}
            className="border rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-400"
          />

          <input
            type="text"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="border rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-400"
          />

          <div className="flex flex-col">
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              className="border rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-400"
            />

            {/* Preview area */}
            <div className="mt-3">
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
        </div>

        <div className="mt-5 flex items-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
          >
            {loading ? (editingId ? "Updating..." : "Adding...") : editingId ? "Update Category" : "Add Category"}
          </button>

          {editingId && (
            <button
              onClick={() => resetForm()}
              type="button"
              className="ml-4 text-gray-600 underline"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* Category Table */}
      <div className="w-[90%] md:w-[70%] bg-white shadow-xl rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left">No</th>
              <th className="px-4 py-3 text-left">Image</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {categories.length > 0 ? (
              categories.map((item, index) => (
                <tr
                  key={item._id}
                  className="border-b hover:bg-indigo-50 transition-colors duration-200"
                >
                  <td className="px-4 py-3 text-center">{index + 1}</td>

                  <td className="px-4 py-3 text-center">
                    {item.image ? (
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        className="w-14 h-14 object-contain rounded-md border mx-auto"
                      />
                    ) : (
                      <div className="w-14 h-14 flex items-center justify-center border rounded-md text-xs text-gray-400 mx-auto">
                        No Image
                      </div>
                    )}
                  </td>

                  <td className="px-4 py-3 font-medium text-gray-800">{item.name}</td>

                  <td className="px-4 py-3 text-gray-600">{item.description}</td>

                  <td className="px-4 py-3 text-center flex gap-4 justify-center">
                    <button
                      onClick={() => editCategory(item)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteCategory(item._id)}
                      className="text-red-500 hover:text-red-700 text-2xl"
                    >
                      <TiDelete />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500 font-medium">
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
