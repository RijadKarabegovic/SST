/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    colors: {
      primary: "#00040f",
      secondary: "#00f6ff",
      White: "rgba(255, 255, 255, 0.7)",
      dimBlue: "rgba(9, 151, 124, 0.1)",
      dimBlack: "rgba(0,0,0)",
      danger:"red"
    },
    fontFamily: {
      poppins: ["Poppins", "sans-serif"],
    },
    extend: {
      borderRadius: {
        '4xl': '2rem',
      }
    },
    screens: {
      xs: "480px",
      ss: "620px",
      sm: "768px",
      md: "1060px",
      lg: "1200px",
      xl: "1700px",
    },
  },
  plugins: [],
};