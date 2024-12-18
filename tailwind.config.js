import daisyui from 'daisyui'
import typography from '@tailwindcss/typography'
import { addDynamicIconSelectors } from '@iconify/tailwind'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fade-in 0.5s ease-in-out both',
        'fade-out': 'fade-out 0.5s ease-in-out both',
        'slide-in-right': 'slide-in-right 0.5s ease-in-out both',
        'slide-out-right': 'slide-out-right 0.5s ease-in-out both',
      },
      keyframes: {
        'fade-in': {
          '0%': {
            opacity: '0',
          },
          to: {
            opacity: '0.6',
          },
        },
        'fade-out': {
          '0%': {
            opacity: '0.6',
          },
          to: {
            opacity: '0',
          },
        },
        'slide-in-right': {
          '0%': {
            transform: 'translateX(1000px)',
            opacity: '0',
          },
          to: {
            transform: 'translateX(0)',
            opacity: '1',
          },
        },
        'slide-out-right': {
          '0%': {
            transform: 'translateX(0)',
            opacity: '1',
          },
          to: {
            transform: 'translateX(1000px)',
            opacity: '0',
          },
        },
      },
    },
  },
  plugins: [typography, daisyui, addDynamicIconSelectors()],
  daisyui: {
    themes: ['emerald'],
  },
}
