/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5', 
        background: '#F8FAFC', 
        surface: '#FFFFFF',
        border: '#E2E8F0', 
        'text-main': '#0F172A', 
        'text-muted': '#64748B', 
        success: '#10B981', 
        danger: '#EF4444', 
        'chart-1': '#82A773', // Rent (Green)
        'chart-2': '#D27352', // Food (Red/Orange)
        'chart-3': '#E09A55', // Transport (Orange)
        'chart-4': '#ECA868', // Utilities (Light Orange)
        'chart-5': '#668BBC', // Others (Blue)
        theme: {
          'bg-main': '#FFFFFF',
          'bg-card': '#0C1D2D',
          'primary-accent': '#1F8D69',
          'secondary-accent': '#FF6D5F',
          'text-main': '#FFFFFF',
          'text-dark': '#0C1D2D',
          'text-muted': '#A6ABB9',
          border: '#E6E9F0',
        }
      },
      fontFamily: {
        heading: ['Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      }
    },
  },
  plugins: [],
}
