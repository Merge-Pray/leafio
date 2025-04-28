import { Routes, Route } from "react-router";
import "./App.css";
import Header from "./components/Header/Header";
import Landingpage from "./pages/Landingpage/Landingpage";
import Login from "./pages/Login/Login";
import About from "./pages/About/About";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="login" element={<Login />} />
        <Route path="about" element={<About />} />
      </Routes>
    </>
  );
}

export default App;
