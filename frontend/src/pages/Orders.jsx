import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const statusColors = {
  PLACED: "bg-yellow-100 text-yellow-700",
  PAID: "bg-indigo-100 text-indigo-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

function Orders() {
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axiosInstance.get(`/orders/user/${user.id}`);
        setOrders(response.data);
      } catch (err) {
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user.id]);

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading orders...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
          <Link to="/products" className="text-blue-600 hover:underline">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders
            .slice()
            .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
            .map((order) => (
              <Link
                to={`/orders/${order.id}`}
                key={order.id}
                className="block bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Order #{order.id}</h3>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      statusColors[order.status] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-1">
                  {new Date(order.orderDate).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  {order.orderItems.length} item
                  {order.orderItems.length !== 1 ? "s" : ""} · ₹
                  {order.totalAmount.toLocaleString()}
                </p>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
}

export default Orders;