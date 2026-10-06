/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkPrimary: '#0b0f19',
        darkSecondary: '#111827',
        darkCard: '#1f2937'
      }
    },
  },
  plugins: [],
}
