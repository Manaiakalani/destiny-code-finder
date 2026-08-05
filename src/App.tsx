import { Toaster } from "sonner";
import { HashRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy, useEffect, useState } from "react";
import { MouseParticles } from "@/components/MouseParticles";
import Index from "./pages/Index";

const About = lazy(() => import("./pages/About"));
const Privacy = lazy(() => import("./pages/Privacy"));
const NotFound = lazy(() => import("./pages/NotFound"));

function useToasterTheme(): "light" | "dark" {
  const [isLight, setIsLight] = useState(
    () => typeof document !== "undefined" && document.documentElement.classList.contains("light-mode")
  );

  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      setIsLight(root.classList.contains("light-mode"));
    });

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
      <HashRouter>
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><div className="orbit-loader" /></div>}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </HashRouter>
    </>
  );
};

export default App;
