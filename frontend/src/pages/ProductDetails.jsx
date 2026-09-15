import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstance from "../api/axiosInstance";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axiosInstance.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError("Product not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    setActionMessage("");
    setActionError("");
    try {
      await axiosInstance.post("/cart/add", null, {
        params: { userId: user.id, productId: product.id, quantity },
      });
      setActionMessage("Added to cart!");
    } catch (err) {
      setActionError(
        typeof err.response?.data === "string"
          ? err.response.data
          : "Failed to add to cart."
      );
    }
  };

  const handleAddToWishlist = async () => {
    setActionMessage("");
    setActionError("");
    try {
      await axiosInstance.post("/wishlist/add", null, {
        params: { userId: user.id, productId: product.id },
      });
      setActionMessage("Added to wishlist!");
    } catch (err) {
      setActionError(
        typeof err.response?.data === "string"
          ? err.response.data
          : err.response?.data?.message || "Failed to add to wishlist."
      );
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!product) return null;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-blue-600 hover:underline mb-6"
      >
        ← Back
      </button>

      <div className="bg-white rounded-lg shadow-sm p-8">
        <p className="text-sm text-gray-400 mb-2">{product.category?.name}</p>
        <h1 className="text-3xl font-bold mb-3">{product.name}</h1>
        <p className="text-gray-600 mb-4">{product.description}</p>
        <p className="text-2xl font-bold text-blue-600 mb-1">
          ₹{product.price.toLocaleString()}
        </p>
        <p className="text-sm text-gray-500 mb-6">
          {product.quantity > 0
            ? `${product.quantity} in stock`
            : "Out of stock"}
        </p>

        {actionMessage && (
          <p className="text-green-600 text-sm mb-4">{actionMessage}</p>
        )}
        {actionError && (
          <p className="text-red-500 text-sm mb-4">{actionError}</p>
        )}

        <div className="flex items-center gap-4 mb-6">
          <label className="text-sm font-medium">Quantity:</label>
          <input
            type="number"
            min="1"
            max={product.quantity}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="border border-gray-300 rounded px-3 py-1 w-20"
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleAddToCart}
            disabled={product.quantity === 0}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:opacity-40"
          >
            Add to Cart
          </button>
          <button
            onClick={handleAddToWishlist}
            className="border border-blue-600 text-blue-600 px-6 py-2 rounded hover:bg-blue-50 transition"
          >
            Add to Wishlist
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;