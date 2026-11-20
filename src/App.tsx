import { Toaster } from "sonner";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Suspense, lazy, useEffect, useLayoutEffect, useState, type ReactNode } from "react";
import { MouseParticles } from "@/components/MouseParticles";
import { RouteErrorBoundary } from "@/components/RouteErrorBoundary";
import Index from "./pages/Index";

const basename = import.meta.env.BASE_URL;

const About = lazy(() => import("./pages/About"));
const Privacy = lazy(() => import("./pages/Privacy"));
const NotFound = lazy(() => import("./pages/NotFound"));

function RouteFallback() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen items-center justify-center">
        <div className="orbit-loader" aria-hidden="true" />
      </div>
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  // A footer click keeps the catalogue's scroll offset, so the next page
  // opened under the sticky header instead of at its title.
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function PrefetchRoutes({ children }: { children: ReactNode }) {
  useEffect(() => {
    void import("./pages/About");
    void import("./pages/Privacy");
    void import("./pages/NotFound");
  }, []);
  return children;
}

function useToasterTheme(): "light" | "dark" {
  const [isLight, setIsLight] = useState(
    () => typeof document !== "undefined" && document.documentElement.classList.contains("light-mode")
  );

  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setIsLight(root.classList.contains("light-mode"));

    // ThemeToggle is a descendant, so its effect applies the stored theme
    // before this one runs; sync once to catch that initial class.
    sync();

    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return isLight ? "light" : "dark";
}

const App = () => {
  const toasterTheme = useToasterTheme();

  return (
    <>
      <MouseParticles />
      <Toaster
        theme={toasterTheme}
        position="bottom-right"
        toastOptions={{
          className: "glass-card border-border/50",
        }}
      />
      <BrowserRouter basename={basename}>
        <ScrollToTop />
        <RouteErrorBoundary>
          <PrefetchRoutes>
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </PrefetchRoutes>
        </RouteErrorBoundary>
      </BrowserRouter>
    </>
  );
};

export default App;
