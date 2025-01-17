<script setup>
import SettingBox from '@/components/content/SettingBox.vue'
import CurrentResultSetting from '@/components/setting/CurrentResultSetting.vue'
import RepeatCountSetting from '@/components/setting/RepeatCountSetting.vue'
import TimesNumberCountSetting from '@/components/setting/TimesNumberCountSetting.vue'
import FrequencyCountSetting from '@/components/setting/FrequencyCountSetting.vue'
import NumberDistributionSetting from '@/components/setting/NumberDistributionSetting.vue'

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
    <RepeatCountSetting />
    <TimesNumberCountSetting :data="data" />
    <FrequencyCountSetting />
    <NumberDistributionSetting />
  </SettingBox>
</template>
