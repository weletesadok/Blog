import { useEffect } from "react";
import { useSendLogoutMutation } from "../features/auth/authApiSlice";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

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
      <nav className="p-4 bg-secondary  fixed top-0 left-0 right-0 z-10 m-3 flex justify-between rounded-full">
        <div className="border-3-solid-white px-2">
          <Link to="/">My Logo</Link>
        </div>
        <div className="flex justify-between items-center gap-4 ">
         

          <Link
            to="/blogs"
            className="text-white flex items-center mb-4 lg:mb-0"
          >
            <span className="text-lg font-bold">Explore</span>
          </Link>
          <Link
            to="/about"
            className="text-white flex items-center mb-4 lg:mb-0"
          >
            <span className="text-lg font-bold">About</span>
          </Link>
          {username && (
            <Link
              to="/blogs/new"
              className="text-white flex items-center mb-4 lg:mb-0 font-bold text-lg font-bold"
            >
              write Blogs
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/users"
              className="text-white flex items-center mb-4 lg:mb-0 font-bold text-lg font-bold"
            >
              Users
            </Link>
          )}
          {username && (
            <button
              onClick={handleLogout}
              className="text-white flex items-center mb-4 lg:mb-0 font-bold text-lg font-bold"
            >
              logout
            </button>
          )}
          {!username && (
            <Link
              to="/login"
              className="text-white flex items-center mb-4 lg:mb-0 font-bold text-lg font-bold"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </>
  );
};
