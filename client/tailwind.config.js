/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#006D77",
        secondary: "#83C5BE",
        background: "#EDF6F9",
        accent: "#E29578",
        highlight: "#FFDDD2",
      },
      fontFamily: {
        heading: ['"Playfair Display"', "serif"],
        body: ['Lato', "sans-serif"],
      },
    },
  },
  plugins: [],
}