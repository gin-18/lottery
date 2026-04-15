<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  startBetIndex: {
    type: Number,
    default: 1,
  }
})

const emit = defineEmits(['select'])

// 所有玩法
const bets = [
  '选一',
  '选二',
  '选三',
  '选四',
  '选五',
  '选六',
  '选七',
  '选八',
  '选九',
  '选十',
]

// 选中的玩法下标
const selectedBetIndex = ref(0)

// 渲染的玩法
const renderBets = computed(() => bets.slice(props.startBetIndex - 1, bets.length))

// 选择玩法
function onSelectOptional(betIndex) {
  selectedBetIndex.value = betIndex
  emit('select', selectedBetIndex.value)
}

// 检查玩法是否被选中
function checkBetIsSelected(betIndex) {
  return selectedBetIndex.value === betIndex
}

onMounted(() => {
  emit('select', selectedBetIndex.value)
})
</script>

<template>
  <div>
    <p class="text-base font-semibold">玩法</p>
    <div class="grid grid-cols-5 gap-2">
      <button
        v-for="(bet, index) in renderBets"
        :key="bet"
        :class="{
          'btn btn-sm': true,
          'btn-primary': checkBetIsSelected(index),
        }"
        @click="onSelectOptional(index)"
      >
        {{ bet }}
      </button>
    </div>
  </div>
</template>
