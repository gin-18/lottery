<script setup>
import Logo from './Logo.vue'
import NavBar from './NavBar.vue'
</script>

<template>
  <header
    class="position-sticky top-0 left-0 d-flex justify-space-between align-center px-3 text-text bg-background"
  >
    <Logo />
    <NavBar />
  </header>
</template>

<style scoped>
header {
  z-index: 10;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
