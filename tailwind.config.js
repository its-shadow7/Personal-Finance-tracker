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
          bg: '#FAEEE4', // Very light peach background
          sidebar: '#E1C2A5', // Warm tan sidebar
          'sidebar-active': '#F2DBCA', // Lighter tan for active items
          primary: '#B57758', // Terracotta button
          'text-main': '#1A1817', // Nearly black
          'text-muted': '#6B5A4E', // Warm gray/brown
          border: '#E8D4C4', // Soft beige border
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
