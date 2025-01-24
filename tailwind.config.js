/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{html,js}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      colors: {
        lightGray: '#C4C5C9',
        darkGray: '#242126',
        normalGray: '#969696',
        darkerBlue: '#202552',
        acidYellow: '#ffcd00',
        normalPurple: '#591BC5',
      },
    },
  },
  plugins: [],
}

