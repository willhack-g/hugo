/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './layouts/**/*.html',
    './content/**/*.md',
    './themes/blowfish/layouts/**/*.html'
  ],
  safelist: [
    'prose',
    'dark',
    /^(sm|md|lg):/, // Tylko główne breakpointy
    /^(hover|focus):/
  ],
  theme: {
    screens: {  
      'sm': '640px',
      'md': '768px',
      'lg': '1024px'
    },
    extend: {
      colors: {
        neutral: {
          100: 'rgb(243 244 246)',
          200: 'rgb(229 231 235)',
          300: 'rgb(209 213 219)',
          700: 'rgb(55 65 81)',
          800: 'rgb(31 41 55)'
        },
        primary: {
          400: 'rgb(96 165 250)',
          600: 'rgb(37 99 235)'
        }
      }
    }
  },
  variants: {
    extend: {
      backgroundColor: ['dark', 'hover'],
      textColor: ['dark', 'hover'],
      opacity: ['group-hover']
    }
  },
  plugins: []
}