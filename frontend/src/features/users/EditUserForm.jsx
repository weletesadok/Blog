import { useState, useEffect } from "react";
import { useUpdateUserMutation, useDeleteUserMutation } from "./usersApiSlice";
import { useNavigate } from "react-router-dom";
import { PulseLoader } from "react-spinners";

const EditUserForm = ({ user }) => {
  const navigate = useNavigate();
  const [updateUser, { isLoading, isSuccess, isError, error }] =
    useUpdateUserMutation();
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    zipCode: "",
    username: "",
    password: "",
    confirmPassword: "",
    avatar: null,
  });
  useEffect(() => {
    if (user) {
      setFormData({
        id: user._id,
        firstName: user.firstName ? user.firstName : "",
        lastName: user.lastName ? user.lastName : "",
        email: user.email,
        phoneNumber: user.phoneNumber ? user.phoneNumber : "",
        zipCode: user.zipCode ? user.zipCode : "",
        username: user.username,
        password: "",
        confirmPassword: "",
        avatar: user.avatar ? user.avatar : "",
      });
    }
  }, [user]);

  useEffect(() => {
    if (isSuccess) {
      setMessage("user updated succesfully");
      navigate("/users");
    } else if (isError) {
      setMessage("error while updating user");
    }
  }, [isError, isSuccess]);

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
      const response = await updateUser(formData);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  const content = (
    <>
      <form className="w-full max-w-md" onSubmit={handleSubmit}>
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
        <button type="submit">update</button>
      </form>
    </>
  );

  return content;
};
export default EditUserForm;
