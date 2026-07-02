<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  title: String,
  modelValue: {
    type: Boolean,
    default: undefined,
  },
  showTrigger: {
    type: Boolean,
    default: true,
  },
  panelClass: {
    type: String,
    default: 'md:w-1/2 lg:w-1/3',
  },
})

const emit = defineEmits(['update:modelValue'])

const internalShow = ref(false)
const isControlled = computed(() => props.modelValue !== undefined)
const isShown = computed(() =>
  isControlled.value ? props.modelValue : internalShow.value,
)

function setShown(value) {
  if (isControlled.value) {
    emit('update:modelValue', value)
    return
  }

  internalShow.value = value
}

function toggleSetting() {
  setShown(!isShown.value)
}

function closeSetting() {
  setShown(false)
}
</script>

<template>
  <button v-if="showTrigger" class="btn fixed bottom-4 right-4" @click="toggleSetting">
    <span class="icon-[octicon--gear-16]"></span>
  </button>

  <Transition
    appear
    enter-active-class="animate-[fade-in_0.5s_ease-in-out_both]"
    leave-active-class="animate-[fade-out_0.5s_ease-in-out_both]"
  >
    <div
      v-show="isShown"
      class="fixed top-0 right-0 w-full h-full bg-neutral opacity-60"
      @click="closeSetting"
    ></div>
  </Transition>

  <Transition
    appear
    enter-active-class="animate-[slide-in-right_0.5s_ease-in-out_both]"
    leave-active-class="animate-[slide-out-right_0.5s_ease-in-out_both]"
  >
    <div
      v-show="isShown"
      class="fixed top-0 right-0 overflow-y-auto w-full h-full max-h-full bg-base-100"
      :class="panelClass"
    >
      <div class="flex justify-between items-center pt-4 px-4">
        <h2 class="m-0">{{ title }}</h2>
        <span
          class="icon-[octicon--x-circle-16] text-xl cursor-pointer"
          @click="closeSetting"
        ></span>
      </div>
      <div class="divider setting-box-divider"></div>
      <div class="p-4 pt-0">
        <slot></slot>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.setting-box-divider::before,
.setting-box-divider::after {
  height: 1px;
}
</style>
