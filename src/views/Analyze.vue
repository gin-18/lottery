<script setup>
import { ref, onMounted } from 'vue'
import { getDataByNum } from '@/assets/js/request'
import Header from '@/components/header/Header.vue'
import FrequencyCount from '@/components/analyze/FrequencyCount.vue'
import BallCount from '@/components/analyze/BallCount.vue'
import BallIntervalCount from '@/components/analyze/BallIntervalCount.vue'
import BallRepeatCount from '@/components/analyze/BallRepeatCount.vue'

const tab = ref(null)

const allDataList = ref([]) // 所有数据

onMounted(async () => {
  await setData()
})

async function setData() {
  const res = await getDataByNum(100) // 获取近100期次的数据
  allDataList.value = res.data.list
}
</script>

<template>
  <Header />

  <v-tabs grow class="text-text" v-model="tab">
    <v-tab value="one">频率分析</v-tab>
    <v-tab value="two">号码分析</v-tab>
    <v-tab value="three">区域分析</v-tab>
    <v-tab value="four">重号分析</v-tab>
  </v-tabs>

  <v-container class="text-text">
    <v-tabs-window v-model="tab">
      <v-tabs-window-item value="one">
        <FrequencyCount :data="allDataList" />
      </v-tabs-window-item>

      <v-tabs-window-item value="two">
        <BallCount :data="allDataList" />
      </v-tabs-window-item>

      <v-tabs-window-item value="three">
        <BallIntervalCount :data="allDataList" />
      </v-tabs-window-item>

      <v-tabs-window-item value="four">
        <BallRepeatCount :data="allDataList" />
      </v-tabs-window-item>
    </v-tabs-window>
  </v-container>
</template>
