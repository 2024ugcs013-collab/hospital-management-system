/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#effaf7',
          100: '#d9f4ec',
          200: '#b7eadc',
          300: '#7ed7bf',
          400: '#3dc59f',
          500: '#13a57f',
          600: '#0f8367',
          700: '#0e6753',
          800: '#0f5444',
          900: '#0e4538',
        },
        slate: {
          950: '#07111d',
        },
      },
      boxShadow: {
        glow: '0 24px 80px rgba(19, 165, 127, 0.18)',
      },
      backgroundImage: {
        'hero-grid': 'radial-gradient(circle at 1px 1px, rgba(148,163,184,0.16) 1px, transparent 0)',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
