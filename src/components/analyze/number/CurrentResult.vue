<script setup>
/**
 * 这个组件用于显示当前期次的开奖结果
 **/
import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useCurrentResultStore } from '@/stores/current_result'
import ResultContainer from '@/components/content/ResultContainer.vue'

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
})

const currentResultStore = useCurrentResultStore()
const { currentData, currentDataIndex, description } =
  storeToRefs(currentResultStore)

watch([() => props.data, currentDataIndex], () => {
  currentResultStore.setCurrentData(props.data)
})
</script>

<template>
  <span v-if="!data.length" class="loading loading-dots"></span>
  <div v-else>
    <p>{{ description }}</p>
    <ResultContainer :data="currentData" />
  </div>
</template>
