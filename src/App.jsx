import { Routes, Route } from "react-router";
import "./App.css";
import Landingpage from "./pages/Landingpage/Landingpage";
import Login from "./pages/Login/Login";
import About from "./pages/About/About";
import PlaceAd from "./pages/PlaceAd/PlaceAd";
import Register from "./pages/Register/Register";
import User from "./pages/User/User";
import Header from "./components/Header/Header";
import Footer_new from "./components/Footer_new/Footer_new";
import ProductPage from "./pages/ProductPage/ProductPage";
import Headermobile from "./components/Headermobile/Headermobile";
import { useEffect, useState } from "react";
import NotFound from "./pages/NotFound/NotFound";
import ProductNotFound from "./pages/ProductNotFound/ProductNotFound";
import ProductList from "./pages/ProductList/ProductList";
import EditAd from "./pages/EditAd/EditAd";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import Messages from "./pages/Messages/Messages";

function App() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 769px)");
    const handleChange = (e) => setIsDesktop(e.matches);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <>
      {" "}
      <ScrollToTop />
      {isDesktop ? <Header /> : <Headermobile />}
      <section className={`routercontent ${!isDesktop ? "mobile" : ""}`}>
        <Routes>
          <Route path="/" element={<Landingpage />} />
          <Route path="login" element={<Login />} />
          <Route path="placead" element={<PlaceAd />} />
          <Route path="about" element={<About />} />
          <Route path="/user/:userID" element={<User />} />
          <Route path="/user/:userID/messages" element={<Messages />} />
          <Route path="register" element={<Register />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/category/:category" element={<ProductList />} />
          <Route path="/products" element={<ProductList />} />
          <Route
            path="/product/productnotfound"
            element={<ProductNotFound />}
          />
          <Route path="*" element={<NotFound />} />
          <Route path="/editad/:adID" element={<EditAd />} />
        </Routes>
      </section>
      <Footer_new />
    </>
  );
}

export default App;
