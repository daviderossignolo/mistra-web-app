/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navbar: '#2B6CA3',
        "navbar-hover": '#003449',
        "services-hover": '#ACF1BD',
        "contact-bg": '#E0E6E8',
      },
      fontFamily: {
        'poppins': ['Poppins-ExtraLight', 'Poppins', 'sans-serif'],
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

