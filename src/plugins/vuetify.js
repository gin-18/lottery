import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import '@fortawesome/fontawesome-free/css/all.css'
import { aliases, fa } from 'vuetify/iconsets/fa'
import { paletteLight } from '@/assets/js/palette.js'

const customLightTheme = {
  dark: false,
  colors: paletteLight,
}

export const vuetify = createVuetify({
  theme: {
    defaultTheme: 'customLightTheme',
    themes: {
      customLightTheme,
    },
  },
  icons: {
    defaultSet: 'fa',
    aliases,
    sets: {
      fa,
    },
  },
})
