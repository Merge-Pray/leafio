import { Routes, Route } from "react-router";
import "./App.css";
import Landingpage from "./pages/Landingpage/Landingpage";
import Login from "./pages/Login/Login";
import About from "./pages/About/About";
import PlaceAd from "./pages/PlaceAd/PlaceAd";
import Register from "./pages/Register/Register";
import User from "./pages/User/User";
import Header from "./components/Header/Header";
// import Headermobile from "./components/Headermobile/Headermobile";

function App() {
  return (
    <>
      <Header />
      {/* <Headermobile /> */}
      <main>
        <Routes>
          <Route path="/" element={<Landingpage />} />
          <Route path="login" element={<Login />} />
          <Route path="placead" element={<PlaceAd />} />
          <Route path="about" element={<About />} />
          <Route path="/user/:userID" element={<User />} />
          <Route path="register" element={<Register />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
