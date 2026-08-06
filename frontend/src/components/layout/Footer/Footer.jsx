// import { Link } from "react-router-dom";
import React from "react";

function Footer() {
  return (
    <footer className="grid grid-cols-[1fr_auto_1fr] items-center border-t border-gray-300 px-8 py-6 bg-footer-background text-text-secondary">
      <div className="justify-self-start">
        <p>X-Stitch</p>
      </div>

      <div className="justify-self-center">
        <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
      </div>

      <div className="justify-self-end flex gap-5">
        <a href="/privacy">Privacy</a>
        <a href="/terms">Terms</a>
        <a href="/help">Help</a>
      </div>
    </footer>
  );
}

export default Footer;
