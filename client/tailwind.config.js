/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // enables dark mode via class strategy
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
        heading: ['Be Vietnam Pro', 'sans-serif'],
        body: ['Lato', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      container: {
        center: true,
        padding: '1rem',
      },
    },
    screens: {
      xs: '480px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    // require('@tailwindcss/forms'),
  ],
}
