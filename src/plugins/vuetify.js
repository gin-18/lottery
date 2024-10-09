import 'vuetify/styles'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import { createVuetify } from 'vuetify'
import { aliases, md } from 'vuetify/iconsets/md'

export const vuetify = createVuetify({
  theme: {
    themes: {
      light: {
        colors: {
          background: '#eff1f5', // base
          "sub-background": '#dce0e8', // crust
          text: '#4c4f69', // text
          subtext: '#6c6f85', // subtext0
          inactive: '#8c8fa1', // overlay0
          "ball-hot": '#d20f39', // red
          "ball-cold": '#8c8fa1', // blue
          "area-hot": '#d20f39', // red
          "area-warm": '#fe640b', // peach
          "area-cold": '#1e66f5', // blue
        },
      },
      dark: {
        colors: {
          background: '#1e1e2e',
          "sub-background": '#11111b',
          text: '#cdd6f4',
          subtext: '#a6adc8',
          inactive: '#6c7086',
          "ball-hot": '#f38ba8',
          "ball-cold": '#6c7086',
          "area-hot": '#f38ba8',
          "area-warm": '#fab387',
          "area-cold": '#89b4fa',
        },
      },
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
