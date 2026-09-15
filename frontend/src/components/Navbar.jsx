import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-xl font-bold text-blue-600">
        E-Shop
      </Link>

      <div className="flex items-center gap-6">
  <Link to="/" className="text-gray-700 hover:text-blue-600">
    Home
  </Link>
  <Link to="/products" className="text-gray-700 hover:text-blue-600">
    Products
  </Link>
  <Link to="/cart" className="text-gray-700 hover:text-blue-600">
    Cart
  </Link>
  <Link to="/wishlist" className="text-gray-700 hover:text-blue-600">
    Wishlist
  </Link>
  <Link to="/orders" className="text-gray-700 hover:text-blue-600">
    Orders
  </Link>

  {user?.role === "ADMIN" && (
    <div className="flex items-center gap-6 pl-6 border-l border-gray-200">
      <Link
        to="/admin/categories"
        className="text-purple-600 hover:text-purple-800 text-sm font-medium"
      >
        Manage Categories
      </Link>
      <Link
        to="/admin/products"
        className="text-purple-600 hover:text-purple-800 text-sm font-medium"
      >
        Manage Products
      </Link>
      <Link
        to="/admin/orders"
        className="text-purple-600 hover:text-purple-800 text-sm font-medium"
      >
        Manage Orders
      </Link>
      <Link
  to="/admin/users"
  className="text-purple-600 hover:text-purple-800 text-sm font-medium"
>
  Manage Users
</Link>
    </div>
  )}

        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Hi, {user?.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-1.5 rounded hover:bg-red-600 transition text-sm"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 transition text-sm"
          >
            Login
          </Link>
          
        )}
      </div>
    </nav>
  );
}

export default Navbar;