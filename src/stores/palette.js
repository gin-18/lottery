import { ref } from "vue";
import { defineStore } from "pinia";
import { palette } from '@/assets/js/palette.js'

export const usePaletteStore = defineStore("palette", () => {
  const activeColor = ref(palette.blue)

  return {
    activeColor,
  }
})
