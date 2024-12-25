<script setup>
import SettingBox from '@/components/content/SettingBox.vue'
import CurrentResultSetting from '@/components/setting/CurrentResultSetting.vue'
import RepeatAnalyzeSetting from '@/components/setting/RepeatAnalyzeSetting.vue'
import TimesNumberCountAnalyzeSetting from '@/components/setting/TimesNumberCountAnalyzeSetting.vue'
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
    <TimesNumberCountAnalyzeSetting :data="data" />
    <FrequencyCountAnalyzeSetting />
  </SettingBox>
</template>
