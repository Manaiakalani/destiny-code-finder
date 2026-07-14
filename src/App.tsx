import { Toaster } from "sonner";
import { HashRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useTheme } from "@/contexts/theme";

const AppRoutes = () => {
  const { sonnerTheme } = useTheme();

  return (
  <>
    <Toaster
      theme={sonnerTheme}
      position="bottom-right"
      toastOptions={{
        className: "border-border bg-popover text-popover-foreground",
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
};

const App = () => (
  <ThemeProvider>
    <AppRoutes />
  </ThemeProvider>
);

export default App;
