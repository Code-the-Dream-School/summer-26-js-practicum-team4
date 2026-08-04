import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">X-Stitch</Link>
      </div>

      <ul className="navbar-menu">
        <li>
          <Link to="/generate">Generate</Link>
        </li>
        <li>
          <Link to="/mypatterns">My Patterns</Link>
        </li>
        <li>
          <Link to="/gallery">Gallery</Link>
        </li>
      </ul>

      <div className="navbar-user">
        <span className="username">username</span>
        <Link to="/login" className="login-btn">
          Login
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
