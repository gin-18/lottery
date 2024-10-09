<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia';
import { useAppStore } from '@/stores/app';
import { useTheme } from 'vuetify'

const { mode } = storeToRefs(useAppStore())
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
  mode.value = theme.global.current.value.dark ? 'dark' : 'light'
  modeIcon.value = theme.global.current.value.dark ? darkIcon : lightIcon
}
</script>

<template>
  <nav class="d-flex justify-center align-center ga-2">
    <RouterLink activeClass="link-active" v-for="item in items" :key="item.name" :to="item.path">
      <v-icon :icon="item.icon" />
    </RouterLink>

    <v-icon :icon="modeIcon" @click="toggleTheme" />
  </nav>
</template>

<style scoped>
.link-active {
  color: red !important;
}
</style>
