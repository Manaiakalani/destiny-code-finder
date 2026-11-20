import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// JSX tags in HeroCanvas. Fiber registers these by passing the whole Three.js
// namespace to extend(), which keeps every export. These are the only ones.
const SKY_JSX = ["Group", "Mesh", "ShaderMaterial", "SphereGeometry", "Sprite", "SpriteMaterial"];

// Fiber imports `* as THREE`, which keeps every Three.js export. Bind only the
// names that file actually touches so the sky chunk can drop the rest.
function shakeThreeNamespace(): Plugin {
  const needle = "import * as THREE from 'three';";
  return {
    name: "shake-three-namespace",
    enforce: "pre",
    transform(code, id) {
      if (!id.includes("@react-three/fiber") || !code.includes(needle)) return null;
      const names = new Set<string>();
      for (const match of code.matchAll(/\bTHREE\.([A-Za-z_][A-Za-z0-9_]*)/g)) {
        names.add(match[1]);
      }
      // The canvas module passes the namespace object to extend() and never
      // reads THREE.Foo. A partial object still registers the sky's JSX.
      if (names.size === 0) {
        for (const name of SKY_JSX) names.add(name);
      }
      const list = [...names].sort();
      const binding = `import { ${list.join(", ")} } from 'three';\nconst THREE = { ${list.join(", ")} };`;
      return code.replace(needle, binding);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  base: "/destiny-code-finder/",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [shakeThreeNamespace(), react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  build: {
    target: "esnext",
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("react-dom") || id.includes("react-router-dom") || id.includes("node_modules/react/")) {
            return "react-vendor";
          }
          if (id.includes("@radix-ui")) {
            return "ui-vendor";
          }
        },
      },
    },
  },
});
