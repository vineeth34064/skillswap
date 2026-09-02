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
        bg: {
          primary: '#05070A',
          secondary: '#080C11',
          elevated: '#0D1219',
        },
        champagne: {
          400: '#E5C784',
          500: '#D6B36A',
          600: '#B89248',
        },
        violetAccent: {
          400: '#A89CFF',
          500: '#8B7CFF',
          600: '#6E5CE6',
        },
        iceBlue: {
          400: '#94D5FF',
          500: '#72C7FF',
          600: '#4AB2F0',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#05070A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Geist', 'Outfit', 'sans-serif'],
        display: ['Outfit', 'Space Grotesk', 'Inter', 'sans-serif'],
        mono: ['Space Grotesk', 'Geist', 'monospace'],
      },
      boxShadow: {
        'glow': '0 0 35px rgba(139, 124, 255, 0.18)',
        'gold-glow': '0 0 35px rgba(214, 179, 106, 0.22)',
        'blue-glow': '0 0 35px rgba(114, 199, 255, 0.18)',
        'liquid': '0 30px 80px rgba(0, 0, 0, 0.38), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        'neomorphic-tactile': 'inset 1px 1px 2px rgba(255,255,255,0.06), inset -1px -1px 3px rgba(0,0,0,0.5), 3px 5px 12px rgba(0,0,0,0.3)',
        'neomorphic-pressed': 'inset 2px 2px 4px rgba(0,0,0,0.6), inset -1px -1px 2px rgba(255,255,255,0.05)',
      },
      animation: {
        'ambient-slow': 'ambient 30s ease-in-out infinite alternate',
        'orbit-slow': 'orbit 20s linear infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-delayed': 'float 7s ease-in-out infinite 2s',
      },
      keyframes: {
        ambient: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '50%': { transform: 'translate(30px, -20px) scale(1.05)' },
          '100%': { transform: 'translate(-20px, 15px) scale(0.95)' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(48px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(48px) rotate(-360deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
