import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="grid grid-cols-[1fr_auto_1fr] items-center border-t border-gray-300 bg-footer-background px-20 py-6 text-text-secondary">
      <div className="justify-self-start">
        <Link to="/">
                  <img
                    src="images/logo-g.png"
                    alt="X-Stitch Logo"
                    className="h-3 w-auto"
                  />
        </Link>
      </div>

      <div className="justify-self-center">
        <p>&copy; {new Date().getFullYear()}. All Rights Reserved.</p>
      </div>

      <div className="flex justify-self-end gap-5">
        <Link to="/privacy">Privacy</Link>
        <Link to="/terms">Terms</Link>
        <Link to="/help">Help</Link>
      </div>
    </footer>
  );
}

export default Footer;