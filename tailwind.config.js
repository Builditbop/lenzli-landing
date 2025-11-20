/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Vibrant primary gradients
        'lenzli-purple': '#8B5CF6',
        'lenzli-pink': '#EC4899',
        'lenzli-cyan': '#06B6D4',
        'lenzli-emerald': '#10B981',
        'lenzli-blue': '#3B82F6',
        'lenzli-rose': '#F43F5E',
        'lenzli-amber': '#F59E0B',
        'lenzli-orange': '#F97316',
        'lenzli-blue-dark': '#1E40AF',
        // Vibrant accent colors
        'vibrant-purple': '#A855F7',
        'vibrant-pink': '#F472B6',
        'vibrant-cyan': '#22D3EE',
        'vibrant-emerald': '#34D399',
        'vibrant-blue': '#60A5FA',
        'vibrant-rose': '#FB7185',
        'vibrant-orange': '#FB923C',
        'vibrant-blue-dark': '#1E3A8A',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        // Vibrant gradient combinations
        'gradient-primary': 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 50%, #06B6D4 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #F97316 0%, #1E40AF 50%, #F43F5E 100%)',
        'gradient-purple-pink': 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
        'gradient-pink-cyan': 'linear-gradient(135deg, #EC4899 0%, #06B6D4 100%)',
        'gradient-orange-blue': 'linear-gradient(135deg, #F97316 0%, #1E40AF 100%)',
        'gradient-emerald-blue': 'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)',
        'gradient-mesh': 'radial-gradient(at 0% 0%, #8B5CF6 0px, transparent 50%), radial-gradient(at 100% 0%, #EC4899 0px, transparent 50%), radial-gradient(at 100% 100%, #06B6D4 0px, transparent 50%), radial-gradient(at 0% 100%, #F97316 0px, transparent 50%)',
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'blob': 'blob 7s infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        'pulse-glow': {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)' },
          '50%': { opacity: 0.8, boxShadow: '0 0 40px rgba(139, 92, 246, 0.8)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' }
        }
      }
    },
  },
  plugins: [],
}
