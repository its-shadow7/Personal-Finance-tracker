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
        'chart-1': '#3B82F6',
        'chart-2': '#F59E0B',
        'chart-3': '#8B5CF6',
        'chart-4': '#EC4899',
        theme: {
          bg: '#fdf8f4',
          sidebar: '#f4ede4',
          'sidebar-active': '#e9decb',
          primary: '#b5836a',
          'text-main': '#2D241E',
          'text-muted': '#7D6E63',
          border: '#eee4da',
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
