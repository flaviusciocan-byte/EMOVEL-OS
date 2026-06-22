import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        "os-bg": "#07070F",
        "os-surface": "#0C0C1A",
        "os-surface-2": "#11112A",
        ink: "#07070F",
        graphite: "#0C0C1A",
        blue: "#7C3AED",
        mint: "#40D9A3",
        cloud: "#11112A",
        line: "rgba(255,255,255,0.07)"
      },
      borderRadius: {
        emovel: "12px"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "SFMono-Regular", "Consolas", "monospace"]
      },
      boxShadow: {
        "os-glow": "0 0 32px rgba(124,58,237,0.35)",
        "os-glow-sm": "0 0 16px rgba(124,58,237,0.2)",
        "os-glow-lg": "0 0 60px rgba(124,58,237,0.4)"
      }
    }
  },
  plugins: []
};

export default config;
