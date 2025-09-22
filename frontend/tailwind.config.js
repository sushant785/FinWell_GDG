/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class", // enables dark mode toggling via 'dark' class
  theme: {
    extend: {
      colors: {
        primary: "#135bec",            // blue accent
        "background-light": "#0F172A", // dark black/blueish
        "background-dark": "#0A0F1A",  // darker background for dark mode
      },
      fontFamily: {
        display: ["Manrope"],          // your font
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
    },
  },
  plugins: [],
};
