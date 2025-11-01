/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#ef4444' },
        accent: { DEFAULT: '#dc2626' },
        // Fondo principal casi negro
        dark: { DEFAULT: '#0b0b0e' },
        // Contenedores/ tarjetas gris muy oscuro
        grayish: { DEFAULT: '#131417' }
      }
    }
  },
  plugins: []
};
