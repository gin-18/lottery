<script setup>
import { SpeedInsights } from '@vercel/speed-insights/vue'
</script>

<template>
  <SpeedInsights />
  <RouterView />
</template>

<style>
.ball-container {
  display: grid;
  gap: 0.5rem;
  grid-template-columns: repeat(10, 1fr);
  justify-items: center;
  align-items: center;
}

th {
  font-weight: bold !important;
}
</style>
