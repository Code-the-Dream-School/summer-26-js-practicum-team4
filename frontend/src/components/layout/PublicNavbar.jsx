import React from "react";
import { Link } from "react-router-dom";

function PublicNavbar() {
  return (
    <nav className="flex flex-col px-20 py-6 ">
      <div className="flex items-center justify-between  border-b border-gray-300 pb-4">
        <Link to="/" className="text-2xl font-bold text-primary">
          <img
            src="images/logo.png"
            alt="X-Stitch Logo"
            className="h-5 w-auto"
          />
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="rounded-lg bg-secondary px-10 py-2 text-white hover:opacity-90"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default PublicNavbar;
