<script setup>
import Logo from './Logo.vue'
import NavBar from './NavBar.vue'
</script>

<template>
  <div
    class="d-flex justify-space-between align-center px-3 text-text bg-background"
  >
    <Logo />
    <div class="d-flex justify-space-between align-center">
      <NavBar />
    </div>
  </div>
</template>
