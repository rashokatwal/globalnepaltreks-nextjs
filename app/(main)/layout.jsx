import NavBar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export default function MainLayout({ children }) {

  return (
    <>
      <NavBar />
      {children}
      <Footer />
    </>
  );
}

