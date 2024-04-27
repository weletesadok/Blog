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
      <footer className="footer footer-back rounded mx-2 mt-7 text-white py-5 height-full">
        <div className="container mx-auto px-4">
          <div className="flex items-start justify-center gap-6 wrap">
            <div className="solid-border">
              <div className="flex flex-col items-center justify-center">
                <Link
                  to="/"
                  className="text-white flex items-center mb-4 lg:mb-0"
                >
                  <span className="text-lg font-bold">Home</span>
                </Link>

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
              </div>
            </div>
            <div className="flex  flex-col wrap justify-center solid-border">
              <a
                href="https://www.github.com/weletesadok"
                className="text-white hover:text-gray-300  text-lg font-bold rounded-full"
              >
                Github
              </a>
              <a
                href="https://www.twitter.com/weletesadok"
                className="text-white hover:text-gray-300  text-lg font-bold"
              >
                Twitter
              </a>
              <a
                href="https://www.linkedin.com/weletesadok"
                className="text-white hover:text-gray-300  text-lg font-bold"
              >
                Linkedin
              </a>
            </div>
            <div className="solid-border">
              <ul>
                <li>
                  <a
                    href="#top"
                    className="hover:text-gray-300 text-lg font-bold"
                  >
                    Back to Top
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.facebook.com/weletesadok"
                    className="hover:text-gray-300 text-lg font-bold"
                  >
                    Facebook
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.github.com/weletesadok"
                    className="hover:text-gray-300 text-lg font-bold"
                  >
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
            <div className="solid-border">
              {username && (
                <Link
                  to="/blogs/new"
                  className="text-white flex items-center mb-4 lg:mb-0 text-lg font-bold"
                >
                  write Blogs
                </Link>
              )}
              {isAdmin && (
                <Link
                  to="/users"
                  className="text-white flex items-center mb-4 lg:mb-0 text-lg font-bold"
                >
                  Users
                </Link>
              )}
              {username && (
                <button
                  onClick={handleLogout}
                  className="text-lg font-bold text-lg font-bold"
                >
                  logout
                </button>
              )}
              {!username && (
                <Link
                  to="/login"
                  className="text-lg font-bold text-lg font-bold"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
