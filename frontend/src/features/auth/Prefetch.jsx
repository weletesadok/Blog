import { store } from "../../app/store";
import { usersApiSlice } from "../users/usersApiSlice";
import { blogsApiSlice } from "../blogs/blogSlice";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

const Prefetch = () => {
  useEffect(() => {
    store.dispatch(
      blogsApiSlice.util.prefetch("getBlogs", "blogsList", { force: true })
    );
    store.dispatch(
      usersApiSlice.util.prefetch("getUsers", "usersList", { force: true })
    );
  }, []);

  return <Outlet />;
};
export default Prefetch;
