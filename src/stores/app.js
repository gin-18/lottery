import { ref } from "vue";
import { defineStore } from "pinia";

export const useAppStore = defineStore("app", () => {
  const mode = ref("light")

  return {
    mode,
  }
})
