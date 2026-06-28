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
        "os-bg": "#05020A",
        "os-surface": "rgba(255,255,255,0.04)",
        "os-card": "rgba(18,10,32,0.75)",
        "os-violet": "#8B5CF6",
        "os-violet-e": "#A855F7",
        "os-violet-dim": "#4C1D95",
        ink: "#05020A",
        graphite: "#0A0A1A",
        blue: "#8B5CF6",
        mint: "#40D9A3",
        cloud: "#0F0F22",
        line: "rgba(255,255,255,0.08)"
      },
      borderRadius: {
        emovel: "12px",
        "emovel-lg": "20px",
        "emovel-xl": "28px",
        prompt: "28px"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "SFMono-Regular", "Consolas", "monospace"]
      },
      boxShadow: {
        "os-glow": "0 0 32px rgba(139,92,246,0.4)",
        "os-glow-sm": "0 0 16px rgba(139,92,246,0.25)",
        "os-glow-lg": "0 0 64px rgba(139,92,246,0.5)",
        "os-glow-xl": "0 0 120px rgba(139,92,246,0.6)",
        "prompt-idle": "0 0 0 1px rgba(139,92,246,0.2), 0 0 48px rgba(139,92,246,0.18), inset 0 0 48px rgba(139,92,246,0.04)",
        "prompt-active": "0 0 0 1px rgba(168,85,247,0.5), 0 0 80px rgba(139,92,246,0.4), 0 0 160px rgba(168,85,247,0.18), inset 0 0 60px rgba(139,92,246,0.06)",
        glass: "0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(139,92,246,0.08)",
        "cc-dropdown": "0 20px 60px rgba(0,0,0,0.75), 0 0 0 1px rgba(139,92,246,0.1), inset 0 1px 0 rgba(255,255,255,0.04)"
      },
      animation: {
        "ambient-drift": "ambient-drift 12s ease-in-out infinite",
        "fade-up": "fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both",
        "fade-in": "fade-in 0.5s ease-out both",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "card-in": "card-in 0.5s cubic-bezier(0.22,1,0.36,1) both",
        "progress-fill": "progress-fill 2s ease-out forwards"
      },
      keyframes: {
        "ambient-drift": {
          "0%, 100%": { transform: "scale(1) translateY(0px)", opacity: "0.7" },
          "50%": { transform: "scale(1.08) translateY(-12px)", opacity: "0.9" }
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" }
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" }
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 22px rgba(139,92,246,0.4), 0 0 60px rgba(139,92,246,0.18)" },
          "50%": { boxShadow: "0 0 32px rgba(168,85,247,0.6), 0 0 80px rgba(139,92,246,0.28)" }
        },
        "card-in": {
          from: { opacity: "0", transform: "translateY(16px) scale(0.97)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" }
        },
        "progress-fill": {
          from: { width: "0%" },
          to: { width: "100%" }
        }
      }
    }
  },
  plugins: []
};

export default config;
