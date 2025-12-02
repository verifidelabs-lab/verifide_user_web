/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,css,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        nunito: ["'Nunito Sans'", "sans-serif"], // Adding the custom font
      },
      keyframes: {
        floatIn: {
          '0%': { opacity: 0, transform: 'translateY(20px) scale(0.95)' },
          '100%': { opacity: 1, transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        floatIn: 'floatIn 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
};