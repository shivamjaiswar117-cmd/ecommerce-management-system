import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";

const statusColors = {
  PLACED: "bg-yellow-100 text-yellow-700",
  PAID: "bg-indigo-100 text-indigo-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const nextStatusOptions = {
  PLACED: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [updateError, setUpdateError] = useState({});

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axiosInstance.get("/orders/all");
      setOrders(response.data);
    } catch (err) {
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    setUpdateError((prev) => ({ ...prev, [orderId]: "" }));
    try {
      await axiosInstance.put(`/orders/${orderId}/status`, null, {
        params: { status: newStatus },
      });
      fetchOrders();
    } catch (err) {
      setUpdateError((prev) => ({
        ...prev,
        [orderId]:
          typeof err.response?.data === "string"
            ? err.response.data
            : err.response?.data?.message || "Failed to update status.",
      }));
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading orders...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Manage Orders</h1>

      <div className="space-y-4">
        {orders
          .slice()
          .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
          .map((order) => {
            const options = nextStatusOptions[order.status] || [];
            return (
              <div key={order.id} className="bg-white rounded-lg shadow-sm p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">
                    Order #{order.id} — {order.user?.name} ({order.user?.email})
                  </h3>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      statusColors[order.status] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <p className="text-sm text-gray-500 mb-2">
                  {new Date(order.orderDate).toLocaleString()} ·{" "}
                  {order.orderItems.length} item
                  {order.orderItems.length !== 1 ? "s" : ""} · ₹
                  {order.totalAmount.toLocaleString()}
                </p>

                {order.address && (
                  <p className="text-sm text-gray-500 mb-3">
                    Ship to: {order.address.houseNo}, {order.address.street},{" "}
                    {order.address.city}, {order.address.state} -{" "}
                    {order.address.pincode}
                  </p>
                )}

                {updateError[order.id] && (
                  <p className="text-red-500 text-sm mb-2">
                    {updateError[order.id]}
                  </p>
                )}

                {options.length > 0 ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Update status:</span>
                    {options.map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(order.id, status)}
                        disabled={updatingId === order.id}
                        className="text-xs font-medium px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 transition disabled:opacity-50"
                      >
                        Mark as {status}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">No further actions available.</p>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default AdminOrders;