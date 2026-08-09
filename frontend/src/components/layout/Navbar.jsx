import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="flex flex-col bg-background px-20 py-6 ">
      <div className="flex items-center justify-between  border-b border-gray-300 pb-4">
        <Link to="/" className="text-2xl font-bold text-primary">
          <img
            src="images/logo.png"
            alt="X-Stitch Logo"
            className="h-5 w-auto"
          />
        </Link>

        <div className="flex items-center gap-4">
          <span className="text-text">username</span>

          <Link
            to="/logout"
            className="rounded-lg bg-secondary px-10 py-2 text-white hover:opacity-90"
          >
            Logout
          </Link>
        </div>
      </div>

      <ul className="mt-6 flex gap-4">
        <li>
          <Link
            to="/generate"
            className="rounded-lg bg-primary px-8 py-3 text-white hover:opacity-90"
          >
            Generate
          </Link>
        </li>

        <li>
          <Link
            to="/gallery"
            className="rounded-lg bg-primary px-8 py-3 text-white hover:opacity-90"
          >
            Gallery
          </Link>
        </li>

        <li>
          <Link
            to="/mypatterns"
            className="rounded-lg bg-primary px-6 py-3 text-white hover:opacity-90"
          >
            My Patterns
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
