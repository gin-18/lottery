<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia';
import { useThemeStore } from '@/stores/theme.js'
import { useTheme } from 'vuetify'

const { isDark } = storeToRefs(useThemeStore())
const theme = useTheme()
const modeIcon = ref('light_mode')
const items = [
  {
    name: 'LIST',
    path: '/',
    icon: 'subject',
  },
  {
    name: 'ANALYZE',
    path: '/analyze',
    icon: 'equalizer',
  }
]

function toggleTheme() {
  const lightIcon = 'light_mode'
  const darkIcon = 'dark_mode'

  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
  modeIcon.value = theme.global.current.value.dark ? darkIcon : lightIcon
  isDark.value = theme.global.current.value.dark
}
</script>

<template>
  <nav class="d-flex justify-center align-center ga-4">
    <RouterLink class="text-text" activeClass="link-active" v-for="item in items" :key="item.name" :to="item.path">
      <v-icon :icon="item.icon" />
    </RouterLink>

    <v-icon :icon="modeIcon" @click="toggleTheme" />
  </nav>
</template>

<!-- TODO: set active color for link -->
<style scoped>
.link-active {
  color: #f38ba8 !important;
}
</style>
