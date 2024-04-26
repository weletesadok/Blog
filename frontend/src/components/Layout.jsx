import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useSendLogoutMutation } from "../features/auth/authApiSlice";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

export const Layout = () => {
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
    <div className="min-h-[100vh]  dark:text-white dark:font-8 dark:bg-[linear-gradient(to left, red, black)]">
      <div className="flex items-center justify-evenly py-4">
        <Link to="/public">Home</Link>

        <Link to="/blogs">Explore</Link>
        {username && <Link to="/blogs/new">write Blogs</Link>}

        {isAdmin && <Link to="/users">Users</Link>}
        {username && <button onClick={handleLogout}>logout</button>}
        {!username && <Link to="/login">Login</Link>}
      </div>
      <Outlet />
    </div>
  );
};

export default Layout;
