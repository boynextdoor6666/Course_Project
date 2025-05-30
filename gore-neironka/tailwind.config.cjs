/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0a68f5", // Sora blue
        secondary: "#4fb4fe",
        danger: "#ff3b30",
        dark: "#07090d",
        light: "#f9fafc",
        sora: {
          blue: {
            DEFAULT: "#0a68f5",
            50: "#e6f0ff",
            100: "#bdd7fe",
            200: "#8abbff",
            300: "#6aa2ff",
            400: "#3a89ff",
            500: "#0a68f5",
            600: "#0058e6",
            700: "#0047cc",
            800: "#0038a3",
            900: "#002970"
          },
          gray: {
            DEFAULT: "#2c3039",
            50: "#f4f6f8",
            100: "#e9ecf0",
            200: "#dce0e6",
            300: "#bdc2cc",
            400: "#9ea2b2",
            500: "#7f8397",
            600: "#646978",
            700: "#4a505c",
            800: "#2c3039",
            900: "#07090d"
          }
        }
      },
      animation: {
        'bounce-slow': 'bounce 3s linear infinite',
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'gradient': 'gradient 8s ease infinite',
        'shimmer': 'shimmer 1.5s infinite',
        'morph': 'morph 10s ease-in-out infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(10, 104, 245, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(10, 104, 245, 0.6)' }
        },
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' }
        },
        morph: {
          '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
          '25%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
          '50%': { borderRadius: '50% 60% 30% 60% / 30% 60% 70% 40%' },
          '75%': { borderRadius: '60% 40% 60% 30% / 60% 30% 70% 40%' }
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      },
      backdropBlur: {
        xs: '2px'
      },
      fontSize: {
        'xxs': '.65rem'
      }
    },
  },
  plugins: [],
} 