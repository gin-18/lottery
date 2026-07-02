<script setup>
import { computed, onBeforeUnmount, onMounted, useSlots } from 'vue'
import { useBodyScrollLock } from '@/composables/useBodyScrollLock.js'

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  modelValue: {
    type: Boolean,
    required: true,
  },
  panelClass: {
    type: String,
    default: 'md:w-1/2 lg:w-1/3',
  },
})

const emit = defineEmits(['update:modelValue'])

const drawerId = `lo-drawer-${Math.random().toString(36).slice(2)}`
const drawerTitleId = `${drawerId}-title`
const slots = useSlots()
const hasFooter = computed(() => Boolean(slots.footer))
const isDrawerOpen = computed(() => props.modelValue)

useBodyScrollLock(isDrawerOpen)

function closeDrawer() {
  emit('update:modelValue', false)
}

function handleToggleChange(event) {
  emit('update:modelValue', event.target.checked)
}

function handleKeydown(event) {
  if (event.key !== 'Escape') return
  if (!props.modelValue) return

  closeDrawer()
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="drawer drawer-end">
    <input
      :id="drawerId"
      type="checkbox"
      class="drawer-toggle"
      :checked="modelValue"
      @change="handleToggleChange"
    />

    <div class="drawer-side z-50">
      <label :for="drawerId" aria-label="关闭抽屉" class="drawer-overlay"></label>

      <aside
        role="dialog"
        aria-modal="true"
        :aria-labelledby="drawerTitleId"
        class="flex h-full w-full flex-col bg-base-100"
        :class="panelClass"
      >
        <header class="flex shrink-0 items-center justify-between border-b border-base-300 p-4">
          <h2 :id="drawerTitleId" class="m-0 text-lg font-semibold md:m-0">{{ title }}</h2>
          <button type="button" class="btn btn-ghost btn-sm" aria-label="关闭抽屉" @click="closeDrawer">
            <span class="icon-[octicon--x-16]"></span>
          </button>
        </header>

        <main class="min-h-0 flex-1 overflow-y-auto p-4">
          <slot></slot>
        </main>

        <footer v-if="hasFooter" class="shrink-0 border-t border-base-300 p-4">
          <slot name="footer"></slot>
        </footer>
      </aside>
    </div>
  </div>
</template>
