import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Login from "./features/auth/Login";
import UsersList from "./features/users/UsersList";
import EditUser from "./features/users/EditUser";
import NewUserForm from "./features/users/NewUserForm";
import Prefetch from "./features/auth/Prefetch";
import PersistLogin from "./features/auth/PersistLogin";
import RequireAuth from "./features/auth/RequireAuth";
import { ROLES } from "./config/roles";
import useTitle from "./hooks/useTitle";

import Register from "./features/auth/Register";
import AddBlog from "./features/blogs/AddBlog";
import BlogList from "./features/blogs/BlogList";
import UserBlogs from "./features/blogs/UserBlogs";
import EditBlog from "./features/blogs/EditBlog";
import Forget from "./features/auth/Forget";
import Public from "./components/Public";

function App() {
  useTitle("Bloging");

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index path="public" element={<Public />} />
        <Route path="login" element={<Login />} />
        <Route path="forget" element={<Forget />} />
        <Route path="register" element={<Register />} />
        <Route element={<Prefetch />}>
          <Route path="blogs" element={<BlogList />} />
          <Route path="blogs/user/:userId" element={<UserBlogs />} />
          <Route element={<PersistLogin />}>
            <Route
              element={<RequireAuth allowedRoles={[ROLES.User, ROLES.Admin]} />}
            >
              <Route path="blogs/edit/:blogId" element={<EditBlog />} />
              <Route path="blogs/new" element={<AddBlog />} />
            </Route>
            <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
              <Route path="users/edit/:id" element={<EditUser />} />
              <Route path="users/new" element={<NewUserForm />} />
              <Route path="users" element={<UsersList />} />
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
