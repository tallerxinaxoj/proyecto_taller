/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ff4d4f',
        accent: '#22d3ee',
        highlight: '#f59e0b',
        dark: '#0b0b0e',
        grayish: '#1a1c20'
      }
    }
  },
  plugins: [],
};
