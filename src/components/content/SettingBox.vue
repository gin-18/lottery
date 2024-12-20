<script setup>
import { ref } from 'vue'

const props = defineProps({
  title: String,
})

const show = ref(false)

function toggleShowSetting() {
  show.value = !show.value
}
</script>

<template>
  <button class="btn fixed bottom-8 right-8" @click="toggleShowSetting">
    <span class="icon-[octicon--gear-24] text-xl"></span>
  </button>

  <Transition
    appear
    enter-active-class="animate-[fade-in_0.5s_ease-in-out_both]"
    leave-active-class="animate-[fade-out_0.5s_ease-in-out_both]"
  >
    <div
      v-show="show"
      class="fixed top-0 right-0 w-full h-full bg-neutral opacity-60"
      @click="toggleShowSetting"
    ></div>
  </Transition>

  <Transition
    appear
    enter-active-class="animate-[slide-in-right_0.5s_ease-in-out_both]"
    leave-active-class="animate-[slide-out-right_0.5s_ease-in-out_both]"
  >
    <div
      v-show="show"
      class="fixed top-0 right-0 overflow-y-auto w-2/5 h-full max-h-full bg-base-100"
    >
      <div class="flex justify-between items-center pt-6 px-6">
        <h2 class="m-0">{{ title }}</h2>
        <button class="btn btn-sm" @click="toggleShowSetting">
          <span class="icon-[octicon--x-24] text-xl"></span>
        </button>
      </div>
      <div class="p-6">
        <slot></slot>
      </div>
    </div>
  </Transition>
</template>
