<script setup>
import Logo from './Logo.vue'
import NavBar from './NavBar.vue'
import ToggleTheme from './ToggleTheme.vue'
</script>

<template>
  <div
    class="d-flex justify-space-between align-center px-2 text-text bg-background"
  >
    <Logo />
    <div class="d-flex justify-space-between align-center">
      <NavBar />
      <ToggleTheme />
    </div>
  </div>
</template>
