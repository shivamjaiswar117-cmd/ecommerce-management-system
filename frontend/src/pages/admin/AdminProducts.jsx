import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    categoryId: "",
  });
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        axiosInstance.get("/products"),
        axiosInstance.get("/categories"),
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
    } catch (err) {
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddForm = () => {
    setEditingId(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      quantity: "",
      categoryId: categories[0]?.id || "",
    });
    setFormError("");
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price,
      quantity: product.quantity,
      categoryId: product.category?.id || "",
    });
    setFormError("");
    setShowForm(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);

    const payload = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity, 10),
      category: { id: parseInt(formData.categoryId, 10) },
    };

    try {
      if (editingId) {
        await axiosInstance.put(`/products/${editingId}`, payload);
      } else {
        await axiosInstance.post("/products", payload);
      }
      setShowForm(false);
      fetchData();
    } catch (err) {
      setFormError(
        typeof err.response?.data === "string"
          ? err.response.data
          : "Failed to save product."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product? This cannot be undone.")) return;
    try {
      await axiosInstance.delete(`/products/${id}`);
      fetchData();
    } catch (err) {
      alert(
        typeof err.response?.data === "string"
          ? err.response.data
          : "Failed to delete product."
      );
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading products...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Products</h1>
        <button
          onClick={openAddForm}
          disabled={categories.length === 0}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm disabled:opacity-40"
        >
          + Add Product
        </button>
      </div>

      {categories.length === 0 && (
        <p className="text-sm text-amber-600 mb-4">
          Create a category first before adding products.
        </p>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-sm p-5 mb-6 space-y-3"
        >
          <h2 className="font-semibold">
            {editingId ? "Edit Product" : "New Product"}
          </h2>
          {formError && <p className="text-red-500 text-sm">{formError}</p>}

          <input
            type="text"
            name="name"
            placeholder="Product name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          />
          <div className="flex gap-3">
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
            />
            <input
              type="number"
              name="quantity"
              placeholder="Stock quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              min="0"
              className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-gray-500 text-sm hover:underline"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between"
          >
            <div>
              <h3 className="font-medium">{product.name}</h3>
              <p className="text-sm text-gray-500">
                {product.category?.name} · ₹{product.price.toLocaleString()} ·{" "}
                {product.quantity} in stock
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => openEditForm(product)}
                className="text-blue-600 text-sm hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="text-red-500 text-sm hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminProducts;