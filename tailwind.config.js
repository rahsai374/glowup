/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#E07856',
        'primary-light': '#F2A68D',
        cream: '#FFF5EE',
        'body-bg': '#F0E6DF',
        brown: '#2D1810',
        accent: '#D4A574',
      },
      fontFamily: {
        serif: ['Fraunces_700Bold'],
        'serif-italic': ['Fraunces_700Bold_Italic'],
        sans: ['PlusJakartaSans_400Regular'],
        'sans-medium': ['PlusJakartaSans_500Medium'],
        'sans-semibold': ['PlusJakartaSans_600SemiBold'],
        'sans-bold': ['PlusJakartaSans_700Bold'],
        hindi: ['Hind_400Regular'],
        'hindi-medium': ['Hind_500Medium'],
        'hindi-semibold': ['Hind_600SemiBold'],
      },
    },
  },
  plugins: [],
};
