import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAddNewBlogMutation } from "./blogSlice";
import useTitle from "./../../hooks/useTitle";
import useAuth from "./../../hooks/useAuth";

const AddBlog = () => {
  const { username, id } = useAuth();
  const [message, setMessage] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useTitle("Add New Blog");
  const [addNewBlog, { isLoading, isSuccess, isError, error }] =
    useAddNewBlogMutation();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: id,
    category: "",
    image: null,
  });

  useEffect(() => {
    if (isSuccess) {
      setMessage("post created");
      setFormData([]);
      console.log(message);
      navigate("/blogs");
    } else if (isError) {
      setErrMsg("error while creating post");
      console.log(errMsg);
    }
    return () => {
      setMessage("");
      setErrMsg("");
    };
  }, [isSuccess, isError, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setFormData({
        ...formData,
        image: reader.result,
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
    console.log(formData.image);
    try {
      const response = await addNewBlog(formData);
      console.log(formData)
    } catch (error) {
      console.error(error);
    }
  };
  const content = (
              <form onSubmit={handleSubmit}>
              Write beautiful posts
                  <input
                    type="text"
                    name="title"
                    id="title"
                    placeholder="title"
                    value={formData.title}
                    onChange={handleChange}
                  />
                  <textarea
                    type="text"
                    name="content"
                    id="content"
                    placeholder="content"
                    value={formData.content}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="category"
                    id="category"
                    placeholder="category"
                    value={formData.category}
                    onChange={handleChange}
                  />

                  <input
                    id="dropzone-file"
                    type="file"
                    onChange={handleImageChange}
                  />

                 {/* <label
                    htmlFor="dropzone-file"
                  >
                    {formData.image && (
                      <img
                        src={formData.image}
                        alt="image"
                        className="w-30 h-30  ml-2"
                      />
                    )}
                  </label>*/}

                  <button
                    type="submit"
                  >
                    Add Post
                  </button>
              </form>
  );

  return content;
};

export default AddBlog;
