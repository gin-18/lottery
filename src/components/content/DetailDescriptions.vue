<script setup>
import { computed } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  bordered: {
    type: Boolean,
    default: true,
  },
  columns: {
    type: Number,
    default: 2,
  },
  emptyText: {
    type: String,
    default: '--',
  },
})

const columnCount = computed(() => normalizeCount(props.columns))
const containerClass = computed(() => getContainerClass())
const gridStyle = computed(() => getGridStyle())
const itemClass = computed(() => getItemClass())
const labelClass = computed(() => getLabelClass())
const valueClass = computed(() => getValueClass())

function normalizeCount(count) {
  if (count < 1) return 1
  if (count > 4) return 4
  return count
}

function getContainerClass() {
  if (!props.bordered) return 'gap-x-4 gap-y-4'

  return 'gap-px overflow-hidden rounded-box border border-base-300 bg-base-300'
}

function getGridStyle() {
  return {
    gridTemplateColumns: `repeat(${columnCount.value}, minmax(0, 1fr))`,
  }
}

function getItemStyle(item) {
  const span = normalizeSpan(item?.span)

  return {
    gridColumn: `span ${span} / span ${span}`,
  }
}

function getItemClass() {
  if (!props.bordered) return 'grid grid-cols-[7rem_minmax(0,1fr)] rounded-box'

  return 'grid grid-cols-[7rem_minmax(0,1fr)] gap-px bg-base-300'
}

function getLabelClass() {
  if (!props.bordered) {
    return 'bg-base-200/60 px-4 py-4 text-sm text-base-content/70'
  }

  return 'bg-base-200/80 px-4 py-4 text-sm text-base-content/70'
}

function getValueClass() {
  if (!props.bordered) return 'px-4 py-4'

  return 'bg-base-100 px-4 py-4'
}

function normalizeSpan(span) {
  if (!span) return 1

  const maxSpan = columnCount.value
  if (span > maxSpan) return maxSpan
  if (span < 1) return 1

  return span
}

function getValueSlotName(item) {
  return `value-${item.key}`
}

function getDisplayValue(item) {
  if (item.value === undefined || item.value === null || item.value === '') {
    return props.emptyText
  }

  return item.value
}
</script>

<template>
  <div class="grid" :class="containerClass" :style="gridStyle">
    <div
      v-for="item in items"
      :key="item.key"
      class="min-w-0"
      :class="itemClass"
      :style="getItemStyle(item)"
    >
      <div class="min-w-0" :class="labelClass">
        {{ item.label }}
      </div>
      <div class="min-w-0 break-words" :class="valueClass">
        <slot :name="getValueSlotName(item)" :item="item">
          {{ getDisplayValue(item) }}
        </slot>
      </div>
    </div>
  </div>
</template>
