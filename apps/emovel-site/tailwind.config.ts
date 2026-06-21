import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#101114",
        graphite: "#20242B",
        blue: { DEFAULT: "#2F6BFF", hover: "#1A55E8" },
        mint: "#40D9A3",
        cloud: "#F5F7FA",
        line: "#D9DEE7",
      },
      fontFamily: {
        heading: ["var(--font-inter-tight)", "Inter", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "IBM Plex Mono", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        tighter: "-0.03em",
        tight: "-0.02em",
      },
    },
  },
  plugins: [],
};

export default config;
