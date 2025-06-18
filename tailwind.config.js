/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['monospace', 'sans-serif'],
      },
      colors: {
        primary: '#F7CE5B',
      },
    },
  },
  plugins: [],
}
