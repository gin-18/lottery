<script setup>
import { inject, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRepeatCountStore } from '@/stores/repeat_count'
import Ball from '@/components/content/Ball.vue'
import CodeDate from '@/components/content/CodeDate.vue'

const rawDataArray = inject('rawDataArray')

const repeatCountStore = useRepeatCountStore()
const { startCode, currentCode, currentCodeIndex, result, description } =
  storeToRefs(repeatCountStore)

watch(currentCodeIndex, loadRepeatCount)

onMounted(loadRepeatCount)

function loadRepeatCount() {
  repeatCountStore.initData(rawDataArray.value)
  repeatCountStore.countRepeatNumber()
}
</script>

<template>
  <p>{{ description }}</p>
  <CodeDate v-if="startCode && currentCode" :data="[startCode, currentCode]" />
  <div class="flex items-center gap-4" v-if="result">
    <p>共 {{ result.length }} 个:</p>
    <Ball v-for="num in result" :key="num" :num="num" />
  </div>
</template>
