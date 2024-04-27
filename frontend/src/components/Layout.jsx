import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export const Layout = () => {
  return (
    <>
      <Header />
      <main className="mt-[7rem] min-h-full">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
