/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2B4F81',
        secondary: '#4A90E2',
        'gov-header': '#222222',
        'inep-header': '#044785',
        'encceja': '#3b5998',
        'encceja-light': '#a0a0a0',
        'form-header': '#2c5985',
        'form-footer': '#5d85ab',
        'footer-bg': '#1c2b39',
      },
    },
  },
  plugins: [],
} 