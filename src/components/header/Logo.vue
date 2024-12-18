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
  <h1 class="cursor-pointer flex items-center gap-2 px-4" @click="goHome">
    <img class="w-8 h-8" :src="logo" alt="logo" />
    <p class="m-0 text-2xl font-semibold">快乐8研究所</p>
  </h1>
</template>
