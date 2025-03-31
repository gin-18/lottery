<script setup>
import { ref } from 'vue'

const props = defineProps({
  title: String,
})

const show = ref(false)

function toggleSetting() {
  show.value = !show.value
}

function closeSetting() {
  show.value = false
}
</script>

<template>
  <button class="btn fixed bottom-2 right-2" @click="toggleSetting">
    <span class="icon-[octicon--gear-16]"></span>
  </button>

  <Transition
    appear
    enter-active-class="animate-[fade-in_0.5s_ease-in-out_both]"
    leave-active-class="animate-[fade-out_0.5s_ease-in-out_both]"
  >
    <div
      v-show="show"
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
      v-show="show"
      class="fixed top-0 right-0 overflow-y-auto w-full h-full max-h-full bg-base-100 md:w-1/2 lg:w-1/3"
    >
      <div class="flex justify-between items-center pt-6 px-6">
        <h2 class="m-0">{{ title }}</h2>
        <span
          class="icon-[octicon--x-circle-16] text-xl cursor-pointer"
          @click="closeSetting"
        ></span>
      </div>
      <div class="p-6">
        <slot></slot>
      </div>
    </div>
  </Transition>
</template>
