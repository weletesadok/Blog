import React, { useEffect, useState } from "react";
import { useRegisterMutation } from "./authApiSlice";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [register, { isLoading, isSuccess, isError, error }] =
    useRegisterMutation();
    const [message, setMessage] = useState("")

  useEffect(() => {
    if (isSuccess) {
      setMessage("successfully registered");
      setFormData({});
      navigate("/login");
    }else if(isError){
      setMessage(error.data.error)
    }
    return ()=>{
      setMessage("")
    }
  }, [isSuccess, isError, navigate]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    zipCode: "",
    username: "",
    password: "",
    confirmPassword: "",
    avatar: null, // Assuming you'll handle file upload separately
  });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setFormData({
        ...formData,
        avatar: reader.result,
      });
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await register(formData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form className="w-full max-w-md" onSubmit={handleSubmit}>
    {message && <p className="bg-white rounded p-2 text-red-500">{message}</p> }
      <input
        type="text"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        placeholder="First Name"
      />
      <input
        type="text"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        placeholder="Last Name"
      />
      <input
        type="text"
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleChange}
        placeholder="Phone Number (e.g., 123-456-7890)"
      />
      <input
        type="text"
        name="zipCode"
        value={formData.zipCode}
        onChange={handleChange}
        pattern="[0-9]{5}"
        placeholder="Zip Code (e.g., 12345)"
      />
      <input
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Username"
      />
      <input id="dropzone-file" type="file" onChange={handleAvatarChange} />

      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email address"
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
      />
      <input
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="Confirm Password"
      />
      <button type="submit">Sign Up</button>

      <a
        href="/login"
        className="text-sm text-blue-500 hover:underline dark:text-blue-400"
      >
        Already have an account?
      </a>
    </form>
  );
}
