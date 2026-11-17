import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div>
        <h1 className="mb-3">404</h1>
        <p className="mb-4 text-muted-foreground">Oops! Page not found</p>
        <Link to="/" className="underline underline-offset-4">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
