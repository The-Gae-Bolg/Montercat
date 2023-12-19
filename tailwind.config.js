/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'hero-pattern': "url('../images/background-tile.webp')",
        'hero-image': "url('../images/1024.webp')",
      },
      screens: {
        '1xl': '1440px',
      },
      fontFamily: {
        'Montserrat': ['Montserrat', 'sans-serif'],
        'Monument': ['Monument Extended', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

