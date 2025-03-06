<script setup>
import SettingBox from '@/components/content/SettingBox.vue'
import CurrentResultSetting from '@/components/setting/CurrentResultSetting.vue'
import RepeatCountSetting from '@/components/setting/RepeatCountSetting.vue'
import TimesNumberCountSetting from '@/components/setting/TimesNumberCountSetting.vue'
import FrequencyCountSetting from '@/components/setting/FrequencyCountSetting.vue'
import OmissionCountSetting from '@/components/setting/OmissionCountSetting.vue'
import NumberDistributionSetting from '@/components/setting/NumberDistributionSetting.vue'
</script>

<template>
  <SettingBox title="号码分析设置">
    <CurrentResultSetting />
    <RepeatCountSetting />
    <TimesNumberCountSetting />
    <FrequencyCountSetting />
    <OmissionCountSetting />
    <NumberDistributionSetting />
  </SettingBox>
</template>
