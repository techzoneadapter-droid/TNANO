import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: "#07183f",
        royal: "#0d3d91",
        gold: "#f6c85f",
        redcta: "#e21d2f",
      },
      boxShadow: {
        premium: "0 24px 80px rgba(7,24,63,.18)",
        glow: "0 0 32px rgba(246,200,95,.32)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
