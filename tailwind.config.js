/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // untuk semua file di folder src
    './pages/**/*.{js,jsx,ts,tsx}', // untuk Next.js default pages
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
