import { useGetBlogsQuery } from "./blogSlice";
import Blog from "./Blog";
import useTitle from "../../hooks/useTitle";
import PulseLoader from "react-spinners/PulseLoader";

const BlogsList = () => {
  useTitle("Blogs");

  const {
    data: blogs,
    isLoading,
    isSuccess,
    isError,
    error,
    status,
  } = useGetBlogsQuery("blogsList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let content;

  if (isLoading) content = <PulseLoader color={"#FFF"} />;

  if (isError) {
    content = <p>{error.error}</p>;
    if (error.status === "FETCH_ERROR") {
      content = (
        <p className="text-red-500 font-bolder-[1rem]">
          Sorry the backend server is down right now.
        </p>
      );
    }
  }

  if (isSuccess) {
    const { ids } = blogs;

    content = (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {ids.map((id) => {
            return <Blog blogId={id} key={id} />;
          })}
         {/* <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
            {ids.map((id) => {
              return <Blog blogId={id} key={id} />;
            })}
          </div>*/}
        </div>
      </div>
    );
  }

  return content;
};
export default BlogsList;
