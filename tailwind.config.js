/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{vue,js,ts}',
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.{vue,js,ts}',
    './pages/**/*.{vue,js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        red: {
          pizza: '#c0392b',
          dark:  '#922b21',
          light: '#e74c3c',
        },
        gold:   '#d4a017',
        dark: {
          DEFAULT: '#111111',
          2:       '#1c1c1c',
          3:       '#2a2a2a',
        },
        cream: {
          DEFAULT: '#fdf8f2',
          2:       '#f5ede0',
        },
        muted: '#777777',
        border: '#e8e0d5',
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        inter:    ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}


