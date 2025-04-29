import { Routes, Route } from "react-router";
import "./App.css";
import Headermobile from "./components/Headermobile/Headermobile";
import Landingpage from "./pages/Landingpage/Landingpage";
import Login from "./pages/Login/Login";
import About from "./pages/About/About";

function App() {
  return (
    <>
      <Headermobile />
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="login" element={<Login />} />
        <Route path="about" element={<About />} />
      </Routes>
    </>
  );
}

export default App;
