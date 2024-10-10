import 'vuetify/styles'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import { createVuetify } from 'vuetify'
import { aliases, md } from 'vuetify/iconsets/md'
import { paletteLight, paletteDark } from '@/assets/js/palette.js'

const customLightTheme = {
  dark: false,
  colors: paletteLight,
}

const customDarkTheme = {
  dark: true,
  colors: paletteDark,
}

export const vuetify = createVuetify({
  theme: {
    defaultTheme: 'customLightTheme',
    themes: {
      customLightTheme,
      customDarkTheme
    }
  },
  icons: {
    defaultSet: 'md',
    aliases,
    sets: {
      md,
    },
  }
})
