/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [
    plugin(function({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          /* IE and Edge */
          '-ms-overflow-style': 'none',
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        },
        '.scrollbar-default': {
          /* IE and Edge */
          '-ms-overflow-style': 'auto',
          /* Firefox */
          'scrollbar-width': 'auto',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'block',
            width: '8px',
            height: '8px'
          },
          '&::-webkit-scrollbar-track': {
            'background-color': '#f1f1f1',
            'border-radius': '4px'
          },
          '&::-webkit-scrollbar-thumb': {
            'background-color': '#888',
            'border-radius': '4px'
          },
          '&::-webkit-scrollbar-thumb:hover': {
            'background-color': '#555'
          }
        }
      })
    })
  ],
} 