/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navbar: '#2B6CA3',
        "navbar-hover": '#003449' 
      },
      fontFamily: {
        'poppins': ['Poppins-ExtraLight', 'Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

