<script setup>
import { Analytics } from '@vercel/analytics/vue'
import { SpeedInsights } from '@vercel/speed-insights/vue'
import AppShell from '@/layout/AppShell.vue'
</script>

<template>
  <Analytics />
  <SpeedInsights />
  <AppShell>
    <RouterView />
  </AppShell>
</template>
