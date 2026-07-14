import { Toaster } from "sonner";
import { HashRouter, Routes, Route } from "react-router-dom";
import { MouseParticles } from "@/components/MouseParticles";
import Index from "./pages/Index";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";

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
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  </>
);

export default App;
