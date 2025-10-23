/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#ef4444' },
        accent: { DEFAULT: '#dc2626' },
        dark: { DEFAULT: '#111827' },
        grayish: { DEFAULT: '#1f2937' }
      }
    }
  },
  plugins: []
};

