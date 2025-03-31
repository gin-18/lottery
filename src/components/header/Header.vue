<script setup>
import Logo from './Logo.vue'
import NavBar from './NavBar.vue'
</script>

<template>
  <header
    class="flex flex-wrap justify-between items-center p-2 md:gap-0 md:p-4"
  >
    <Logo class="mb-6 md:mb-0" />
    <NavBar />
  </header>
</template>
