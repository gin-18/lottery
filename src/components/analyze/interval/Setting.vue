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
    <h2>{{ type }}统计设置</h2>
    <div class="flex flex-col gap-8">
      <div>
        <RepeatAnalyzeSetting />
      </div>

      <div>
        <IntervalAnalyzeSetting :type="type" />
      </div>
    </div>
  </SettingBox>
</template>

<style scoped>
h2 {
  @apply mb-8 text-3xl font-semibold;
}
</style>
