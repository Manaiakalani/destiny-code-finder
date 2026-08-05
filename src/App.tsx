import { Toaster } from "sonner";
import { HashRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { MouseParticles } from "@/components/MouseParticles";
import Index from "./pages/Index";

const About = lazy(() => import("./pages/About"));
const Privacy = lazy(() => import("./pages/Privacy"));
const NotFound = lazy(() => import("./pages/NotFound"));

const App = () => (
  <>
    <MouseParticles />
    <Toaster
      theme="dark"
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

export default App;
