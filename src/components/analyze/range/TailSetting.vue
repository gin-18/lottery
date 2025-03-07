<script setup>
import SettingBox from '@/components/content/SettingBox.vue'
import RepeatCountSetting from '@/components/setting/RepeatCountSetting.vue'
import IntervalCountSetting from '@/components/setting/IntervalCountSetting.vue'
import TailTimesCountSetting from '@/components/setting/TailTimesCountSetting.vue'
</script>

<template>
  <SettingBox title="尾数统计设置">
    <RepeatCountSetting />
    <IntervalCountSetting type="尾数" />
    <TailTimesCountSetting />
  </SettingBox>
</template>
