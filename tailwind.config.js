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
          'bg-sidebar': '#E8D4C0',      // Warm beige for sidebar
          'bg-main': '#F7EAE1',         // Lighter warm beige for main app bg
          'bg-card': '#FFFFFF',         // Pure White for cards/panels
          'primary-btn': '#C48668',     // Warm tan/brown for buttons
          'text-main': '#111827',       // Dark grey/black for primary text
          'text-muted': '#6B7280',      // Muted grey for secondary text
          'border': '#E5E7EB',          // Light grey for subtle borders
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
