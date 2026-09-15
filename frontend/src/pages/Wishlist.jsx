import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

function Wishlist() {
  const { user } = useSelector((state) => state.auth);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const fetchWishlist = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axiosInstance.get(`/wishlist/${user.id}`);
      setItems(response.data);
    } catch (err) {
      setError("Failed to load wishlist.");
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleRemove = async (wishlistId) => {
    setActionError("");
    setActionMessage("");
    try {
      await axiosInstance.delete(`/wishlist/${wishlistId}`);
      fetchWishlist();
    } catch (err) {
      setActionError(
        typeof err.response?.data === "string"
          ? err.response.data
          : err.response?.data?.message || "Failed to remove item."
      );
    }
  };

  const handleMoveToCart = async (item) => {
    setActionError("");
    setActionMessage("");
    try {
      await axiosInstance.post("/cart/add", null, {
        params: { userId: user.id, productId: item.product.id, quantity: 1 },
      });
      await axiosInstance.delete(`/wishlist/${item.id}`);
      setActionMessage(`${item.product.name} moved to cart!`);
      fetchWishlist();
    } catch (err) {
      setActionError(
        typeof err.response?.data === "string"
          ? err.response.data
          : err.response?.data?.message || "Failed to move to cart."
      );
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading wishlist...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Wishlist</h1>

      {actionMessage && (
        <p className="text-green-600 text-sm mb-4">{actionMessage}</p>
      )}
      {actionError && <p className="text-red-500 text-sm mb-4">{actionError}</p>}

      {items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-4">Your wishlist is empty.</p>
          <Link to="/products" className="text-blue-600 hover:underline">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between"
            >
              <div>
                <h3 className="font-semibold">{item.product.name}</h3>
                <p className="text-sm text-gray-500">
                  {item.product.category?.name} · ₹
                  {item.product.price.toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleMoveToCart(item)}
                  className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 transition text-sm"
                >
                  Move to Cart
                </button>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-red-500 text-sm hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;