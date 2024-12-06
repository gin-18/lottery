import daisyui from 'daisyui'
import typography from '@tailwindcss/typography'
import { addDynamicIconSelectors } from '@iconify/tailwind'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [typography, daisyui, addDynamicIconSelectors()],
  daisyui: {
    themes: ['emerald'],
  },
}
