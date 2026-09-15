import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

function Cart() {
  const { user } = useSelector((state) => state.auth);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const navigate = useNavigate();

  const fetchCart = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axiosInstance.get(`/cart/${user.id}`);
      setCartItems(response.data);
    } catch (err) {
      setError("Failed to load cart.");
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleUpdateQuantity = async (cartId, newQuantity) => {
    if (newQuantity < 1) return;
    setActionError("");
    try {
      await axiosInstance.put(`/cart/${cartId}`, null, {
        params: { quantity: newQuantity },
      });
      fetchCart();
    } catch (err) {
      setActionError(
        typeof err.response?.data === "string"
          ? err.response.data
          : "Failed to update quantity."
      );
    }
  };

  const handleRemove = async (cartId) => {
    setActionError("");
    try {
      await axiosInstance.delete(`/cart/${cartId}`);
      fetchCart();
    } catch (err) {
      setActionError(
        typeof err.response?.data === "string"
          ? err.response.data
          : "Failed to remove item."
      );
    }
  };

  const handleClearCart = async () => {
    setActionError("");
    try {
      await axiosInstance.delete(`/cart/clear/${user.id}`);
      fetchCart();
    } catch (err) {
      setActionError(
        typeof err.response?.data === "string"
          ? err.response.data
          : "Failed to clear cart."
      );
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading cart...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Cart</h1>
        {cartItems.length > 0 && (
          <button
            onClick={handleClearCart}
            className="text-sm text-red-500 hover:underline"
          >
            Clear Cart
          </button>
        )}
      </div>

      {actionError && <p className="text-red-500 text-sm mb-4">{actionError}</p>}

      {cartItems.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-4">Your cart is empty.</p>
          <Link to="/products" className="text-blue-600 hover:underline">
            Browse products
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between"
              >
                <div>
                  <h3 className="font-semibold">{item.product.name}</h3>
                  <p className="text-sm text-gray-500">
                    ₹{item.product.price.toLocaleString()} each
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    className="border rounded px-2 py-1 hover:bg-gray-50"
                  >
                    −
                  </button>
                  <span className="w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    className="border rounded px-2 py-1 hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>

                <p className="font-semibold w-24 text-right">
                  ₹{(item.product.price * item.quantity).toLocaleString()}
                </p>

                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-red-500 text-sm hover:underline ml-4"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-white rounded-lg shadow-sm p-6 flex justify-between items-center">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-2xl font-bold text-blue-600">
              ₹{total.toLocaleString()}
            </span>
          </div>

          <div className="mt-6 text-right">
           <button
  onClick={() => navigate("/checkout")}
  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
>
  Proceed to Checkout
</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;

