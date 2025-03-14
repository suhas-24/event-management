/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        party: {
          pink: '#FF5E5B',
          purple: '#7B66FF',
          teal: '#00C2A8',
          yellow: '#FFDB15',
          orange: '#FF9A00',
          red: '#F73F52',
          blue: '#00A1E4',
          green: '#4CB944',
          magenta: '#FF4ECD',
        },
      },
      animation: {
        'bounce-slow': 'bounce 3s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
      boxShadow: {
        'neon': '0 0 5px rgba(123,102,255,0.5), 0 0 20px rgba(123,102,255,0.3)',
        'neon-hover': '0 0 10px rgba(123,102,255,0.7), 0 0 30px rgba(123,102,255,0.5)',
        'party': '0 0 15px rgba(255,94,91,0.6), 0 0 30px rgba(255,94,91,0.4)',
      },
      backgroundImage: {
        'party-gradient': 'linear-gradient(120deg, rgba(255,94,91,0.2), rgba(123,102,255,0.2), rgba(0,194,168,0.2))',
        'text-gradient': 'linear-gradient(to right, #FF5E5B, #7B66FF, #00C2A8)',
        'text-gradient-alt': 'linear-gradient(to right, #FF4ECD, #FFDB15, #00A1E4)',
        'button-gradient': 'linear-gradient(to right, #7B66FF, #FF4ECD)',
      }
    }
  }
}