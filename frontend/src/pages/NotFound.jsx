import React from "react";
import { Link } from "react-router-dom";
import useDocumentTitle from "../utils/useDocumentTitle";

const NotFound = () => {
  useDocumentTitle("Page not found");
  return (
    <div className="animate-fade-up mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center text-center">
      <p className="bg-gradient-to-r from-primary-600 to-indigo-400 bg-clip-text text-8xl font-extrabold tracking-tight text-transparent sm:text-9xl">404</p>
      <h1 className="mt-4 text-2xl font-bold sm:text-3xl">This page took a sick day</h1>
      <p className="mt-2 text-ink-soft">The page you're looking for doesn't exist or has moved. Let's get you back to feeling better.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn-primary">Go home</Link>
        <Link to="/doctors" className="btn-outline !px-8 !py-3">Find a doctor</Link>
      </div>
    </div>
  );
};

export default NotFound;
