import { useGetUserBlogsQuery } from "./blogSlice";
import PulseLoader from "react-spinners/PulseLoader";
import { useParams } from "react-router-dom";
import BlogCard from "./BlogCard";

export default () => {
  const { userId } = useParams();
  const {
    data: blogs,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useGetUserBlogsQuery({ userId });

  let content = "";

  if (isSuccess) {
    content = (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {blogs.map((blog, index) => (
            <BlogCard key={index} blog={blog} />
          ))}
        </div>
      </div>
    );
  } else if (isLoading) {
    content = <PulseLoader color="red" />;
  } else if (isError) {
    content = <p>sorry error occured</p>;
  }
  return content;
};
