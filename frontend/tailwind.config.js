/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'eco-light': '#f8f9fa',
        'eco-green': '#14532d',
        'eco-emerald': '#10b981',
        'eco-amber': '#f59e0b',
        'eco-red': '#ef4444',
        'eco-dark': '#1c1917',
      }
    },
  },
  plugins: [],
}
