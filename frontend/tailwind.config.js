/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#4da6ff',
          DEFAULT: '#0077e6',
          dark: '#004080',
        },
        secondary: {
          light: '#ffd699',
          DEFAULT: '#ffaa00',
          dark: '#b37400',
        },
      },
    },
  },
  plugins: [],
}