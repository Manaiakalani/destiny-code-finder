import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error('404: route not found', location.pathname);
  }, [location.pathname]);

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <p className="font-mono text-sm text-accent">404 / ARCHIVE MISS</p>
        <h1 className="mt-3 text-3xl font-semibold text-foreground">Page not found</h1>
        <p className="mt-3 text-muted-foreground">
          This route is not in the Code Vault catalogue.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex min-h-11 items-center rounded-md bg-accent px-4 text-sm font-semibold text-accent-foreground hover:bg-accent/90"
        >
          Return to Code Vault
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
