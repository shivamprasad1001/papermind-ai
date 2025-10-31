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
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        // Neutral grays
        'gray-900': '#121212',
        'gray-800': '#1E1E1E',
        'gray-700': '#2D2D2D',
        'gray-600': '#444444',
        'gray-500': '#666666',
        'gray-400': '#999999',
        'gray-300': '#CCCCCC',
      
        // Primary (Blue)
        primary: {
          DEFAULT: '#4A90E2',
          light: '#6EADF2',
          dark: '#357ABD',
        },
      
        // Theme colors
        'theme-light': {
          bg: '#FFFFFF',
          surface: '#F8F9FA',
          border: '#E9ECEF',
          text: '#212529',
          'text-secondary': '#6C757D',
        },
        'theme-dark': {
          bg: '#0F172A',
          surface: '#1E293B',
          border: '#334155',
          text: '#F1F5F9',
          'text-secondary': '#CBD5E1',
        },
      }
      ,
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-in-right': 'slideInRight 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'slide-out-right': 'slideOutRight 0.4s cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'scale-102': 'scale102 0.2s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'slide-out-right': 'slideOutRight 0.3s cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards',
        'fade-out': 'fadeOut 0.3s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideOutRight: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
        scale102: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.02)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
} 