/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        green: {
          primary: '#1B3A2F',
          secondary: '#3E7A5C',
        },
        gold: {
          DEFAULT: '#B8975A',
          light: '#D4B483',
        },
        surface: {
          offwhite: '#F4F3EF',
          cream: '#F8F5EE',
          light: '#F6F5F1',
        },
        border: '#DDD5BF',
        positive: '#1B7A4A',
        negative: '#C0392B',
        warning: {
          red: '#A93226',
          bg: '#FDF0EE',
          border: '#E8B4AE',
        },
        text: {
          primary: '#1A1A1A',
          muted: '#5A5A5A',
        },
      },
      fontFamily: {
        assistant: ['Assistant', 'Arial Hebrew', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        card: '10px',
        table: '8px',
        pill: '20px',
      },
      boxShadow: {
        card: '0 2px 8px rgba(27,58,47,0.06)',
        metric: '0 4px 12px rgba(27,58,47,0.15)',
      },
    },
  },
  plugins: [],
}
