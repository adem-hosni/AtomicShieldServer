import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { usePageTitle } from "@/hooks/use-page-title";

const NotFound = () => {
  usePageTitle("Page Not Found");
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100">
      {/* Subtle background elements matching main page */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 opacity-30 blur-3xl"></div>
        <div className="absolute bottom-32 right-16 w-80 h-80 rounded-full bg-gradient-to-br from-purple-50 to-pink-100 opacity-25 blur-3xl"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-light text-neutral-800">404</h1>
          <p className="mt-4 text-lg text-neutral-600">Page not found</p>
          <Link
            to="/"
            className="mt-8 inline-block px-6 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors duration-200 font-medium"
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
