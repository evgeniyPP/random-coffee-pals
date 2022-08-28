/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: [{ pattern: /^(w|h)-\d$/ }],
  darkMode: 'class',
  theme: {
    extend: {}
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwindcss-themer')({
      defaultTheme: {
        extend: {
          colors: {
            'primary-300': 'rgb(253 224 71)',
            'primary-400': 'rgb(250 204 21)',
            'primary-500': 'rgb(234 179 8)',
            'primary-600': 'rgb(202 138 4)',
            'primary-700': 'rgb(161 98 7)',
            'primary-800': 'rgb(133 77 14)'
          }
        }
      },
      themes: [
        {
          name: 'theme-tea',
          extend: {
            colors: {
              'primary-300': 'rgb(134 239 172)',
              'primary-400': 'rgb(74 222 128)',
              'primary-500': 'rgb(34 197 94)',
              'primary-600': 'rgb(22 163 74)',
              'primary-700': 'rgb(21 128 61)',
              'primary-800': 'rgb(22 101 52)'
            }
          }
        }
      ]
    })
  ]
};
