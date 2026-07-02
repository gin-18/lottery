<script setup>
import LoDrawer from '@/components/content/LoDrawer.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  optionalNumbers: {
    type: Array,
    required: true,
  },
  selectedNumber: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue', 'select'])

function setActivedNumber(number) {
  return number === props.selectedNumber
}

function selectNumber(number) {
  emit('select', number)
  emit('update:modelValue', false)
}
</script>

<template>
  <LoDrawer
    :model-value="props.modelValue"
    :title="props.title"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <section>
      <div class="grid grid-cols-5 gap-2">
        <button
          v-for="number in props.optionalNumbers"
          :key="number"
          type="button"
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
  </LoDrawer>
</template>
