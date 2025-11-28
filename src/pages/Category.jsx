import React, { useEffect, useState } from "react";
import { TiDelete } from "react-icons/ti";

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
        // CREATE NEW
        const fd = new FormData();
        fd.append("name", form.name);
        fd.append("description", form.description);

        if (form.imageFile) {
          fd.append("image", form.imageFile);
        }

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
    <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <h1 className="text-2xl font-semibold text-gray-600 mb-4">
        Category Manager
      </h1>

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

          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="border rounded-md px-4 py-2"
            />

            <div className="mt-3">
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
                <div className="w-24 h-24 flex items-center justify-center border rounded-md text-sm text-gray-400">
                  No Image
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-5 bg-indigo-600 text-white px-6 py-2 rounded-md"
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
            className="ml-4 text-gray-600 underline"
            type="button"
          >
            Cancel Edit
          </button>
        )}
      </form>

      <div className="w-[90%] md:w-[70%] bg-white shadow-xl rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="px-4 py-3">No</th>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {categories.length > 0 ? (
              categories.map((item, index) => (
                <tr key={item._id} className="border-b">
                  <td className="text-center p-3">{index + 1}</td>

                  <td className="text-center p-3">
                    {item.image ? (
                      <img
                        src={getImageUrl(item.image)}
                        className="w-14 h-14 object-contain border rounded-md mx-auto"
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>

                  <td className="p-3">{item.name}</td>
                  <td className="p-3">{item.description}</td>

                  <td className="p-3 flex justify-center gap-4">
                    <button
                      onClick={() => editCategory(item)}
                      className="text-blue-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteCategory(item._id)}
                      className="text-red-500 text-2xl"
                    >
                      <TiDelete />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-6">
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
