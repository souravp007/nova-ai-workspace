import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#101419",
        mist: "#f5f7fb",
        line: "#dfe5ed",
        brand: {
          50: "#eef9ff",
          100: "#d8f0ff",
          500: "#1688d2",
          600: "#096aa8",
          700: "#075485",
        },
        coral: "#fb6b5b",
        moss: "#3b8468",
        amber: "#f0ad37",
      },
      boxShadow: {
        soft: "0 18px 60px rgba(16, 20, 25, 0.12)",
        glow: "0 18px 60px rgba(22, 136, 210, 0.22)",
      },
      keyframes: {
        floatIn: {
          "0%": { opacity: "0", transform: "translateY(14px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        pulseBeam: {
          "0%, 100%": { opacity: "0.45", transform: "translateX(-20%)" },
          "50%": { opacity: "0.95", transform: "translateX(20%)" },
        },
      },
      animation: {
        floatIn: "floatIn 520ms ease-out both",
        pulseBeam: "pulseBeam 5s ease-in-out infinite",
      },
    },
  },
  plugins: [typography],
};
