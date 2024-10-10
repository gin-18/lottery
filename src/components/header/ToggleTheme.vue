<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia';
import { useAppStore } from '@/stores/app.js'
import { useTheme } from 'vuetify'

const { isDark } = storeToRefs(useAppStore())
const theme = useTheme()
const modeIcon = ref('light_mode')

function toggleTheme() {
  const lightIcon = 'light_mode'
  const darkIcon = 'dark_mode'

  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
  modeIcon.value = theme.global.current.value.dark ? darkIcon : lightIcon
  isDark.value = theme.global.current.value.darkIcon
}
</script>

<template>
  <div>
    <v-icon :icon="modeIcon" size="16px" @click="toggleTheme" />
  </div>
</template>
