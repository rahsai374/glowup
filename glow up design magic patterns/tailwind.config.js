
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: 'rgb(var(--color-bg) / <alpha-value>)',
          primary: 'rgb(var(--color-primary) / <alpha-value>)',
          'primary-light': 'rgb(var(--color-primary-light) / <alpha-value>)',
          text: 'rgb(var(--color-text) / <alpha-value>)',
          accent: 'rgb(var(--color-accent) / <alpha-value>)',
          surface: 'rgb(var(--color-surface) / <alpha-value>)',
        },
        severity: {
          mild: '#4ADE80',
          moderate: '#FACC15',
          attention: '#FB923C',
          severe: '#F87171',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Hind"', 'sans-serif'],
        serif: ['"Fraunces"', 'serif'],
        hindi: ['"Hind"', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 10px 40px -10px rgba(45,24,16,0.08)',
        'card': '0 4px 20px -2px rgba(45,24,16,0.05)',
      }
    },
  },
  plugins: [],
}
