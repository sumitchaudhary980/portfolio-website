/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./sections/**/*.{js,jsx}",
    "./data/**/*.{js,jsx}",
    "./hooks/**/*.{js,jsx}",
    "./utils/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0B0B0F",
        violet: "#7C3AED",
        cyan: "#06B6D4",
        green: "#22C55E"
      },
      fontFamily: {
        sans: ["var(--font-sora)", "Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 50px rgba(124, 58, 237, 0.28)",
        cyan: "0 0 42px rgba(6, 182, 212, 0.22)"
      },
      backgroundImage: {
        "radial-grid": "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.12) 1px, transparent 0)"
      }
    }
  },
  plugins: []
};
