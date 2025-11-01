// tailwind.config.js
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      container: { center: true, padding: '1rem' },
      colors: {
        brand: {
          DEFAULT: '#2563eb', // azul base
          600: '#2563eb',
          700: '#1d4ed8',
          dark: '#1e3a8a',    // variação p/ dark
        },
      },
    },
  },
  plugins: [],
}
