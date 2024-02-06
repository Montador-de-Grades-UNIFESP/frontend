/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'primary': '#1a202c',
        'secondary': '#2d3748',
        'cardbackground': '#385f73',
        'alertbackground': '#ece0fc',
        'alerttext': '#6c63ff',
        'stripe': '#f2f2f2',
      },
      fontFamily: {
        'sans': ['Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      borderWidth: {
        '1': '1px',
      },
      padding: {
        '1/2': '0.125rem',
        '1/3': '0.0833333333rem',
        '1/4': '0.0625rem',
      },
      letterSpacing: {
        'widerx': '0.0892857143rem',
        'widest2x': '.1666666667rem'
      },
      fontSize: {
        '2xs' : '0.75rem',
        'xs': '0.875rem',
        'sm': '0.9375rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.2rem',
        '2xl': '1.375rem',
      },
      screens: {
        'fullhd': '1920px',
        'quadhd': '2560px',
        'ultrahd': '3840px',
      },
      flex: {
        '0333': '0 0 33.333333%',
        '0666': '0 0 66.666667%',
        '0100': '0 0 100%',
      }
    },
  },
  plugins: [],
}