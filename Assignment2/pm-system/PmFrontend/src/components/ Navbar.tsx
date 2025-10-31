import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="w-full flex items-center justify-between bg-white shadow-md px-8 py-4 mb-8 rounded-b-xl">
      <Link to="/dashboard" className="font-semibold text-indigo-600 text-lg">
        Dashboard
      </Link>
      <button
        onClick={handleLogout}
        className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg px-5 py-2 font-medium"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
