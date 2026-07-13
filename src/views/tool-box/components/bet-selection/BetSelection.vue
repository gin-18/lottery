<script setup>
import { ref, computed, onMounted } from 'vue'
import { PLAY_TYPES } from '@/utils/lottery-rules'

const props = defineProps({
  startBetIndex: {
    type: Number,
    default: 1,
  }
})

const emit = defineEmits(['select'])

// 选中的玩法下标
const selectedBetIndex = ref(0)

// 渲染的玩法
const renderBets = computed(() => PLAY_TYPES.slice(props.startBetIndex - 1))

// 选择玩法
function onSelectOptional(betIndex) {
  selectedBetIndex.value = betIndex
  emit('select', renderBets.value[betIndex])
}

// 检查玩法是否被选中
function checkBetIsSelected(betIndex) {
  return selectedBetIndex.value === betIndex
}

onMounted(() => {
  emit('select', renderBets.value[selectedBetIndex.value])
})
</script>

<template>
  <div>
    <p class="text-base font-semibold">玩法</p>
    <div class="grid grid-cols-5 gap-2">
      <button
        v-for="(bet, index) in renderBets"
        :key="bet.value"
        :class="{
          'btn btn-sm': true,
          'btn-primary': checkBetIsSelected(index),
        }"
        @click="onSelectOptional(index)"
      >
        {{ bet.label }}
      </button>
    </div>
  </div>
</template>
