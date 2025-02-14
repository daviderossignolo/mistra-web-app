/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navbar: '#2B6CA3',
        "navbar-hover": '#003449',
        "navbar-hover-light": '#2B6CA3',
        "services-hover": '#ACF1BD',
        "contact-bg": '#E0E6E8',
      },
      fontFamily: {
        'accessible-font': ['Tahoma', 'Calibri', 'Helvetica', 'Arial', 'Verdana', 'Times New Roman', 'sans-serif'],
        'sans': ['Tahoma', 'Calibri', 'Helvetica', 'Arial', 'Verdana', 'Times New Roman', 'sans-serif'], 
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' }
        }
      },
      animation: {
        'scroll': 'scroll 15s linear infinite'
      }
    },
  },
  plugins: [],
}
