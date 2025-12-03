import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CirclePage from "./pages/CirclePage";
import DomePage from "./pages/DomePage";
import NavBar from "./components/NavBar";
import { ResponsiveDesignProvider } from "./contexts/ReponsiveDesignContext";
import ImagePage from "./pages/ImagePage";
import { useResponsiveDesign } from "./contexts/useResponsiveDesign";

export default function App() {
  return (
    <ResponsiveDesignProvider>
      <Routing />
    </ResponsiveDesignProvider>
  );
}

function Routing() {
  const { onMobile } = useResponsiveDesign()

  return (
    <Router>
      {!onMobile && <NavBar />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/circle" element={<CirclePage />} />
        <Route path="/dome" element={<DomePage />} />
        <Route path="/image" element={<ImagePage />} />
      </Routes>
    </Router>
  );
}