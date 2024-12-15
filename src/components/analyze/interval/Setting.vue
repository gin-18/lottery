<script setup>
import SettingBox from '@/components/content/SettingBox.vue'
import RepeatAnalyzeSetting from '@/components/setting/RepeatAnalyzeSetting.vue'
import IntervalAnalyzeSetting from '@/components/setting/IntervalAnalyzeSetting.vue'

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <SettingBox class="not-prose">
    <h2>{{ type }}</h2>
    <div class="flex flex-col gap-8">
      <div>
        <RepeatAnalyzeSetting />
      </div>

      <div>
        <IntervalAnalyzeSetting type="尾部" />
      </div>
    </div>
  </SettingBox>
</template>

<style scoped>
h2 {
  @apply mb-8 text-3xl font-semibold;
}
</style>
