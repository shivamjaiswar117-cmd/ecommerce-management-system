import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

function Checkout() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    houseNo: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    addressType: "HOME",
  });
  const [formError, setFormError] = useState("");
  const [savingAddress, setSavingAddress] = useState(false);

  const fetchAddresses = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axiosInstance.get(`/addresses/user/${user.id}`);
      setAddresses(response.data);
      if (response.data.length > 0) {
        setSelectedAddressId(response.data[0].id);
      }
    } catch (err) {
      setError("Failed to load addresses.");
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setFormError("");
    setSavingAddress(true);
    try {
      await axiosInstance.post("/addresses", {
        ...formData,
        user: { id: user.id },
      });
      setFormData({
        houseNo: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
        addressType: "HOME",
      });
      setShowForm(false);
      fetchAddresses();
    } catch (err) {
      setFormError(
        typeof err.response?.data === "string"
          ? err.response.data
          : "Failed to save address."
      );
    } finally {
      setSavingAddress(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) return;
    setOrderError("");
    setPlacingOrder(true);
    try {
      const response = await axiosInstance.post("/orders/create", null, {
        params: { userId: user.id, addressId: selectedAddressId },
      });
      navigate(`/orders/${response.data.id}`);
    } catch (err) {
      setOrderError(
        typeof err.response?.data === "string"
          ? err.response.data
          : err.response?.data?.message || "Failed to place order."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {orderError && <p className="text-red-500 mb-4">{orderError}</p>}

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="font-semibold mb-4">Select a delivery address</h2>

        {addresses.length === 0 && !showForm && (
          <p className="text-gray-500 mb-4">No saved addresses yet.</p>
        )}

        <div className="space-y-3 mb-4">
          {addresses.map((addr) => (
            <label
              key={addr.id}
              className={`flex items-start gap-3 border rounded-lg p-3 cursor-pointer ${
                selectedAddressId === addr.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200"
              }`}
            >
              <input
                type="radio"
                name="address"
                checked={selectedAddressId === addr.id}
                onChange={() => setSelectedAddressId(addr.id)}
                className="mt-1"
              />
              <div className="text-sm">
                <p className="font-medium">{addr.addressType}</p>
                <p className="text-gray-600">
                  {addr.houseNo}, {addr.street}, {addr.city}, {addr.state} -{" "}
                  {addr.pincode}
                </p>
              </div>
            </label>
          ))}
        </div>

        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="text-blue-600 text-sm hover:underline"
          >
            + Add a new address
          </button>
        ) : (
          <form onSubmit={handleAddAddress} className="space-y-3 mt-4 border-t pt-4">
            {formError && <p className="text-red-500 text-sm">{formError}</p>}

            <input
              type="text"
              name="houseNo"
              placeholder="House No."
              value={formData.houseNo}
              onChange={handleFormChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
            <input
              type="text"
              name="street"
              placeholder="Street"
              value={formData.street}
              onChange={handleFormChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
            <div className="flex gap-3">
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleFormChange}
                required
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleFormChange}
                required
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={formData.pincode}
              onChange={handleFormChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
            <select
              name="addressType"
              value={formData.addressType}
              onChange={handleFormChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="HOME">Home</option>
              <option value="WORK">Work</option>
              <option value="OTHER">Other</option>
            </select>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={savingAddress}
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition disabled:opacity-50"
              >
                {savingAddress ? "Saving..." : "Save Address"}
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
      </div>

      <button
        onClick={handlePlaceOrder}
        disabled={!selectedAddressId || placingOrder}
        className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition disabled:opacity-40"
      >
        {placingOrder ? "Placing order..." : "Place Order"}
      </button>
    </div>
  );
}

export default Checkout;