import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");

  const fetchOrder = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axiosInstance.get(`/orders/${id}`);
      setOrder(response.data);
    } catch (err) {
      setError("Order not found.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleCancel = async () => {
    setCancelError("");
    setCancelling(true);
    try {
      await axiosInstance.put(`/orders/${id}/cancel`);
      fetchOrder();
    } catch (err) {
      setCancelError(
        typeof err.response?.data === "string"
          ? err.response.data
          : "Failed to cancel order."
      );
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading order...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!order) return null;

  const statusColors = {
  PLACED: "bg-yellow-100 text-yellow-700",
  PAID: "bg-indigo-100 text-indigo-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <Link to="/orders" className="text-sm text-blue-600 hover:underline">
        ← Back to Orders
      </Link>

      <div className="bg-white rounded-lg shadow-sm p-6 mt-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Order #{order.id}</h1>
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full ${
              statusColors[order.status] || "bg-gray-100 text-gray-700"
            }`}
          >
            {order.status}
          </span>
        </div>

        <p className="text-sm text-gray-500 mb-6">
          Placed on {new Date(order.orderDate).toLocaleString()}
        </p>

        {order.address && (
          <div className="mb-6 pb-6 border-b">
            <h2 className="text-sm font-semibold mb-1">Delivery Address</h2>
            <p className="text-sm text-gray-600">
              {order.address.houseNo}, {order.address.street},{" "}
              {order.address.city}, {order.address.state} -{" "}
              {order.address.pincode}
            </p>
          </div>
        )}

        <h2 className="text-sm font-semibold mb-3">Items</h2>
        <div className="space-y-3 mb-6">
          {order.orderItems.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>
                {item.product.name} × {item.quantity}
              </span>
              <span className="font-medium">
                ₹{(item.price * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <span className="font-semibold">Total</span>
          <span className="text-xl font-bold text-blue-600">
            ₹{order.totalAmount.toLocaleString()}
          </span>
        </div>

        {cancelError && (
          <p className="text-red-500 text-sm mt-4">{cancelError}</p>
        )}

        {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="mt-6 text-red-500 text-sm hover:underline disabled:opacity-50"
          >
            {cancelling ? "Cancelling..." : "Cancel Order"}
          </button>
        )}
      </div>
    </div>
  );
}

export default OrderDetails;