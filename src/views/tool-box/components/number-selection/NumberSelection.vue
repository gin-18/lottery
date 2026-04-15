<script setup>
import { ref, watch } from 'vue'
import SettingBox from '@/components/content/SettingBox.vue'

const emit = defineEmits(['select'])

const props = defineProps({
  label: {
    type: String
  },
  selectionTitle: {
    type: String
  },
  optionalNumbers: {
    type: Array
  },
})

// 高亮选中的个数
function setActivedNumber(number) {
  return number === selectedNumber.value
}

const selectedNumber = ref() // 选中的个数
// 选择个数
function selectNumber(number) {
  selectedNumber.value = number
  isShowSelection.value = false
  emit('select', selectedNumber.value)
}

const isShowSelection = ref(false) // 是否显示弹窗
// 显示选择号码个数弹窗
function showSelection() {
  isShowSelection.value = true
}

watch(() => props.optionalNumbers, (val) => {
  selectedNumber.value = props.optionalNumbers?.[0]
  emit('select', selectedNumber.value)
})
</script>

<template>
  <div>
    <p v-if="props.label" class="text-base font-semibold">{{ props.label }}</p>
    <div>
      <button
        class="btn btn-sm flex justify-between items-center gap-6"
        @click="showSelection"
      >
        <span>{{ selectedNumber }} 个</span>
        <span class="icon-[octicon--chevron-down-12]"></span>
      </button>
    </div>
  </div>

  <SettingBox
    v-model:show="isShowSelection"
    is-custom-toggle
    :title="props.selectionTitle"
  >
    <section>
      <div class="grid grid-cols-5 gap-2">
        <button
          v-for="number in optionalNumbers"
          :key="number"
          :class="{
            'btn btn-sm': true,
            'btn-primary': setActivedNumber(number),
          }"
          @click="selectNumber(number)"
        >
          {{ number }}
        </button>
      </div>
    </section>
  </SettingBox>
</template>
