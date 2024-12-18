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
  <SettingBox :title="`${type}统计设置`">
    <RepeatAnalyzeSetting />
    <IntervalAnalyzeSetting :type="type" />
  </SettingBox>
</template>
