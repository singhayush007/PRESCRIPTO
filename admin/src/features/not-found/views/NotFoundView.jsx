import React from "react";
import { Link } from "react-router-dom";
import useDocumentTitle from "@/shared/hooks/useDocumentTitle";

const NotFoundView = () => {
  useDocumentTitle("Page not found");
  return (
    <div className="mx-auto flex min-h-[55vh] max-w-md flex-col items-center justify-center text-center">
      <p className="bg-gradient-to-r from-primary-600 to-indigo-400 bg-clip-text text-8xl font-extrabold text-transparent">
        404
      </p>
      <h1 className="mt-3 text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-ink-soft">This page doesn't exist in the panel.</p>
      <Link to="/" className="btn-primary mt-6">
        Back to dashboard
      </Link>
    </div>
  );
};

export default NotFoundView;
