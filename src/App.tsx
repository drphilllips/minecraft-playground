import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CirclePage from "./pages/CirclePage";
import DomePage from "./pages/DomePage";
import NavBar from "./components/NavBar";
import { ResponsiveDesignProvider } from "./contexts/ReponsiveDesignContext";

export default function App() {
  return (
    <ResponsiveDesignProvider>
      <Routing />
    </ResponsiveDesignProvider>
  );
}

function Routing() {
  return (
    <Router>
      <NavBar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/circle" element={<CirclePage />} />
        <Route path="/dome" element={<DomePage />} />
      </Routes>
    </Router>
  );
}