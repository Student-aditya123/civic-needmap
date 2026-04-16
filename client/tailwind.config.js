/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          500: '#00A3FF',
          600: '#0077FF'
        }
      },
      boxShadow: {
        glow: '0 0 25px rgba(0, 163, 255, 0.25)'
      }
    }
  },
  plugins: []
};
