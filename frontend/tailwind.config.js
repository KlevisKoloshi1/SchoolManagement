/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#6366F1', // Modern indigo
        secondary: '#8B5CF6', // Modern purple
        accent: '#06B6D4', // Modern cyan
        background: '#FAFBFC',
        surface: '#FFFFFF',
        success: '#10B981', // Modern emerald
        warning: '#F59E0B', // Modern amber
        error: '#EF4444', // Modern red
        muted: '#6B7280',
        'muted-foreground': '#9CA3AF',
        border: '#E5E7EB',
        'border-light': '#F3F4F6',
      },
      boxShadow: {
        soft: '0 10px 30px rgba(2, 6, 23, 0.08)',
        'soft-lg': '0 20px 40px rgba(2, 6, 23, 0.12)',
      },
      animation: {
        'in': 'fadeIn 0.3s ease-out',
        'slide-in-from-top-2': 'slideInFromTop 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInFromTop: {
          '0%': { transform: 'translateY(-8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

