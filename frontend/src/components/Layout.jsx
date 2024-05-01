import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export const Layout = () => {
  return (
    <>
      <div className="flex flex-col justify-between min-h-[100vh]">
        <Header />
        <div className="mb-2">
          <Outlet />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
