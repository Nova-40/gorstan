// tailwind.config.js
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        handwriting: ['Caveat', 'cursive'],
        sans: ['Roboto', 'sans-serif'], // Added a sans-serif font for versatility
      },
      colors: {
        'ayla-yellow': '#f9d29d',
        'player-gray': '#d1d5db',
        'gorstan-blue': '#1e3a8a', // Added a custom blue color
        'danger-red': '#ef4444', // Added a custom red color for warnings
      },
      boxShadow: {
        'glow': '0 0 10px rgba(255, 255, 255, 0.5)', // Added a glowing shadow effect
      },
      spacing: {
        '128': '32rem', // Added custom spacing for large elements
        '144': '36rem',
      },
      borderRadius: {
        'xl': '1.5rem', // Added a larger border radius
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // Added Tailwind Forms plugin for better form styling
    require('@tailwindcss/typography'), // Added Typography plugin for rich text styling
  ],
};