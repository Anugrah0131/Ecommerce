import React, { useEffect, useState } from "react";
import { TiDelete } from "react-icons/ti";

function CategoryTable() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null); // ⭐ Track which category is being edited

  const API_URL = "http://localhost:8080/api/categories";

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

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit for Add + Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.description || !form.image) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      let res;

      if (editingId) {
        // ⭐ UPDATE EXISTING CATEGORY
        res = await fetch(`${API_URL}/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        // ⭐ ADD NEW CATEGORY
        res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }

      if (!res.ok) throw new Error("Failed to save category");

      setForm({ name: "", description: "", image: "" });
      setEditingId(null); // Reset edit mode
      fetchCategories(); // Reload list
    } catch (error) {
      console.error("Error saving category:", error);
      alert("Error saving category");
    }

    setLoading(false);
  };

  // ⭐ Load category into form for editing
  const editCategory = (cat) => {
    setForm({
      name: cat.name,
      description: cat.description,
      image: cat.image,
    });
    setEditingId(cat._id);
  };

  // Delete category
  const deleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

      if (res.ok) {
        setCategories(categories.filter((c) => c._id !== id));
      } else {
        alert("Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center py-10">

      <h1 className="text-2xl font-semibold text-gray-600 mb-4">
        Category Manager
      </h1>

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
          <input
            type="text"
            name="image"
            placeholder="Image URL"
            value={form.image}
            onChange={handleChange}
            className="border rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-5 bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
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
            onClick={() => {
              setEditingId(null);
              setForm({ name: "", description: "", image: "" });
            }}
            type="button"
            className="ml-4 text-gray-600 underline"
          >
            Cancel Edit
          </button>
        )}
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
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 object-contain rounded-md border mx-auto"
                    />
                  </td>

                  <td className="px-4 py-3 font-medium text-gray-800">
                    {item.name}
                  </td>

                  <td className="px-4 py-3 text-gray-600">
                    {item.description}
                  </td>

                  <td className="px-4 py-3 text-center flex gap-4 justify-center">
                    {/* ⭐ EDIT BUTTON */}
                    <button
                      onClick={() => editCategory(item)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Edit
                    </button>

                    {/* DELETE */}
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
                <td
                  colSpan="5"
                  className="text-center py-6 text-gray-500 font-medium"
                >
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
