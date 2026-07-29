import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-base-200">
      
      <h1 className="text-6xl font-bold text-primary">404</h1>
      
      <p className="text-xl mt-4">Oops! Page not found</p>
      
      <p className="text-gray-500 mt-2">
        The page you are looking for does not exist.
      </p>

      <div className="mt-6 flex gap-4">
        <Link to="/" className="btn btn-primary">
          Go Home
        </Link>

        <Link to="/login" className="btn btn-outline">
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default NotFound;