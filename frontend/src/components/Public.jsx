import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
export default () => {
  const { username } = useAuth();
  return (
    <div className="w-[100vw] text-center">
      <h1 className="text-5xl font-bold text-white mb-8">Share Your Ideas</h1>
      <p className="text-xl text-white mb-12">
        Motivate others, inspire creativity, and make an impact.
      </p>
      <Link
        to={username ? "/blogs/new" : "/login"}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 p-6 rounded-full"
      >
        Get Started
      </Link>
    </div>
  );
};
