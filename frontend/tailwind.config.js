/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        mist: "#f3f4f6",
        coral: "#f97316",
        ocean: "#0f766e",
      },
      boxShadow: {
        soft: "0 20px 45px -25px rgba(17, 24, 39, 0.35)",
      },
    },
  },
  plugins: [],
};
