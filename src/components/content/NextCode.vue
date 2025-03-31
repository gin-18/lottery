<script setup>
import { computed } from 'vue'
import { formatDay } from '@/assets/js/utils'

const props = defineProps({
  latestData: {
    type: Object,
    required: true,
  },
})

const nextCode = computed(() => props.latestData.next_code)
const nextOpenTime = computed(() => formatDay(props.latestData.next_open_time))
</script>

<template>
  <div
    role="alert"
    class="flex gap-2 items-center p-4 rounded-box bg-base-200 md:alert"
  >
    <span class="icon-[octicon--info-16]"></span>
    <div class="flex items-center">
      <p>下一期开奖：</p>
      <p>第{{ nextCode }}期</p>
      <p class="ml-3">{{ nextOpenTime }}</p>
    </div>
  </div>
</template>

<style scoped>
p {
  @apply my-0;
}
</style>
