// import { Link } from "react-router-dom";
import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <p>X-Stitch</p>
      </div>

      <div className="footer-copy">
        <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
      </div>

      <div className="footer-links">
        <a href="/privacy">Privacy</a>
        <a href="/terms">Terms</a>
        <a href="/help">Help</a>
      </div>
    </footer>
  );
}

export default Footer;