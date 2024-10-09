<script setup>
import { router } from '@/router/router.js'

function goHome() {
  router.push('/')
}
</script>

<template>
  <h1 class="text-h5" @click="goHome">快乐8</h1>
</template>
