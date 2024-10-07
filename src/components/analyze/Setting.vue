<script setup>
import { ref } from 'vue'
const show = ref(true)
</script>

<template>
  <div
    class="fixed top-0 left-0 flex flex-col justify-center items-center w-full h-full bg-ctp-overlay0 opacity-80 text-ctp-crust"
    v-if="show">
  </div>

  <div v-if="show">
    <div
      class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-between items-center w-72 h-80 p-3 text-ctp-text bg-ctp-crust rounded-sm">
      <h2 class="text-2xl">设置</h2>

      <div>
        setting
      </div>

      <div class="flex justify-around items-center w-full">
        <button class="px-3 py-1 rounded-sm text-ctp-crust bg-ctp-lavender" @click="show = !show">确定</button>
        <button class="px-3 py-1 rounded-sm text-ctp-crust bg-ctp-lavender" @click="show = !show">隐藏</button>
      </div>
    </div>
  </div>
</template>
