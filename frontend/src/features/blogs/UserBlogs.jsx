import { useEffect } from "react";
import { useGetUserBlogsQuery } from "./blogSlice";
import PulseLoader from "react-spinners/PulseLoader";
import { useParams } from "react-router-dom";

export default () => {
  const { userId } = useParams();
  console.log(userId);
  const {
    data: blogs,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useGetUserBlogsQuery({ userId });

  let content = "";

    if (isSuccess) {
      content = JSON.stringify(blogs);
    } else if (isLoading) {
      content = <PulseLoader color="red" />;
    } else if (isError) {
      content = <p>sorry error occured</p>;
    }
  return content;
};
