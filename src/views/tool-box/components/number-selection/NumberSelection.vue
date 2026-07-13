<script setup>
defineEmits(['open'])

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  selectionTitle: {
    type: String,
    required: true,
  },
  selectedNumber: {
    type: Number,
    required: true,
  },
})
</script>

<template>
  <section class="shrink-0">
    <p v-if="props.label" class="whitespace-nowrap text-base font-semibold">{{ props.label }}</p>
    <div>
      <button
        type="button"
        :aria-label="props.selectionTitle"
        class="btn btn-sm inline-flex min-w-20 shrink-0 items-center justify-between gap-2 whitespace-nowrap"
        @click="$emit('open')"
      >
        <span class="whitespace-nowrap">{{ props.selectedNumber }} 个</span>
        <span class="icon-[octicon--chevron-down-12]"></span>
      </button>
    </div>
  </section>
</template>
