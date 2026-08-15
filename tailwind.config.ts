import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "var(--border)",
        softora: {
          DEFAULT: "#0d9488",
          light: "#8ebcc4",
          deep: "#0f766e",
          soft: "#83b7c0",
        },
        primary: {
          DEFAULT: "#0d9488",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#f8fafc",
          foreground: "#64748b",
        },
        ink: {
          DEFAULT: "#0f172a",
          muted: "#64748b",
        },
        surface: "#f8fafc",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Space Grotesk", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Lora", "serif"],
        heading: ["var(--font-display)", "Space Grotesk", "sans-serif"],
      },
      boxShadow: {
        paper: "0 10px 30px -5px rgba(0, 0, 0, 0.1), 0 0 5px rgba(0, 0, 0, 0.05)",
        soft: "0 8px 30px rgb(0, 0, 0, 0.04)",
      },
      backgroundImage: {
        "softora-premium": "linear-gradient(to bottom right, #f0fdfa, #ffffff, #ecfeff)",
        "softora-text": "linear-gradient(to right, #0d9488, #14b8a6, #83b7c0)",
      },
    },
  },
  plugins: [],
};
export default config;
