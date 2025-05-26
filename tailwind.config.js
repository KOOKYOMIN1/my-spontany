// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'animate-fade-in',
    'bg-gradient-to-br',
    'from-pink-50',
    'to-yellow-50',
    'border-pink-200',
    'rounded-2xl',
    'shadow-md',
    'hover:shadow-lg',
    'font-serif',
    'italic'
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.9s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      fontFamily: {
        sans: ['"Noto Sans KR"', 'sans-serif'],
        serif: ['"Nanum Myeongjo"', 'serif'],
      },
      colors: {
        'soft-yellow': '#fefcea',
        'sun-glow': '#f1da36',
        'theme-pink': '#ffe3ec',
        'theme-border': '#ffc1d1',
      },
    },
  },
  plugins: [],
};