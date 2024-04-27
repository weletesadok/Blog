import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  selectAllBlogs,
  useGetBlogsQuery,
  useUpdateBlogMutation,
} from "./blogSlice";
import useTitle from "./../../hooks/useTitle";

const UpdateBlog = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  useTitle("update Blog");
  const [UpdateBlog, { isLoading, isSuccess, isError, error }] =
    useUpdateBlogMutation();
  const response = useGetBlogsQuery("blogsList", {
    selectFromResult: ({ data }) => ({
      blog: data?.entities[blogId],
    }),
  });
  useEffect(() => {
    const blog = response.blog;
    if (blog) {
      setFormData({
        postId: blog._id,
        title: blog.title,
        content: blog.content,
        author: blog.author,
        category: blog.category,
        image: null,
      });
    }
  }, [response]);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "",
    category: "",
    image: null,
  });

  useEffect(() => {
    if (isSuccess) {
      setFormData([]);
      navigate("/blogs");
    }
  }, [isSuccess, navigate]);

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
    try {
      console.log(formData);
      const response = await UpdateBlog(formData);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };
  const content = (
              <form onSubmit={handleSubmit}>
                  
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
                    className="hidden"
                  />

                  

                  <button
                    type="submit"
                  >
                    Update
                  </button>
              </form>
            
  );

  return content;
};

export default UpdateBlog;
