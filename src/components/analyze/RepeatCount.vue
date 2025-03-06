<script setup>
import { inject, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRepeatCountStore } from '@/stores/repeat_count'
import Ball from '@/components/content/Ball.vue'
import CodeDate from '@/components/content/CodeDate.vue'

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
})

const rawDataArray = inject('rawDataArray')

const repeatCountStore = useRepeatCountStore()
const { startCode, currentCode, currentCodeIndex, result, description } =
  storeToRefs(repeatCountStore)

watch([() => rawDataArray.value, currentCodeIndex], () => {
  repeatCountStore.initData(rawDataArray.value)
  repeatCountStore.countRepeatNumber()
})
</script>

<template>
  <span v-if="!rawDataArray.length" class="loading loading-dots"></span>
  <div v-else>
    <p>{{ description }}</p>

    <div class="flex items-center gap-4">
      <CodeDate :data="startCode" />
      <p>-</p>
      <CodeDate :data="currentCode" />
    </div>

    <div class="flex items-center gap-4">
      <p>共 {{ result.length }} 个:</p>
      <Ball v-for="num in result" :key="num" :num="num" />
    </div>
  </div>
</template>
