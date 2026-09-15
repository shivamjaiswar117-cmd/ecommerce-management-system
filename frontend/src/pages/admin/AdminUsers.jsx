import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../../api/axiosInstance";

function AdminUsers() {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [rowError, setRowError] = useState({});

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axiosInstance.get("/users");
      setUsers(response.data);
    } catch (err) {
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingId(userId);
    setRowError((prev) => ({ ...prev, [userId]: "" }));
    try {
      await axiosInstance.put(`/users/${userId}/role`, null, {
        params: { role: newRole },
      });
      fetchUsers();
    } catch (err) {
      setRowError((prev) => ({
        ...prev,
        [userId]:
          typeof err.response?.data === "string"
            ? err.response.data
            : err.response?.data?.message || "Failed to update role.",
      }));
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading users...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="px-4 py-3">{u.name || "—"}</td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">{u.phone}</td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      u.role === "ADMIN"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {u.id === currentUser.id ? (
                    <span className="text-xs text-gray-400">This is you</span>
                  ) : (
                    <>
                      <button
                        onClick={() =>
                          handleRoleChange(
                            u.id,
                            u.role === "ADMIN" ? "CUSTOMER" : "ADMIN"
                          )
                        }
                        disabled={updatingId === u.id}
                        className="text-blue-600 text-xs hover:underline disabled:opacity-50"
                      >
                        {u.role === "ADMIN" ? "Demote to Customer" : "Promote to Admin"}
                      </button>
                      {rowError[u.id] && (
                        <p className="text-red-500 text-xs mt-1">
                          {rowError[u.id]}
                        </p>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminUsers;