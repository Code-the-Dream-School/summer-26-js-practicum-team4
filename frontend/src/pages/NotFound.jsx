import React from "react";
import { useNavigate, Link } from "react-router-dom";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-1 flex-col items-center justify-center">
      <p className="text-center text-primary text-5xl">
        <span className="text-secondary">404</span> Page Not Found
      </p>
      <div className="flex items-center justify-center mt-10 ">
        <button
          onClick={() => navigate(-1)}
          className="rounded-lg mr-10 w-40 bg-secondary py-2 px-4 text-white transition hover:opacity-90"
        >
          Go Back
        </button>
        <Link
          to="/"
          className="rounded-lg w-40 bg-secondary px-4 py-2 text-white transition hover:opacity-90 text-center"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
