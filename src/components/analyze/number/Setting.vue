<script setup>
import SettingBox from '@/components/content/SettingBox.vue'
import CurrentResultSetting from '@/components/setting/CurrentResultSetting.vue'
import RepeatAnalyzeSetting from '@/components/setting/RepeatAnalyzeSetting.vue'
import NumberCountAnalyzeSetting from '@/components/setting/NumberCountAnalyzeSetting.vue'
import FrequencyCountAnalyzeSetting from '@/components/setting/FrequencyCountAnalyzeSetting.vue'

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <SettingBox title="号码分析设置">
    <CurrentResultSetting />
    <RepeatAnalyzeSetting />
    <NumberCountAnalyzeSetting :data="data" />
    <FrequencyCountAnalyzeSetting />
  </SettingBox>
</template>
