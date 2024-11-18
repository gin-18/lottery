<script setup>
import { ref, computed, onMounted } from 'vue'
import { getTheLatestData } from '@/assets/js/request.js'
import { formatDay } from '@/assets/js/formatDay.js'
import { getBallNum } from '@/assets/js/count.js'
import Header from '@/components/header/Header.vue'
import Ball from '@/components/content/Ball.vue'

const data = ref([])
const showIndex = ref([0])
const rewards = ref([
  {
    game: '选十',
    conditions: ['中10', '中9', '中8', '中7', '中6', '中5', '中0'],
    prices: ['最高500万', '8000', '800', '80', '5', '3', '2'],
  },
  {
    game: '选九',
    conditions: ['中9', '中8', '中7', '中6', '中5', '中4', '中0'],
    prices: ['300000', '2000', '200', '20', '5', '3', '2'],
  },
  {
    game: '选八',
    conditions: ['中8', '中7', '中6', '中5', '中4', '中0'],
    prices: ['50000', '800', '88', '10', '3', '2'],
  },
  {
    game: '选七',
    conditions: ['中7', '中6', '中5', '中4', '中0'],
    prices: ['10000', '288', '28', '4', '2'],
  },
  {
    game: '选六',
    conditions: ['中6', '中5', '中4', '中3'],
    prices: ['3000', '30', '10', '3'],
  },
  {
    game: '选五',
    conditions: ['中5', '中4', '中3'],
    prices: ['1000', '21', '3'],
  },
  {
    game: '选四',
    conditions: ['中4', '中3', '中2'],
    prices: ['100', '5', '3'],
  },
  {
    game: '选三',
    conditions: ['中3', '中2'],
    prices: ['53', '3'],
  },
  {
    game: '选二',
    conditions: ['中2'],
    prices: ['19'],
  },
  {
    game: '选一',
    conditions: ['中1'],
    prices: ['4.6'],
  },
])

const ballList = computed(() => getBallNum(data.value))

const tables = computed(() =>
  rewards.value
    .map((reward) => {
      return reward.conditions.map((condition, index) => ({
        game: reward.game,
        condition: condition,
        price: reward.prices[index],
        size: reward.conditions.length,
      }))
    })
    .flat(),
)

async function setTheLatestData() {
  data.value = await getTheLatestData()
}

function getShowIndex() {
  rewards.value.forEach((item, index) => {
    if (index > 0) {
      showIndex.value.push(
        showIndex.value[index - 1] + rewards.value[index - 1].conditions.length,
      )
    }
  })
}

onMounted(() => {
  getShowIndex()
  setTheLatestData()
})
</script>

<template>
  <Header />
  <main class="px-3 pb-3 text-text bg-background">
    <h3 class="pt-6 pb-2">最新开奖</h3>
    <div
      class="d-flex flex-column ga-2 mb-4 pb-4 border-0 border-b-sm border-dashed border-border"
    >
      <div class="d-flex ga-6">
        <p class="text-text">第{{ data.code }}期</p>
        <p class="text-subtext">{{ formatDay(data.day) }}</p>
      </div>

      <div class="ball-container">
        <Ball v-for="num in ballList" :key="num" :num="num" />
      </div>
    </div>

    <h3 class="pb-2">奖金对照表</h3>
    <v-table class="border-border text-text bg-background">
      <thead>
        <tr>
          <th scope="col">玩法</th>
          <th scope="col">中奖条件</th>
          <th scope="col">奖金（元）</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in tables" :key="index">
          <td :rowspan="item.size" v-show="showIndex.includes(index)">
            {{ item.game }}
          </td>
          <td>{{ item.condition }}</td>
          <td>{{ item.price }}</td>
        </tr>
      </tbody>
    </v-table>
  </main>
</template>

<style>
.ball-container {
  display: grid;
  gap: 0.5rem;
  grid-template-columns: repeat(10, 1fr);
}

th {
  font-weight: bold !important;
}
</style>
