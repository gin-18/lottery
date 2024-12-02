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
th {
  font-weight: bold !important;
}
</style>
