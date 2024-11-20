<script setup>
import { ref, onMounted } from 'vue'
import { getDataByNum } from '@/assets/js/request'
import Header from '@/components/header/Header.vue'
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
  <main class="px-3 pb-3 text-text bg-background">
    <v-tabs grow height="64px" v-model="tab">
      <v-tab value="one">号码分析</v-tab>
      <v-tab value="two">区域分析</v-tab>
      <v-tab value="three">重号分析</v-tab>
    </v-tabs>

    <v-tabs-window v-model="tab">
      <v-tabs-window-item value="one">
        <BallCount :data="allDataList" />
      </v-tabs-window-item>

      <v-tabs-window-item value="two">
        <BallIntervalCount :data="allDataList" />
      </v-tabs-window-item>

      <v-tabs-window-item value="three">
        <BallRepeatCount :data="allDataList" />
      </v-tabs-window-item>
    </v-tabs-window>
  </main>
</template>
