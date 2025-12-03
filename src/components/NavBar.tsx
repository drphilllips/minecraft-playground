import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <div className="sticky top-0 z-50">
      <nav className="bg-slate-800 py-4 text-center">
        <Link to="/" className="mx-3 text-slate-200 hover:text-white">
          Home
        </Link>
        <Link to="/circle" className="mx-3 text-slate-200 hover:text-white">
          Circle
        </Link>
        <Link to="/dome" className="mx-3 text-slate-200 hover:text-white">
          Dome
        </Link>
        <Link to="/image" className="mx-3 text-slate-200 hover:text-white">
          Image
        </Link>
      </nav>
    </div>
  );
}