import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";
import { useLoginMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import useTitle from "../../hooks/useTitle";

const Login = () => {
  useTitle("Login");
  const [persist, setPersist] = usePersist();
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();
  const handleToggle = () => {
    setPersist((prev) => !prev);
    console.log(persist);
  };
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      const { accessToken } = await login(formData).unwrap();
      dispatch(setCredentials({ accessToken }));
      setFormData({});
      navigate("/blogs");
    } catch (err) {
      setErrMsg(err?.data?.message);
      console.log(errMsg);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Your Username"
          value={formData.username}
          onChange={handleChange}
        />
        <Link href="/forget" className="text-sm text-blue-400 hover:underline">
          Forgot password?
        </Link>

        <input
          type="password"
          name="password"
          id="password"
          placeholder="Your Password"
          value={formData.password}
          onChange={handleChange}
        />
        <input
          type="checkbox"
          className="form__checkbox h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded"
          id="persist"
          onChange={handleToggle}
          checked={persist}
        />
        <span className="ml-2 text-gray-700 dark:text-gray-300">
          Trust This Device
        </span>

        <button type="submit">Sign in</button>
      </form>

      <p className="mt-6 text-sm text-center text-gray-400">
        Don't have an account yet?{" "}
        <Link
          to="/register"
          className="text-blue-500 focus:outline-none focus:underline hover:underline"
        >
          Sign up
        </Link>
        .
      </p>
    </>
  );
};

export default Login;
