import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 text-center py-20">
      <h1 className="text-5xl font-extrabold tracking-tight">Minecraft Playground</h1>
      <p className="mt-4 text-lg text-slate-300 max-w-xl mx-auto">
        Procedural tools and helpers for Minecraft builders.
      </p>

      <div className="mt-12 flex flex-col gap-4 items-center">
        <Link
          to="/circle"
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold"
        >
          Circle Generator
        </Link>
        <Link
          to="/dome"
          className="px-6 py-3 bg-green-600 hover:bg-green-500 rounded-lg font-semibold"
        >
          Dome Generator
        </Link>
      </div>
    </div>
  );
}