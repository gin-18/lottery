<script setup>
import Logo from '@/components/Logo.vue'
import NavBar from '@/components/NavBar.vue'
</script>

<template>
  <header
    class="flex flex-wrap justify-between items-center p-4 md:gap-0 md:p-4"
  >
    <Logo class="mb-6 md:mb-0" />
    <NavBar />
  </header>
  <main class="prose prose-sm mt-4 px-4 md:prose md:prose-base md:container md:mx-auto"><slot /></main>
  <footer class="flex justify-center items-center pb-[env(safe-area-inset-bottom)] text-warning md:py-4"></footer>
</template>
