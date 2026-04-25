/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: '#0F172A',
        violet: '#7C3AED',
        emerald: '#10B981',
        rose: '#F43F5E',
        surface: 'rgba(15, 23, 42, 0.82)',
        surfaceSoft: 'rgba(15, 23, 42, 0.65)',
        border: 'rgba(148, 163, 184, 0.16)',
      },
      dark: {
        navy: '#0F172A',
        surface: 'rgba(15, 23, 42, 0.82)',
        surfaceSoft: 'rgba(15, 23, 42, 0.65)',
      },
      light: {
        navy: '#F8FAFC',
        surface: 'rgba(255, 255, 255, 0.9)',
        surfaceSoft: 'rgba(248, 250, 252, 0.8)',
      },
      boxShadow: {
        glow: '0 20px 50px rgba(124, 58, 237, 0.18)',
        glass: '0 24px 80px rgba(15, 23, 42, 0.32)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        inter: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        cairo: ['Cairo', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'violet-glow': 'radial-gradient(circle at top center, rgba(124, 58, 237, 0.18), transparent 45%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
