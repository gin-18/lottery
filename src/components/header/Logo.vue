<script setup>
import { router } from '@/router/router.js'
import logo from '@/assets/images/logo.png'

function goHome() {
  router.push('/')
}
</script>

<template>
  <h1 class="d-flex justify-center align-center" @click="goHome">
    <img :src="logo" alt="logo" />
  </h1>
</template>

<style scoped>
h1 {
  cursor: pointer;
}

img {
  width: 28px;
  height: 28px;
}
</style>
