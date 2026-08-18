import { Toaster } from "sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy, useEffect, useState } from "react";
import { MouseParticles } from "@/components/MouseParticles";
import { RouteErrorBoundary } from "@/components/RouteErrorBoundary";
import Index from "./pages/Index";

const basename = import.meta.env.BASE_URL;

const About = lazy(() => import("./pages/About"));
const Privacy = lazy(() => import("./pages/Privacy"));
const NotFound = lazy(() => import("./pages/NotFound"));

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
        <RouteErrorBoundary>
          <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><div className="orbit-loader" aria-hidden="true" /></div>}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </RouteErrorBoundary>
      </BrowserRouter>
    </>
  );
};

export default App;
