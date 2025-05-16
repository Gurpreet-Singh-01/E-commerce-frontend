/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#000000', 
        secondary: '#FFFFFF',
        gray: '#4B5563', 
    },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'], 
      },
      fontSize: {
        responsive: 'clamp(1rem, 2vw, 1.25rem)', 
      },
    },
  },
  plugins: [],
}