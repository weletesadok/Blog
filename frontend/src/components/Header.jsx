import { useEffect } from "react";
import { useSendLogoutMutation } from "../features/auth/authApiSlice";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { Home } from "@mui/icons-material";

export default () => {
  const navigate = useNavigate();
  const { username, isAdmin } = useAuth();
  const [sendLogout, { isLoading, isSuccess, isError, error }] =
    useSendLogoutMutation();
  const handleLogout = async () => {
    try {
      sendLogout();
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (isSuccess) navigate("/");
  }, [isSuccess, navigate]);
  return (
    <>
      <nav className="px-8 py-4 bg-secondary w-[100vw] sticky top-0 left-0 right-0 z-10 flex justify-between flex-wrap">
        <Link className="hover:text-blue-700" to="/">
          <Home />
        </Link>
        <div className="flex justify-between items-center gap-4 flex-wrap ">
          <Link
            to="/blogs"
            className="text-white flex items-center mb-4 lg:mb-0"
          >
            <span className="text-lg font-bold hover:text-blue-700">
              Explore
            </span>
          </Link>
          <Link
            to="/about"
            className="text-white flex items-center mb-4 lg:mb-0 hover:text-blue-700 "
          >
            <span className="text-lg font-bold">About</span>
          </Link>
          {username && (
            <Link
              to="/blogs/new"
              className="text-white hover:text-blue-700 flex items-center mb-4 lg:mb-0 font-bold text-lg font-bold"
            >
              write
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/users"
              className="text-white hover:text-blue-700 flex items-center mb-4 lg:mb-0 font-bold text-lg font-bold"
            >
              Users
            </Link>
          )}
          {username && (
            <button
              onClick={handleLogout}
              className="hover:text-blue-700 text-white flex items-center mb-4 lg:mb-0 font-bold text-lg font-bold"
            >
              logout
            </button>
          )}
          {!username && (
            <Link
              to="/login"
              className="hover:text-blue-700 text-white flex items-center mb-4 lg:mb-0 font-bold text-lg font-bold"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </>
  );
};
