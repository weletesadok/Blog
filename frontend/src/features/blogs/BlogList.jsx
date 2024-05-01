import { useGetBlogsQuery } from "./blogSlice";
import useTitle from "../../hooks/useTitle";
import PulseLoader from "react-spinners/PulseLoader";
import BlogCard from "./BlogCard";

const BlogsList = () => {
  useTitle("Blogs");

  const {
    data: blogs,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetBlogsQuery();

  let content;

  if (isLoading) content = <PulseLoader color={"#FFF"} />;

  if (isError) {
    content = "";
  }

  if (isSuccess) {
    const { entities } = blogs;
    content = (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Object.values(entities).map((blog, index) => (
            <BlogCard key={index} blog={blog} />
          ))}
        </div>
      </div>
    );
  }

  return content;
};
export default BlogsList;
