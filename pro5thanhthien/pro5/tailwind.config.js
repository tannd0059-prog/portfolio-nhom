/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        uth: {
          blue: '#005BAA',
          cyan: '#00F2FE',
          navy: '#002B49',
          light: '#E0F2FE',
        },
        dark: {
          DEFAULT: '#0B0C10',
          bg: '#0B0C10',
          surface: '#111318',
          card: 'rgba(17, 19, 24, 0.85)',
          border: 'rgba(255, 255, 255, 0.08)',
        },
        accent: {
          purple: '#8B5CF6',
          violet: '#7C3AED',
          cyan: '#00F2FE',
          blue: '#005BAA',
        },
        cyber: {
          teal: '#66FCF1',
          cyan: '#45A29E',
          gray: '#C5C6C7',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'marquee-left': 'marqueeLeft 30s linear infinite',
        'marquee-right': 'marqueeRight 30s linear infinite',
        'float': 'float 5s ease-in-out infinite',
      },
      keyframes: {
        marqueeLeft: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        marqueeRight: {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
