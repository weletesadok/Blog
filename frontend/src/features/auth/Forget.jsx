import { useEffect, useState } from "react";
import { useForgetPasswordMutation, useForgetMutation } from "./authApiSlice";
import { Link, useNavigate } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import useTitle from "../../hooks/useTitle";
import Alert from "./../../components/Alert";

export default () => {
  useTitle("Forget password");
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [severity, setSeverity] = useState("");
  const [forget, { isLoading, isError, isSuccess, error }] =
    useForgetMutation();
  const [
    forgetPassword,
    {
      isLoading: isForgetLoading,
      isError: isForgetError,
      isSuccess: isForgetSuccess,
      error: forgetError,
    },
  ] = useForgetPasswordMutation();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await forget({ email });
      console.log(res);
    } catch (e) {
      console.log(e);
    }
  };

  const handleForgetSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgetPassword({ password, token });
      setPassword("");
      setToken("");
    } catch (e) {
      console.log(e);
    }
  };
  const forgetForm = (
    <>
      <form onSubmit={handleForgetSubmit}>
        set your new password
        <input
          type="text"
          placeholder="token"
          onChange={(e) => setToken(e.target.value)}
        />
        <input
          type="password"
          placeholder="New Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <input type="submit" value="Set new Password" />
      </form>
    </>
  );
  const LoadingState = <PulseLoader color="yellow" />;
  const initialForm = (
    <>
      <form onSubmit={handleSubmit}>
        Forget Password
        <input
          type="email"
          placeholder="your email here"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input type="submit" hidden />
      </form>
    </>
  );

  useEffect(() => {
    if (isError || isForgetError) {
      setMessage("Error please try agian later");
      setSeverity("error");
    } else if (isForgetSuccess) {
      setSeverity("success");
      setMessage(
        <Link to="/login">reset password success click here to login</Link>
      );
    } else if (isSuccess) {
      setMessage(
        "password reset token send to your email, put your new password and token send in the given field."
      );
      setSeverity("success");
    }
    return () => {
      setMessage("");
      setSeverity("");
    };
  }, [isError, isForgetError, isSuccess, isForgetSuccess]);

  let content;
  if (isLoading || isForgetLoading) {
    content = LoadingState;
  } else if (isSuccess) {
    content = forgetForm;
  } else {
    content = initialForm;
  }

  return (
    <>
      {message && <Alert severity={severity} message={message} />}
      {content}
    </>
  );
};
