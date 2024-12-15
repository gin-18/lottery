<script setup>
import { useRouter } from 'vue-router'
import logo from '@/assets/images/logo.png'

const router = useRouter()

function goHome() {
  router.push({
    name: 'Home',
  })
}
</script>

<template>
  <h1 class="cursor-pointer" @click="goHome">
    <img class="w-8 h-8" :src="logo" alt="logo" />
  </h1>
</template>
