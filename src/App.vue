<script setup>
import { Analytics } from '@vercel/analytics/vue'
import { SpeedInsights } from '@vercel/speed-insights/vue'
</script>

<template>
  <Analytics />
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

.wrap {
  white-space: pre;
}
</style>
