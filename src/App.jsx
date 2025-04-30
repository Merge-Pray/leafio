import { Routes, Route } from "react-router";
import "./App.css";
import Header from "./components/Header/Header";
import Landingpage from "./pages/Landingpage/Landingpage";
import Login from "./pages/Login/Login";
import About from "./pages/About/About";
import PlaceAd from "./pages/PlaceAd/PlaceAd";
import Register from "./pages/Register/Register";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="login" element={<Login />} />
        <Route path="placead" element={<PlaceAd/>}/>
        <Route path="about" element={<About />} />
        <Route path="register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
