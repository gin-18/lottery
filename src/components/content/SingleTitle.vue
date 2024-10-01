<script setup>
const props = defineProps({
  title: String
});
</script>

<template>
  <h2 class="text-lg font-bold">{{ title }}</h2>
</template>
