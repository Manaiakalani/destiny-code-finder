import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Subclass colors
        arc: {
          DEFAULT: "hsl(var(--arc))",
          foreground: "hsl(var(--arc-foreground))",
        },
        solar: {
          DEFAULT: "hsl(var(--solar))",
          secondary: "hsl(var(--solar-secondary))",
          accent: "hsl(var(--solar-accent))",
        },
        stasis: {
          DEFAULT: "hsl(var(--stasis))",
          secondary: "hsl(var(--stasis-secondary))",
          accent: "hsl(var(--stasis-accent))",
        },
        strand: {
          DEFAULT: "hsl(var(--strand))",
          secondary: "hsl(var(--strand-secondary))",
          accent: "hsl(var(--strand-accent))",
        },
      },
      fontFamily: {
        heading: ['Orbitron', 'sans-serif'],
        body: ['Rajdhani', 'sans-serif'],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      spacing: {
        // 8px grid system
        '18': '4.5rem',
        '22': '5.5rem',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        // VOID motion (300-450ms)
        "void-materialize": {
          "0%": { opacity: "0", transform: "scale(0.95)", filter: "blur(8px)" },
          "100%": { opacity: "1", transform: "scale(1)", filter: "blur(0)" },
        },
        "void-fade": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        // ARC motion (120-180ms, snap)
        "arc-pulse": {
          "0%, 100%": { boxShadow: "0 0 15px hsl(var(--arc) / 0.3)" },
          "50%": { boxShadow: "0 0 30px hsl(var(--arc) / 0.6)" },
        },
        "arc-snap": {
          "0%": { transform: "scale(0.98)", opacity: "0.8" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        // SOLAR motion (250-350ms)
        "solar-bloom": {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "50%": { boxShadow: "0 0 40px hsl(var(--solar) / 0.4)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "solar-flare": {
          "0%, 100%": { boxShadow: "0 0 20px hsl(var(--solar) / 0.3)" },
          "50%": { boxShadow: "0 0 40px hsl(var(--solar) / 0.5)" },
        },
        // STASIS motion (200-300ms, linear)
        "stasis-freeze": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.01)" },
          "100%": { transform: "scale(1)", filter: "saturate(0.8)" },
        },
        // STRAND motion (250-400ms, spring)
        "strand-tether": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "60%": { transform: "translateY(-2px)" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        // General
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          from: { opacity: "0", transform: "translateX(-10px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px hsl(var(--accent) / 0.3)" },
          "50%": { boxShadow: "0 0 35px hsl(var(--accent) / 0.5)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        // VOID timing
        "void-materialize": "void-materialize 0.4s ease-in-out",
        "void-fade": "void-fade 0.35s ease-in-out",
        // ARC timing (fast, snappy)
        "arc-pulse": "arc-pulse 1.5s ease-out infinite",
        "arc-snap": "arc-snap 0.15s ease-out",
        // SOLAR timing
        "solar-bloom": "solar-bloom 0.3s ease-in-out",
        "solar-flare": "solar-flare 2s ease-in-out infinite",
        // STASIS timing
        "stasis-freeze": "stasis-freeze 0.25s linear",
        // STRAND timing (spring)
        "strand-tether": "strand-tether 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
        // General
        "fade-in": "fade-in 0.4s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "float": "float 5s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;