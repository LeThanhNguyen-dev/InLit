/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 18px 45px rgba(72, 73, 128, 0.12)",
      },
      colors: {
        vault: {
          ink: "#16183f",
          muted: "#667085",
          purple: "#6d5dfc",
          blue: "#2f80ed",
          mint: "#17b26a",
          amber: "#f79009",
          panel: "#ffffff",
          wash: "#f7f7ff",
        },
      },
    },
  },
  plugins: [],
};
