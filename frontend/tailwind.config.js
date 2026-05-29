/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        display: ['"Inter Tight"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'ui-serif', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
      },
      colors: {
        // Theme-aware palette
        'primary-bg': 'var(--bg-color)',
        'primary-text': 'var(--text-primary)',
        'secondary-text': 'var(--text-secondary)',
        'border-theme': 'var(--border-color)',
        'card-theme': 'var(--card-bg)',
        'accent-theme': 'var(--accent-color)',
        'accent-theme-text': 'var(--accent-text)',

        // Premium warm-neutral system (consistent across landing + app)
        paper: '#FAFAF7',
        surface: '#FFFFFF',
        ink: {
          DEFAULT: '#1B1B18',
          soft: '#3A3A35',
        },
        muted: {
          DEFAULT: '#76756E',
          soft: '#9A998F',
        },
        line: {
          DEFAULT: '#ECEBE4',
          strong: '#DEDDD4',
        },
        
        // Monochrome palette (keeping for backward compatibility if needed)
        'lenzli-black': '#0A0A0A',
        'lenzli-dark': '#1A1A1A',
        'lenzli-charcoal': '#2D2D2D',
        'lenzli-gray': '#6B6B6B',
        'lenzli-muted': '#9CA3AF',
        'lenzli-silver': '#D1D5DB',
        'lenzli-light': '#F3F4F6',
        'lenzli-offwhite': '#F9FAFB',
        'lenzli-white': '#FFFFFF',
        // Functional accents (minimal, for actions only)
        'lenzli-success': '#22C55E',
        'lenzli-danger': '#EF4444',
        'lenzli-info': '#3B82F6',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(27,27,24,0.04), 0 1px 1px rgba(27,27,24,0.03)',
        card: '0 1px 3px rgba(27,27,24,0.05), 0 8px 24px -12px rgba(27,27,24,0.12)',
        float: '0 20px 50px -24px rgba(27,27,24,0.25), 0 4px 12px -6px rgba(27,27,24,0.08)',
        ring: '0 0 0 1px rgba(27,27,24,0.06)',
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'blob': 'blob 7s infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
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
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      }
    },
  },
  plugins: [],
}
