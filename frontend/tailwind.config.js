/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0f0e0d",
        accent: "#e8a045", // warm amber/gold
        nature: "#7a9e7e", // muted sage green
        card: "rgba(25, 24, 23, 0.7)", // dark frosted glass base
      },
      fontFamily: {
        heading: ["Playfair Display", "serif"],
        body: ["DM Sans", "sans-serif"],
      },
      boxShadow: {
        'glow': '0 0 15px rgba(232, 160, 69, 0.3)',
      }
    },
  },
  plugins: [],
}
