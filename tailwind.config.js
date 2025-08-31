/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'rgb(var(--bg) / <alpha-value>)',
        text: 'rgb(var(--text) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        brand: {
          1: 'rgb(var(--brand-1) / <alpha-value>)',
          2: 'rgb(var(--brand-2) / <alpha-value>)',
          3: 'rgb(var(--brand-3) / <alpha-value>)',
          4: 'rgb(var(--brand-4) / <alpha-value>)',
        },
      },
      boxShadow: {
        glow: '0 0 0 2px rgba(255,255,255,0.06), 0 10px 30px rgba(2,6,23,0.2)',
      },
      borderColor: {
        subtle: 'rgba(var(--border), 0.08)',
      },
    },
  },
  plugins: [],
}
