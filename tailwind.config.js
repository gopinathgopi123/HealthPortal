/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-dark': '#0f1115',
        'bg-card': 'rgba(23, 27, 34, 0.8)',
        'border-color': 'rgba(255, 255, 255, 0.1)',
        'text-white': '#ffffff',
        'text-grey': '#94a3b8',
        'accent-blue': '#1D548B',
        'accent-teal': '#07A27D',
        'primary-teal': '#07A27D',
        'input-bg': 'rgba(15, 17, 21, 0.6)',
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(90deg, #07A27D 0%, #1D548B 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.4)',
        'premium': '0 4px 12px rgba(7, 162, 125, 0.3)',
      }
    },
  },
  plugins: [],
}
