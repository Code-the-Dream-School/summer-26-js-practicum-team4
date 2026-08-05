import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import LogoutBtn from "../../features/auth/LogoutBtn";
import { useAuth } from "../../../state/auth/useAuth";

function Navbar() {
  const {
    state: { isAuthenticated, user },
  } = useAuth();
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

      {isAuthenticated ? (
        <div className="navbar-user">
          {user && <span className="username">{user.userName}</span>}
          <LogoutBtn />
        </div>
      ) : (
        <Link to="/login" className="login-btn">
          Login
        </Link>
      )}
    </nav>
  );
}

export default Navbar;
