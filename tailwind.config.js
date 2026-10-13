/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'Cambria', '"Times New Roman"', 'serif'],
        reading: ['Lora', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Fira Code', 'monospace'],
      },
      colors: {
        editorial: {
          50: '#f8f8f7',
          100: '#efefec',
          200: '#dfded9',
          300: '#cac7c0',
          400: '#9d998d',
          500: '#757165',
          600: '#5a564c',
          700: '#45423a',
          800: '#322f29',
          900: '#1c1b18',
          950: '#0e0e0c',
        },
        crimson: {
          50: '#fff1f2',
          100: '#ffe4e6',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
        }
      },
      animation: {
        'ticker': 'ticker 35s linear infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-down': 'slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [
    // eslint-disable-next-line no-undef
    require('@tailwindcss/typography'),
  ],
}
