<script setup>
import SettingBox from '@/components/content/SettingBox.vue'
import RepeatCountSetting from '@/components/setting/RepeatCountSetting.vue'
import IntervalAnalyzeSetting from '@/components/setting/IntervalAnalyzeSetting.vue'

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <SettingBox :title="`${type}统计设置`">
    <RepeatCountSetting />
    <IntervalAnalyzeSetting :type="type" />
  </SettingBox>
</template>
