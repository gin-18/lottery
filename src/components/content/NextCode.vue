<script setup>
import { computed } from 'vue'
import { formatDay } from '@/assets/js/utils'

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})

const nextCode = computed(() => props.data.next_code)
const nextOpenTime = computed(() => formatDay(props.data.next_open_time))
</script>

<template>
  <div role="alert" class="alert">
    <span class="icon-[octicon--info-16]"></span>
    <div class="flex items-center">
      <p>下一期开奖：</p>
      <p>第{{ nextCode }}期</p>
      <p class="ml-6">{{ nextOpenTime }}</p>
    </div>
  </div>
</template>

<style scoped>
p {
  @apply my-0;
}
</style>
