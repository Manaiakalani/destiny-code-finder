import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Older builds used HashRouter (#/about). Send those bookmarks to real paths
// before React Router initialises, so /about and /privacy stay crawlable.
const hashPath = window.location.hash;
if (hashPath.startsWith("#/")) {
  const next = `${import.meta.env.BASE_URL.replace(/\/$/, "")}${hashPath.slice(1)}${window.location.search}`;
  window.history.replaceState(null, "", next);
}

createRoot(document.getElementById("root")!).render(<App />);
