import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="flex flex-col bg-background px-8 py-4 ">
      <div className="flex items-center justify-between  border-b border-gray-300 pb-4">
        <Link
          to="/"
          className="text-2xl font-bold text-primary"
        >
          X-Stitch
        </Link>

        <div className="flex items-center gap-4">
          <span className="text-text">
            username
          </span>

          <Link
            to="/login"
            className="rounded-lg bg-secondary px-4 py-2 text-white hover:opacity-90"
          >
            Login
          </Link>
        </div>
      </div>

      <ul className="mt-4 flex gap-4">
        <li>
          <Link
            to="/generate"
            className="rounded-lg bg-primary px-5 py-2 text-white hover:opacity-90"
          >
            Generate
          </Link>
        </li>

        <li>
          <Link
            to="/mypatterns"
            className="rounded-lg bg-primary px-5 py-2 text-white hover:opacity-90"
          >
            My Patterns
          </Link>
        </li>

        <li>
          <Link
            to="/gallery"
            className="rounded-lg bg-primary px-5 py-2 text-white hover:opacity-90"
          >
            Gallery
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;